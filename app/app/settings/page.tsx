import { requireContext } from "@/lib/session";
import { RenameForm } from "@/components/Forms";

export const metadata = { title: "Settings" };

export default async function Settings() {
  const { org, user, role } = await requireContext();
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="card mt-6"><RenameForm name={org.name} /></div>
      <div className="card mt-4 text-sm">
        <p><span className="text-ink/60">Account:</span> {user.email}</p>
        <p><span className="text-ink/60">Role:</span> {role}</p>
        <p><span className="text-ink/60">Workspace URL name:</span> {org.slug}</p>
      </div>
    </div>
  );
}
