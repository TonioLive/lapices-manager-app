import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function NuevaAulaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: schools } = await supabase
    .from("schools")
    .select("id, name, code")
    .order("name", { ascending: true });

  async function createClassroom(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const schoolId = String(formData.get("school_id") || "");
    const name = String(formData.get("name") || "");
    const ageGroup = String(formData.get("age_group") || "");
    const capacity = Number(formData.get("capacity") || 0);
    const tutorName = String(formData.get("tutor_name") || "");
    const academicYear = String(formData.get("academic_year") || "2025-2026");
    const active = formData.get("active") === "on";

    const { error } = await supabase.from("classrooms").insert({
      school_id: schoolId,
      name,
      age_group: ageGroup || null,
      capacity,
      tutor_name: tutorName || null,
      academic_year: academicYear,
      active,
    });

    if (error) {
      console.error(error);
      redirect("/personal/aulas/nueva?error=1");
    }

    redirect("/personal/aulas?created=1");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Aulas
            </p>

            <h1 className="text-3xl font-bold text-slate-950">Nueva aula</h1>

            <p className="mt-2 text-slate-600">
              Crea un aula y asígnala a una escuela.
            </p>
          </div>

          <Link
            href="/personal/aulas"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Volver a aulas
          </Link>
        </div>

        <form action={createClassroom} className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Datos del aula</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Escuela
                </label>
                <select
                  name="school_id"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Seleccionar escuela</option>
                  {schools?.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name} ({school.code})
                    </option>
                  ))}
                </select>
              </div>

              <Input name="name" label="Nombre del aula" required placeholder="Aula 2-3 A" />

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Grupo de edad
                </label>
                <select
                  name="age_group"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Seleccionar edad</option>
                  <option value="0-1 años">0-1 años</option>
                  <option value="1-2 años">1-2 años</option>
                  <option value="2-3 años">2-3 años</option>
                  <option value="3-4 años">3-4 años</option>
                  <option value="4-5 años">4-5 años</option>
                  <option value="5-6 años">5-6 años</option>
                </select>
              </div>

              <Input name="capacity" label="Capacidad" type="number" placeholder="20" />
              <Input name="tutor_name" label="Tutora" placeholder="Susana" />
              <Input name="academic_year" label="Curso escolar" defaultValue="2025-2026" />
            </div>

            <div className="mt-5">
              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked
                  className="mr-2"
                />
                Aula activa
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/personal/aulas"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Guardar aula
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Input({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue || ""}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
      />
    </div>
  );
}