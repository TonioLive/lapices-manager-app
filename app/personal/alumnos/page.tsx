import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AlumnosPage({
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

  const { data: students, error } = await supabase
    .from("students")
    .select(
      `
      id,
      first_name,
      last_name,
      birth_date,
      status,
      allergies,
      usual_lunch,
      usual_morning_care,
      usual_afternoon_care,
      swimming,
      english_club,
      schools (
        name,
        code
      ),
      classrooms (
        name,
        age_group
      )
    `
    )
    .order("last_name", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        {params.created === "1" && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
            ✅ Alumno creado correctamente. El formulario se ha finalizado y los
            datos ya están guardados.
          </div>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Alumnos
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Gestión de alumnos
            </h1>

            <p className="mt-2 text-slate-600">
              Listado principal de alumnos registrados en Lápices Manager.
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
              href="/personal/alumnos/nuevo"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Nuevo alumno
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            Error cargando alumnos: {error.message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Alumno</th>
                <th className="p-4">Fecha nacimiento</th>
                <th className="p-4">Escuela</th>
                <th className="p-4">Aula</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Servicios</th>
                <th className="p-4">Alergias</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {students && students.length > 0 ? (
                students.map((student: any) => (
                  <tr key={student.id} className="border-t border-slate-100">
                    <td className="p-4 font-semibold">
                      <Link
                        href={`/personal/alumnos/${student.id}`}
                        className="text-sky-700 hover:underline"
                      >
                        {student.first_name} {student.last_name}
                      </Link>
                    </td>

                    <td className="p-4">
                      {student.birth_date || "Sin fecha"}
                    </td>

                    <td className="p-4">
                      {student.schools?.name || "Sin escuela"}
                    </td>

                    <td className="p-4">
                      {student.classrooms?.name || "Sin aula"}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        {student.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {student.usual_lunch && (
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                            Comedor
                          </span>
                        )}

                        {student.usual_morning_care && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                            Matinera
                          </span>
                        )}

                        {student.usual_afternoon_care && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                            Tarde
                          </span>
                        )}

                        {student.swimming && (
                          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                            Piscina
                          </span>
                        )}

                        {student.english_club && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            English
                          </span>
                        )}

                        {!student.usual_lunch &&
                          !student.usual_morning_care &&
                          !student.usual_afternoon_care &&
                          !student.swimming &&
                          !student.english_club && (
                            <span className="text-slate-400">
                              Sin servicios
                            </span>
                          )}
                      </div>
                    </td>

                    <td className="p-4">
                      {student.allergies || "Sin alergias registradas"}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/personal/alumnos/${student.id}`}
                        className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Ver ficha
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-8 text-center text-slate-500" colSpan={8}>
                    Todavía no hay alumnos registrados.
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