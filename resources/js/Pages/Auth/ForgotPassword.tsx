import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };

  return (
    <GuestLayout
      title="Reset password"
      subtitle="Enter your email and we’ll send a reset link."
    >
      <Head title="Forgot Password" />

      <p className="mb-5 text-sm text-muted-foreground">
        Forgot your password? No problem. Share your email and we’ll send a link
        so you can choose a new one.
      </p>

      {status ? (
        <div className="mb-4 rounded-xl bg-gold-soft px-4 py-3 text-sm font-medium text-navy">
          {status}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            isFocused
            onChange={(e) => setData("email", e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <PrimaryButton className="w-full" disabled={processing}>
          Email reset link
        </PrimaryButton>

        <p className="text-center text-sm text-muted-foreground">
          <Link href={route("login")} className="font-semibold text-navy hover:text-gold">
            Back to sign in
          </Link>
        </p>
      </form>
    </GuestLayout>
  );
}
