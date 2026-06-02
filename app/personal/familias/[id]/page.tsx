import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function FichaFamiliaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; linked?: string }>;
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

  const { data: family, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !family) {
    notFound();
  }

  const { data: relatedStudents } = await supabase
    .from("student_families")
    .select(
      `
      id,
      can_pick_up,
      can_access_agenda,
      is_main_contact,
      students (
        id,
        first_name,
        last_name,
        schools (name, code),
        classrooms (name)
      )
    `
    )
    .eq("family_id", id);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-6xl">
        {query.updated === "1" && (
  <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
    ✅ Familiar actualizado correctamente.
  </div>
)}

{query.linked === "1" && (
  <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
    ✅ Alumno vinculado correctamente con esta familia.
  </div>
)}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Familias · Ficha
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              {family.first_name} {family.last_name}
            </h1>

            <p className="mt-2 text-slate-600">
              Ficha completa del familiar o tutor.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/personal/familias"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
            >
              Volver
            </Link>

            <Link
              href={`/personal/familias/${family.id}/editar`}
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Editar familia
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-xl font-bold">Datos principales</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Nombre" value={family.first_name} />
              <Info label="Apellidos" value={family.last_name} />
              <Info label="DNI/NIE" value={family.dni} />
              <Info label="Relación" value={family.relationship} />
              <Info label="Profesión" value={family.occupation} />
              <Info
                label="Método preferido"
                value={family.preferred_contact_method}
              />
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Permisos</h2>

              <ul className="space-y-3 text-sm text-slate-700">
                <li>
                  {family.authorized_pickup ? "✅" : "❌"} Recogida autorizada
                </li>
                <li>
                  {family.emergency_contact ? "✅" : "❌"} Contacto emergencia
                </li>
                <li>
                  {family.billing_contact ? "✅" : "❌"} Contacto facturación
                </li>
                <li>
                  {family.receives_communications ? "✅" : "❌"} Comunicaciones
                </li>
                <li>{family.active ? "✅" : "❌"} Activo</li>
              </ul>
            </section>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Contacto</h2>

            <div className="grid gap-4">
              <Info label="Email" value={family.email} />
              <Info label="Teléfono principal" value={family.phone} />
              <Info label="Teléfono secundario" value={family.second_phone} />
              <Info label="Teléfono trabajo" value={family.work_phone} />
              <Info label="Dirección" value={family.address} />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Observaciones</h2>

            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              {family.notes || "Sin observaciones."}
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold">Alumnos vinculados</h2>
              <p className="mt-1 text-sm text-slate-600">
                Alumnos relacionados con este familiar.
              </p>
            </div>

            <Link
              href={`/personal/familias/${family.id}/vincular-alumno`}
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Vincular alumno
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Alumno</th>
                  <th className="p-4">Escuela</th>
                  <th className="p-4">Aula</th>
                  <th className="p-4">Permisos</th>
                </tr>
              </thead>

              <tbody>
                {relatedStudents && relatedStudents.length > 0 ? (
                  relatedStudents.map((relation: any) => (
                    <tr key={relation.id} className="border-t border-slate-100">
                      <td className="p-4 font-semibold">
                        <Link
                          href={`/personal/alumnos/${relation.students?.id}`}
                          className="text-sky-700 hover:underline"
                        >
                          {relation.students?.first_name}{" "}
                          {relation.students?.last_name}
                        </Link>
                      </td>
                      <td className="p-4">
                        {relation.students?.schools?.name || "Sin escuela"}
                      </td>
                      <td className="p-4">
                        {relation.students?.classrooms?.name || "Sin aula"}
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-8 text-center text-slate-500" colSpan={4}>
                      Todavía no hay alumnos vinculados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
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