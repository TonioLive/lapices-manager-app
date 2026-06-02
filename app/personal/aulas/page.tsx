import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AulasPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: classrooms, error } = await supabase
    .from("classrooms")
    .select(
      `
      id,
      name,
      age_group,
      capacity,
      tutor_name,
      academic_year,
      active,
      schools (
        name,
        code
      )
    `
    )
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        {params.created === "1" && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
            ✅ Aula creada correctamente.
          </div>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Aulas
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Gestión de aulas
            </h1>

            <p className="mt-2 text-slate-600">
              Aulas por escuela, edad, capacidad y tutora asignada.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/personal"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
            >
              Volver
            </Link>

            <Link
              href="/personal/aulas/nueva"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Nueva aula
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            Error cargando aulas: {error.message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Aula</th>
                <th className="p-4">Escuela</th>
                <th className="p-4">Edad</th>
                <th className="p-4">Capacidad</th>
                <th className="p-4">Tutora</th>
                <th className="p-4">Curso</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>

            <tbody>
              {classrooms && classrooms.length > 0 ? (
                classrooms.map((classroom: any) => (
                  <tr key={classroom.id} className="border-t border-slate-100">
                    <td className="p-4 font-semibold">{classroom.name}</td>
                    <td className="p-4">
                      {classroom.schools?.name || "Sin escuela"}
                    </td>
                    <td className="p-4">{classroom.age_group || "No indicado"}</td>
                    <td className="p-4">{classroom.capacity || 0}</td>
                    <td className="p-4">
                      {classroom.tutor_name || "Sin tutora"}
                    </td>
                    <td className="p-4">{classroom.academic_year}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          classroom.active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {classroom.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-8 text-center text-slate-500" colSpan={7}>
                    Todavía no hay aulas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}