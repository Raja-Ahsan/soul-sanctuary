import PrimaryButton from "@/components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };

  return (
    <GuestLayout
      title="Verify your email"
      subtitle="Confirm your email address to finish setting up your account."
    >
      <Head title="Email Verification" />

      <p className="mb-5 text-sm text-muted-foreground">
        Thanks for signing up. Please verify your email using the link we sent
        you. If it didn’t arrive, we can send another.
      </p>

      {status === "verification-link-sent" ? (
        <div className="mb-4 rounded-xl bg-gold-soft px-4 py-3 text-sm font-medium text-navy">
          A new verification link has been sent to your email address.
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-4">
        <PrimaryButton className="w-full" disabled={processing}>
          Resend verification email
        </PrimaryButton>

        <div className="text-center">
          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="text-sm font-semibold text-navy hover:text-gold"
          >
            Log out
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
