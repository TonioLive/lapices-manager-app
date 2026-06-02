import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function FichaAlumnoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: student, error } = await supabase
    .from("students")
    .select(
      `
      *,
      schools (
        id,
        name,
        code
      ),
      classrooms (
        id,
        name,
        age_group
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !student) {
    notFound();
  }

  const { data: relatedFamilies } = await supabase
    .from("student_families")
    .select(
      `
      id,
      can_pick_up,
      can_access_agenda,
      is_main_contact,
      families (
        id,
        first_name,
        last_name,
        relationship,
        phone,
        email,
        authorized_pickup,
        emergency_contact,
        billing_contact
      )
    `
    )
    .eq("student_id", id);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-6xl">
        {query.updated === "1" && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
            ✅ Alumno actualizado correctamente. Los cambios ya están guardados.
          </div>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Alumnos · Ficha
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              {student.first_name} {student.last_name}
            </h1>

            <p className="mt-2 text-slate-600">
              Ficha completa del alumno en Lápices Manager.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/personal/alumnos"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
            >
              Volver
            </Link>

            <Link
              href={`/personal/alumnos/${student.id}/editar`}
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Editar alumno
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-xl font-bold">Datos principales</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Nombre" value={student.first_name} />
              <Info label="Apellidos" value={student.last_name} />
              <Info label="Nombre habitual" value={student.preferred_name} />
              <Info label="Sexo" value={student.gender} />
              <Info label="Fecha de nacimiento" value={student.birth_date} />
              <Info label="Fecha de alta" value={student.enrollment_date} />
              <Info label="Curso escolar" value={student.academic_year} />
              <Info label="Estado" value={student.status} />
              <Info label="Escuela" value={student.schools?.name} />
              <Info label="Aula" value={student.classrooms?.name} />
              <Info label="Tipo de jornada" value={student.schedule_type} />
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Servicios</h2>

              <ul className="space-y-3 text-sm text-slate-700">
                <li>{student.usual_lunch ? "✅" : "❌"} Comedor habitual</li>
                <li>
                  {student.usual_morning_care ? "✅" : "❌"} Matinera habitual
                </li>
                <li>
                  {student.usual_afternoon_care ? "✅" : "❌"} Tarde habitual
                </li>
                <li>{student.swimming ? "✅" : "❌"} Piscina NeoKids</li>
                <li>
                  {student.english_club ? "✅" : "❌"} NeoKids English Club
                </li>
              </ul>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Autorizaciones</h2>

              <ul className="space-y-3 text-sm text-slate-700">
                <li>{student.image_authorization ? "✅" : "❌"} Imagen</li>
                <li>{student.outing_authorization ? "✅" : "❌"} Salidas</li>
                <li>
                  {student.medication_authorization ? "✅" : "❌"} Medicación
                </li>
              </ul>
            </section>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Salud</h2>

            <div className="grid gap-4">
              <Info label="Alergias" value={student.allergies} />
              <Info
                label="Contacto emergencia"
                value={student.emergency_contact_name}
              />
              <Info
                label="Teléfono emergencia"
                value={student.emergency_contact_phone}
              />
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-700">
                Observaciones médicas
              </p>

              <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {student.medical_notes || "Sin observaciones médicas."}
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Notas internas</h2>

            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              {student.internal_notes || "Sin notas internas."}
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold">Familias vinculadas</h2>
              <p className="mt-1 text-sm text-slate-600">
                Padres, madres, tutores o familiares asociados al alumno.
              </p>
            </div>

            <Link
              href="/personal/familias"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Gestionar familias
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Familiar</th>
                  <th className="p-4">Relación</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Permisos</th>
                </tr>
              </thead>

              <tbody>
                {relatedFamilies && relatedFamilies.length > 0 ? (
                  relatedFamilies.map((relation: any) => (
                    <tr key={relation.id} className="border-t border-slate-100">
                      <td className="p-4 font-semibold">
                        <Link
                          href={`/personal/familias/${relation.families?.id}`}
                          className="text-sky-700 hover:underline"
                        >
                          {relation.families?.first_name}{" "}
                          {relation.families?.last_name}
                        </Link>
                      </td>

                      <td className="p-4 capitalize">
                        {relation.families?.relationship || "No indicado"}
                      </td>

                      <td className="p-4">
                        {relation.families?.phone || "Sin teléfono"}
                      </td>

                      <td className="p-4">
                        {relation.families?.email || "Sin email"}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {relation.can_pick_up && (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                              Recogida
                            </span>
                          )}

                          {relation.can_access_agenda && (
                            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                              Agenda
                            </span>
                          )}

                          {relation.is_main_contact && (
                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                              Principal
                            </span>
                          )}

                          {!relation.can_pick_up &&
                            !relation.can_access_agenda &&
                            !relation.is_main_contact && (
                              <span className="text-slate-400">
                                Sin permisos
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-8 text-center text-slate-500" colSpan={5}>
                      Todavía no hay familias vinculadas a este alumno.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Link
            href="/personal/agenda"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">📒</div>
            <h3 className="mt-4 text-lg font-bold">Agenda diaria</h3>
            <p className="mt-2 text-sm text-slate-600">
              Ver asistencia, comedor, actividades y observaciones del alumno.
            </p>
          </Link>

          <Link
            href="/personal/objetivos"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">🎯</div>
            <h3 className="mt-4 text-lg font-bold">Objetivos</h3>
            <p className="mt-2 text-sm text-slate-600">
              Consultar y actualizar el seguimiento educativo individual.
            </p>
          </Link>

          <Link
            href="/personal/mensajes"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">💬</div>
            <h3 className="mt-4 text-lg font-bold">Mensajes</h3>
            <p className="mt-2 text-sm text-slate-600">
              Revisar comunicaciones privadas relacionadas con la familia.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "No indicado"}
      </p>
    </div>
  );
}