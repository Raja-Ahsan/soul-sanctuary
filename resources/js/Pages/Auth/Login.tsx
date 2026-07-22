import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false as boolean,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <GuestLayout
      title="Welcome back"
      subtitle="Sign in to the Soul Sanctuary operations dashboard."
    >
      <Head title="Log in" />

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
            autoComplete="username"
            isFocused
            onChange={(e) => setData("email", e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="space-y-2">
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => setData("password", e.target.value)}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>

          {canResetPassword ? (
            <Link
              href={route("password.request")}
              className="text-sm font-medium text-navy hover:text-gold"
            >
              Forgot password?
            </Link>
          ) : null}
        </div>

        <PrimaryButton className="w-full" disabled={processing}>
          Sign in
        </PrimaryButton>

        <p className="text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href={route("register")} className="font-semibold text-navy hover:text-gold">
            Register
          </Link>
        </p>
      </form>
    </GuestLayout>
  );
}
