import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default async function PersonalCocinaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = params.date || getTodayDate();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: attendanceRows, error } = await supabase
    .from("daily_attendance")
    .select(
      `
      id,
      date,
      has_lunch,
      is_present,
      students (
        id,
        first_name,
        last_name,
        allergies
      ),
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
    .eq("date", selectedDate)
    .eq("has_lunch", true)
    .eq("is_present", true);

  const rows = attendanceRows || [];

  const totalLunch = rows.length;
  const allergyRows = rows.filter((row: any) => row.students?.allergies);

  const schoolSummary = new Map();
  const classroomSummary = new Map();

  rows.forEach((row: any) => {
    const schoolKey = row.schools?.id || "sin-escuela";
    const schoolName = row.schools?.name || "Sin escuela";
    const schoolCode = row.schools?.code || "-";

    if (!schoolSummary.has(schoolKey)) {
      schoolSummary.set(schoolKey, {
        name: schoolName,
        code: schoolCode,
        total: 0,
      });
    }

    schoolSummary.get(schoolKey).total += 1;

    const classroomKey = row.classrooms?.id || "sin-aula";
    const classroomName = row.classrooms?.name || "Sin aula";
    const classroomAge = row.classrooms?.age_group || "";
    const combinedKey = `${schoolKey}-${classroomKey}`;

    if (!classroomSummary.has(combinedKey)) {
      classroomSummary.set(combinedKey, {
        school: schoolCode,
        classroom: classroomName,
        age: classroomAge,
        total: 0,
      });
    }

    classroomSummary.get(combinedKey).total += 1;
  });

  const schoolSummaryList = Array.from(schoolSummary.values());
  const classroomSummaryList = Array.from(classroomSummary.values());

  return (
    <main className="min-h-screen bg-orange-50 p-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-orange-700">
              Personal · Cocina
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Comedor del día
            </h1>

            <p className="mt-2 text-slate-600">
              Resumen automático de alumnos presentes que se quedan a comer.
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
              href="/personal/agenda"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-bold text-white shadow-sm"
            >
              Ir a agenda
            </Link>
          </div>
        </div>

        <form method="get" className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Fecha
              </label>

              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Ver comedor
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            Error cargando cocina: {error.message}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Fecha</p>
            <p className="mt-2 text-2xl font-bold">{selectedDate}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total comedor</p>
            <p className="mt-2 text-4xl font-bold">{totalLunch}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Alergias</p>
            <p className="mt-2 text-4xl font-bold">{allergyRows.length}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Aulas con comedor</p>
            <p className="mt-2 text-4xl font-bold">
              {classroomSummaryList.length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Resumen por escuela</h2>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">Escuela</th>
                    <th className="p-4">Código</th>
                    <th className="p-4">Comensales</th>
                  </tr>
                </thead>

                <tbody>
                  {schoolSummaryList.length > 0 ? (
                    schoolSummaryList.map((school: any) => (
                      <tr
                        key={school.code}
                        className="border-t border-slate-100"
                      >
                        <td className="p-4 font-semibold">{school.name}</td>
                        <td className="p-4">{school.code}</td>
                        <td className="p-4 font-bold">{school.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-8 text-center text-slate-500" colSpan={3}>
                        No hay comensales registrados para esta fecha.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Resumen por aula</h2>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">Escuela</th>
                    <th className="p-4">Aula</th>
                    <th className="p-4">Comensales</th>
                  </tr>
                </thead>

                <tbody>
                  {classroomSummaryList.length > 0 ? (
                    classroomSummaryList.map((classroom: any) => (
                      <tr
                        key={`${classroom.school}-${classroom.classroom}`}
                        className="border-t border-slate-100"
                      >
                        <td className="p-4">{classroom.school}</td>
                        <td className="p-4 font-semibold">
                          {classroom.classroom}
                        </td>
                        <td className="p-4 font-bold">{classroom.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-8 text-center text-slate-500" colSpan={3}>
                        No hay aulas con comedor para esta fecha.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">Alertas alimentarias</h2>

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-red-50 text-red-700">
                <tr>
                  <th className="p-4">Alumno</th>
                  <th className="p-4">Escuela</th>
                  <th className="p-4">Aula</th>
                  <th className="p-4">Alergia / nota</th>
                </tr>
              </thead>

              <tbody>
                {allergyRows.length > 0 ? (
                  allergyRows.map((row: any) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="p-4 font-semibold">
                        {row.students?.first_name} {row.students?.last_name}
                      </td>
                      <td className="p-4">
                        {row.schools?.name || "Sin escuela"}
                      </td>
                      <td className="p-4">
                        {row.classrooms?.name || "Sin aula"}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                          {row.students?.allergies}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-8 text-center text-slate-500" colSpan={4}>
                      No hay alertas alimentarias para esta fecha.
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