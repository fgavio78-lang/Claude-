import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-neutral-900">
          Personal Shopper
        </Link>
        <nav className="flex gap-4 text-sm text-neutral-600">
          <Link href="/onboarding" className="hover:text-neutral-900">
            Onboarding
          </Link>
          <Link href="/proyectos/nuevo" className="hover:text-neutral-900">
            Nuevo proyecto
          </Link>
        </nav>
      </div>
    </header>
  );
}
