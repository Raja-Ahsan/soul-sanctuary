import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <>
      <Head title="Profile" />

      <div className="space-y-6">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
            className="max-w-xl"
          />
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <UpdatePasswordForm className="max-w-xl" />
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <DeleteUserForm className="max-w-xl" />
        </div>
      </div>
    </>
  );
}
