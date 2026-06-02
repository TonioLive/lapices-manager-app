import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm">
          Lápices Manager · Plataforma de gestión educativa
        </div>

        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Gestión escolar, agenda familiar y cocina en una sola plataforma.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Sistema interno para Lápices Escuelas Infantiles: alumnos, familias,
            aulas, asistencia, comedor, matinera, tardes, comunicados,
            documentos, mensajes, cocina, matrículas y CRM.
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-4xl gap-4 md:grid-cols-3">
          <Link
            href="/personal"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">👩‍🏫</div>
            <h2 className="mt-4 text-xl font-bold">Personal</h2>
            <p className="mt-2 text-sm text-slate-600">
              Acceso para dirección, administración, profesorado y coordinación.
            </p>
          </Link>

          <Link
            href="/familias"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">👨‍👩‍👧</div>
            <h2 className="mt-4 text-xl font-bold">Familias</h2>
            <p className="mt-2 text-sm text-slate-600">
              Agenda diaria, comedor, comunicados, documentos y mensajes.
            </p>
          </Link>

          <Link
            href="/cocina"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">🍽️</div>
            <h2 className="mt-4 text-xl font-bold">Cocina</h2>
            <p className="mt-2 text-sm text-slate-600">
              Comensales por escuela, aulas, alergias y calendario de menús.
            </p>
          </Link>
        </div>

        <Link
          href="/login"
          className="mt-10 rounded-full bg-sky-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
        >
          Entrar a la plataforma
        </Link>
      </section>
    </main>
  );
}