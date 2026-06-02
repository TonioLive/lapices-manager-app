import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function VincularAlumnoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("id", id)
    .single();

  if (familyError || !family) {
    notFound();
  }

  const { data: students } = await supabase
    .from("students")
    .select(
      `
      id,
      first_name,
      last_name,
      schools (
        name,
        code
      ),
      classrooms (
        name
      )
    `
    )
    .order("last_name", { ascending: true });

  async function linkStudent(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const studentId = String(formData.get("student_id") || "");
    const canPickUp = formData.get("can_pick_up") === "on";
    const canAccessAgenda = formData.get("can_access_agenda") === "on";
    const isMainContact = formData.get("is_main_contact") === "on";

    if (!studentId) {
      redirect(`/personal/familias/${id}/vincular-alumno?error=1`);
    }

    const { error } = await supabase.from("student_families").insert({
      student_id: studentId,
      family_id: id,
      can_pick_up: canPickUp,
      can_access_agenda: canAccessAgenda,
      is_main_contact: isMainContact,
    });

    if (error) {
      console.error(error);
      redirect(`/personal/familias/${id}/vincular-alumno?error=1`);
    }

    redirect(`/personal/familias/${id}?linked=1`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Familias · Vincular alumno
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Vincular alumno
            </h1>

            <p className="mt-2 text-slate-600">
              Vas a vincular un alumno con {family.first_name}{" "}
              {family.last_name}.
            </p>
          </div>

          <Link
            href={`/personal/familias/${family.id}`}
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Volver a la ficha
          </Link>
        </div>

        <form action={linkStudent} className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Seleccionar alumno</h2>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Alumno
              </label>

              <select
                name="student_id"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              >
                <option value="">Seleccionar alumno</option>

                {students?.map((student: any) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} ·{" "}
                    {student.schools?.code || "Sin escuela"} ·{" "}
                    {student.classrooms?.name || "Sin aula"}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Permisos sobre el alumno</h2>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="can_pick_up" type="checkbox" className="mr-2" />
                Puede recoger
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input
                  name="can_access_agenda"
                  type="checkbox"
                  defaultChecked
                  className="mr-2"
                />
                Puede ver agenda
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input
                  name="is_main_contact"
                  type="checkbox"
                  className="mr-2"
                />
                Contacto principal
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href={`/personal/familias/${family.id}`}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Vincular alumno
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}