import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function NuevoAlumnoPage() {
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

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name, age_group, school_id")
    .order("name", { ascending: true });

  async function createStudent(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const firstName = String(formData.get("first_name") || "");
    const lastName = String(formData.get("last_name") || "");
    const preferredName = String(formData.get("preferred_name") || "");
    const gender = String(formData.get("gender") || "no_especificado");
    const birthDate = String(formData.get("birth_date") || "");
    const enrollmentDate = String(formData.get("enrollment_date") || "");
    const schoolId = String(formData.get("school_id") || "");
    const classroomId = String(formData.get("classroom_id") || "");
    const academicYear = String(formData.get("academic_year") || "2025-2026");
    const status = String(formData.get("status") || "activo");
    const scheduleType = String(formData.get("schedule_type") || "jornada_completa");

    const allergies = String(formData.get("allergies") || "");
    const medicalNotes = String(formData.get("medical_notes") || "");
    const internalNotes = String(formData.get("internal_notes") || "");
    const emergencyContactName = String(formData.get("emergency_contact_name") || "");
    const emergencyContactPhone = String(formData.get("emergency_contact_phone") || "");

    const usualLunch = formData.get("usual_lunch") === "on";
    const usualMorningCare = formData.get("usual_morning_care") === "on";
    const usualAfternoonCare = formData.get("usual_afternoon_care") === "on";
    const swimming = formData.get("swimming") === "on";
    const englishClub = formData.get("english_club") === "on";
    const imageAuthorization = formData.get("image_authorization") === "on";
    const outingAuthorization = formData.get("outing_authorization") === "on";
    const medicationAuthorization = formData.get("medication_authorization") === "on";

    const { error } = await supabase.from("students").insert({
      first_name: firstName,
      last_name: lastName,
      preferred_name: preferredName || null,
      gender,
      birth_date: birthDate || null,
      enrollment_date: enrollmentDate || null,
      school_id: schoolId || null,
      classroom_id: classroomId || null,
      academic_year: academicYear,
      status,
      schedule_type: scheduleType,
      allergies: allergies || null,
      medical_notes: medicalNotes || null,
      internal_notes: internalNotes || null,
      emergency_contact_name: emergencyContactName || null,
      emergency_contact_phone: emergencyContactPhone || null,
      usual_lunch: usualLunch,
      usual_morning_care: usualMorningCare,
      usual_afternoon_care: usualAfternoonCare,
      swimming,
      english_club: englishClub,
      image_authorization: imageAuthorization,
      outing_authorization: outingAuthorization,
      medication_authorization: medicationAuthorization,
    });

    if (error) {
      console.error(error);
      redirect("/personal/alumnos/nuevo?error=1");
    }

    redirect("/personal/alumnos?created=1");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Alumnos
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              Nuevo alumno
            </h1>
            <p className="mt-2 text-slate-600">
              Alta completa del alumno en Lápices Manager.
            </p>
          </div>

          <Link
            href="/personal/alumnos"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Volver a alumnos
          </Link>
        </div>

        <form action={createStudent} className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Datos del alumno</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Nombre
                </label>
                <input
                  name="first_name"
                  required
                  placeholder="Martín"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Apellidos
                </label>
                <input
                  name="last_name"
                  required
                  placeholder="García Pérez"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Nombre habitual
                </label>
                <input
                  name="preferred_name"
                  placeholder="Ej. Martí, Lucas..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Sexo
                </label>
                <select
                  name="gender"
                  defaultValue="no_especificado"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="no_especificado">No especificado</option>
                  <option value="niño">Niño</option>
                  <option value="niña">Niña</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Fecha de nacimiento
                </label>
                <input
                  name="birth_date"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Fecha de alta
                </label>
                <input
                  name="enrollment_date"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Centro, aula y curso</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Escuela
                </label>
                <select
                  name="school_id"
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

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Aula
                </label>
                <select
                  name="classroom_id"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Seleccionar aula</option>
                  {classrooms?.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} · {classroom.age_group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Curso escolar
                </label>
                <input
                  name="academic_year"
                  defaultValue="2025-2026"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Estado
                </label>
                <select
                  name="status"
                  defaultValue="activo"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="reserva">Reserva</option>
                  <option value="lista_espera">Lista de espera</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Horario y servicios</h2>

            <div className="mb-5">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Tipo de jornada
              </label>
              <select
                name="schedule_type"
                defaultValue="jornada_completa"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              >
                <option value="mañana">Mañana</option>
                <option value="mañana_comedor">Mañana + comedor</option>
                <option value="jornada_completa">Jornada completa</option>
                <option value="tarde">Tarde</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="usual_lunch" type="checkbox" className="mr-2" />
                Comedor habitual
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="usual_morning_care" type="checkbox" className="mr-2" />
                Matinera habitual
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="usual_afternoon_care" type="checkbox" className="mr-2" />
                Tarde habitual
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="swimming" type="checkbox" className="mr-2" />
                Piscina NeoKids
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="english_club" type="checkbox" className="mr-2" />
                NeoKids English Club
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Salud y autorizaciones</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Alergias
                </label>
                <input
                  name="allergies"
                  placeholder="Ej. huevo, lactosa..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Teléfono de emergencia
                </label>
                <input
                  name="emergency_contact_phone"
                  placeholder="600 000 000"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Contacto de emergencia
                </label>
                <input
                  name="emergency_contact_name"
                  placeholder="Nombre y relación"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="image_authorization" type="checkbox" className="mr-2" />
                Autoriza imagen
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="outing_authorization" type="checkbox" className="mr-2" />
                Autoriza salidas
              </label>

              <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
                <input name="medication_authorization" type="checkbox" className="mr-2" />
                Autoriza medicación
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Observaciones médicas
                </label>
                <textarea
                  name="medical_notes"
                  rows={4}
                  placeholder="Información médica relevante."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Observaciones internas
                </label>
                <textarea
                  name="internal_notes"
                  rows={4}
                  placeholder="Notas internas para el personal."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/personal/alumnos"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Guardar alumno
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}