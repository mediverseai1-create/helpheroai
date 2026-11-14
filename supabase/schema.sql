-- HelpHeroAI schema. Run in Supabase SQL editor (or `supabase db push`).
create extension if not exists pgcrypto;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,40}$'),
  plan text not null default 'trial' check (plan in ('trial','starter','growth','scale')),
  subscription_status text not null default 'trialing' check (subscription_status in ('trialing','active','past_due','canceled')),
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  billing_customer_ref text,
  created_at timestamptz not null default now()
);

create table public.members (
  org_id uuid not null references public.organizations on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null default 'agent' check (role in ('owner','admin','agent')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  title text not null check (char_length(title) between 2 and 200),
  body text not null check (char_length(body) between 1 and 20000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  customer_name text not null default 'Visitor',
  customer_email text,
  subject text not null default 'New conversation',
  status text not null default 'open' check (status in ('open','ai_resolved','needs_human','closed')),
  assignee uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations on delete cascade,
  org_id uuid not null references public.organizations on delete cascade,
  sender text not null check (sender in ('customer','agent','ai')),
  body text not null check (char_length(body) between 1 and 8000),
  confidence numeric check (confidence between 0 and 1),
  source_article_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.usage_events (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.organizations on delete cascade,
  kind text not null check (kind in ('ai_reply')),
  created_at timestamptz not null default now()
);

create index on public.members (user_id);
create index on public.articles (org_id);
create index on public.conversations (org_id, updated_at desc);
create index on public.messages (conversation_id, created_at);
create index on public.usage_events (org_id, created_at);

create or replace function public.is_member(o uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.members where org_id = o and user_id = auth.uid()) $$;

create or replace function public.is_admin(o uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.members where org_id = o and user_id = auth.uid() and role in ('owner','admin')) $$;

-- Workspace creation: caller becomes owner. Atomic and the only way to create an org.
create or replace function public.create_workspace(p_name text, p_slug text) returns uuid
language plpgsql security definer set search_path = public as $$
declare oid uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.organizations (name, slug) values (p_name, p_slug) returning id into oid;
  insert into public.members (org_id, user_id, role) values (oid, auth.uid(), 'owner');
  return oid;
end $$;
revoke all on function public.create_workspace(text, text) from public, anon;
grant execute on function public.create_workspace(text, text) to authenticated;

alter table public.organizations enable row level security;
alter table public.members enable row level security;
alter table public.articles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.usage_events enable row level security;

-- organizations: members read; admins may rename only. Plan/status changes are service-role only.
create policy org_read on public.organizations for select using (public.is_member(id));
create policy org_update on public.organizations for update using (public.is_admin(id)) with check (public.is_admin(id));
revoke update on public.organizations from authenticated, anon;
grant update (name) on public.organizations to authenticated;

create policy members_read on public.members for select using (public.is_member(org_id));

create policy articles_all on public.articles for all using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy conv_all on public.conversations for all using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy msg_all on public.messages for all using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy usage_read on public.usage_events for select using (public.is_member(org_id));
-- usage inserts happen server-side with the service role only.
