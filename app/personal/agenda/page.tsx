import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    classroom_id?: string;
    saved?: string;
  }>;
}) {
  const params = await searchParams;

  const selectedDate = params.date || getTodayDate();
  const selectedClassroomId = params.classroom_id || "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select(
      `
      id,
      name,
      age_group,
      schools (
        id,
        name,
        code
      )
    `
    )
    .eq("active", true)
    .order("name", { ascending: true });

  const { data: students } = selectedClassroomId
    ? await supabase
        .from("students")
        .select(
          `
          id,
          first_name,
          last_name,
          classroom_id,
          school_id,
          allergies,
          usual_lunch,
          usual_morning_care,
          usual_afternoon_care,
          schools (
            id,
            name,
            code
          ),
          classrooms (
            id,
            name
          )
        `
        )
        .eq("classroom_id", selectedClassroomId)
        .eq("status", "activo")
        .order("last_name", { ascending: true })
    : { data: [] };

  const { data: attendanceRows } =
    selectedClassroomId && selectedDate
      ? await supabase
          .from("daily_attendance")
          .select("*")
          .eq("date", selectedDate)
          .eq("classroom_id", selectedClassroomId)
      : { data: [] };

  const attendanceMap = new Map();

  attendanceRows?.forEach((row: any) => {
    attendanceMap.set(row.student_id, row);
  });

  async function saveAgenda(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const date = String(formData.get("date") || "");
    const classroomId = String(formData.get("classroom_id") || "");
    const studentIds = formData.getAll("student_id").map(String);

    for (const studentId of studentIds) {
      const schoolId = String(formData.get(`school_id_${studentId}`) || "");
      const arrivalTime = String(formData.get(`arrival_time_${studentId}`) || "");
      const notes = String(formData.get(`notes_${studentId}`) || "");

      const isPresent = formData.get(`is_present_${studentId}`) === "on";
      const hasLunch = formData.get(`has_lunch_${studentId}`) === "on";
      const hasMorningCare =
        formData.get(`has_morning_care_${studentId}`) === "on";
      const hasAfternoonCare =
        formData.get(`has_afternoon_care_${studentId}`) === "on";

      await supabase.from("daily_attendance").upsert(
        {
          student_id: studentId,
          classroom_id: classroomId || null,
          school_id: schoolId || null,
          date,
          is_present: isPresent,
          arrival_time: arrivalTime || null,
          has_lunch: hasLunch,
          has_morning_care: hasMorningCare,
          has_afternoon_care: hasAfternoonCare,
          notes: notes || null,
          created_by: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "student_id,date",
        }
      );
    }

    redirect(`/personal/agenda?date=${date}&classroom_id=${classroomId}&saved=1`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        {params.saved === "1" && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 text-sm font-bold text-green-700 shadow-sm">
            ✅ Agenda guardada correctamente. Los datos de asistencia, comedor,
            matinera y tarde ya están registrados.
          </div>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Agenda diaria
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Agenda diaria del aula
            </h1>

            <p className="mt-2 text-slate-600">
              Pasa lista, marca comedor, matinera, tarde y observaciones del día.
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
              href="/personal/cocina"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Ver cocina
            </Link>
          </div>
        </div>

        <form
          method="get"
          className="mb-8 rounded-3xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-bold">Seleccionar día y aula</h2>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Fecha
              </label>

              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Aula
              </label>

              <select
                name="classroom_id"
                defaultValue={selectedClassroomId}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              >
                <option value="">Seleccionar aula</option>

                {classrooms?.map((classroom: any) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} · {classroom.schools?.code || "Sin escuela"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Cargar aula
              </button>
            </div>
          </div>
        </form>

        {!selectedClassroomId && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">📒</div>
            <h2 className="mt-4 text-xl font-bold">
              Selecciona un aula para comenzar
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cuando elijas fecha y aula, aparecerá el listado de alumnos para
              pasar la agenda diaria.
            </p>
          </div>
        )}

        {selectedClassroomId && (
          <form action={saveAgenda} className="space-y-6">
            <input type="hidden" name="date" value={selectedDate} />
            <input
              type="hidden"
              name="classroom_id"
              value={selectedClassroomId}
            />

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold">Listado de alumnos</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Fecha seleccionada: {selectedDate}
                  </p>
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Guardar agenda
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="p-4">Alumno</th>
                      <th className="p-4">Asiste</th>
                      <th className="p-4">Entrada</th>
                      <th className="p-4">Comedor</th>
                      <th className="p-4">Matinera</th>
                      <th className="p-4">Tarde</th>
                      <th className="p-4">Alergias</th>
                      <th className="p-4">Observaciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students && students.length > 0 ? (
                      students.map((student: any) => {
                        const attendance = attendanceMap.get(student.id);

                        return (
                          <tr
                            key={student.id}
                            className="border-t border-slate-100"
                          >
                            <td className="p-4 font-semibold">
                              <input
                                type="hidden"
                                name="student_id"
                                value={student.id}
                              />

                              <input
                                type="hidden"
                                name={`school_id_${student.id}`}
                                value={student.school_id || ""}
                              />

                              <Link
                                href={`/personal/alumnos/${student.id}`}
                                className="text-sky-700 hover:underline"
                              >
                                {student.first_name} {student.last_name}
                              </Link>

                              <p className="mt-1 text-xs font-normal text-slate-500">
                                {student.schools?.code || "Sin escuela"} ·{" "}
                                {student.classrooms?.name || "Sin aula"}
                              </p>
                            </td>

                            <td className="p-4">
                              <input
                                name={`is_present_${student.id}`}
                                type="checkbox"
                                defaultChecked={attendance?.is_present || false}
                                className="h-5 w-5"
                              />
                            </td>

                            <td className="p-4">
                              <input
                                name={`arrival_time_${student.id}`}
                                type="time"
                                defaultValue={attendance?.arrival_time || ""}
                                className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                              />
                            </td>

                            <td className="p-4">
                              <input
                                name={`has_lunch_${student.id}`}
                                type="checkbox"
                                defaultChecked={
                                  attendance?.has_lunch ??
                                  student.usual_lunch ??
                                  false
                                }
                                className="h-5 w-5"
                              />
                            </td>

                            <td className="p-4">
                              <input
                                name={`has_morning_care_${student.id}`}
                                type="checkbox"
                                defaultChecked={
                                  attendance?.has_morning_care ??
                                  student.usual_morning_care ??
                                  false
                                }
                                className="h-5 w-5"
                              />
                            </td>

                            <td className="p-4">
                              <input
                                name={`has_afternoon_care_${student.id}`}
                                type="checkbox"
                                defaultChecked={
                                  attendance?.has_afternoon_care ??
                                  student.usual_afternoon_care ??
                                  false
                                }
                                className="h-5 w-5"
                              />
                            </td>

                            <td className="p-4">
                              {student.allergies ? (
                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                                  {student.allergies}
                                </span>
                              ) : (
                                <span className="text-slate-400">
                                  Sin alergias
                                </span>
                              )}
                            </td>

                            <td className="p-4">
                              <input
                                name={`notes_${student.id}`}
                                defaultValue={attendance?.notes || ""}
                                placeholder="Observación rápida"
                                className="w-full min-w-56 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          className="p-8 text-center text-slate-500"
                          colSpan={8}
                        >
                          No hay alumnos activos en esta aula.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
                >
                  Guardar agenda
                </button>
              </div>
            </section>
          </form>
        )}
      </section>
    </main>
  );
}