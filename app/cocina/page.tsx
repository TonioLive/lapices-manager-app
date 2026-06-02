import Link from "next/link";

export default function CocinaPublicPage() {
  return (
    <main className="min-h-screen bg-orange-50 p-6 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-4xl">
            🍽️
          </div>

          <p className="text-sm font-semibold text-orange-700">
            Lápices Manager · Cocina
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Panel de cocina
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Accede al resumen diario de comedor, comensales por escuela,
            comensales por aula y alertas alimentarias.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/personal/cocina"
              className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Entrar al panel de cocina
            </Link>

            <Link
              href="/"
              className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}