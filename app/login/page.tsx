import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-3xl">
            ✏️
          </div>
          <h1 className="text-2xl font-bold text-slate-950">
            Acceso a Lápices Manager
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Inicia sesión para acceder a tu panel.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="usuario@lapices.es"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-sky-600">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}