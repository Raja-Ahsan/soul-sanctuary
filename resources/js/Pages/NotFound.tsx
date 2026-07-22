import { Link } from "@inertiajs/react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf1e2] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-bold text-[#2a1a0e]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#2a1a0e]">Page not found</h2>
        <p className="mt-2 text-sm text-[#7c5c3a]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-[#e2542f] underline underline-offset-4">
          Return home
        </Link>
      </div>
    </div>
  );
}
