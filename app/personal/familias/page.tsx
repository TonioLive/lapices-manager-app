import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function FamiliasPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: families, error } = await supabase
    .from("families")
    .select(
      `
      id,
      first_name,
      last_name,
      dni,
      email,
      phone,
      second_phone,
      relationship,
      preferred_contact_method,
      authorized_pickup,
      emergency_contact,
      billing_contact,
      receives_communications,
      active
    `
    )
    .order("last_name", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        {params.created === "1" && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
            ✅ Familiar creado correctamente. Los datos ya están guardados.
          </div>
        )}

        {params.updated === "1" && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
            ✅ Familiar actualizado correctamente.
          </div>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Familias
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Gestión de familias
            </h1>

            <p className="mt-2 text-slate-600">
              Listado de padres, madres, tutores y familiares autorizados.
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
              href="/personal/familias/nuevo"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Nueva familia
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            Error cargando familias: {error.message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Familiar</th>
                <th className="p-4">Relación</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Email</th>
                <th className="p-4">Permisos</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {families && families.length > 0 ? (
                families.map((family: any) => (
                  <tr key={family.id} className="border-t border-slate-100">
                    <td className="p-4 font-semibold">
                      <Link
                        href={`/personal/familias/${family.id}`}
                        className="text-sky-700 hover:underline"
                      >
                        {family.first_name} {family.last_name}
                      </Link>
                      <p className="mt-1 text-xs font-normal text-slate-500">
                        DNI: {family.dni || "No indicado"}
                      </p>
                    </td>

                    <td className="p-4 capitalize">
                      {family.relationship || "No indicada"}
                    </td>

                    <td className="p-4">
                      <p>{family.phone || "Sin teléfono"}</p>
                      {family.second_phone && (
                        <p className="text-xs text-slate-500">
                          {family.second_phone}
                        </p>
                      )}
                    </td>

                    <td className="p-4">{family.email || "Sin email"}</td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {family.authorized_pickup && (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            Recogida
                          </span>
                        )}

                        {family.emergency_contact && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                            Emergencia
                          </span>
                        )}

                        {family.billing_contact && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                            Facturación
                          </span>
                        )}

                        {family.receives_communications && (
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                            Comunicaciones
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          family.active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {family.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/personal/familias/${family.id}`}
                        className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Ver ficha
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-8 text-center text-slate-500" colSpan={7}>
                    Todavía no hay familias registradas.
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