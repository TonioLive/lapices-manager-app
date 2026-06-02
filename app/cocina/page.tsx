import Link from "next/link";

const schools = [
  ["General Avilés", 72, 3],
  ["Río Nervión", 36, 2],
  ["Fernando el Católico", 41, 1],
  ["Vicente Branchat", 28, 1],
  ["Benicalap", 90, 5],
];

export default function CocinaPage() {
  const total = schools.reduce((sum, school) => sum + Number(school[1]), 0);

  return (
    <main className="min-h-screen bg-orange-50 p-6 text-slate-900">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-orange-700">
              Panel de cocina
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              Comedor de hoy
            </h1>
            <p className="mt-2 text-slate-600">
              Resumen diario de alumnos que se quedan a comer por escuela.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Inicio
          </Link>
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total comensales hoy</p>
          <p className="mt-2 text-5xl font-bold">{total}</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Escuela</th>
                <th className="p-4">Comensales</th>
                <th className="p-4">Menús especiales</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(([name, diners, special]) => (
                <tr key={String(name)} className="border-t border-slate-100">
                  <td className="p-4 font-semibold">{name}</td>
                  <td className="p-4">{diners}</td>
                  <td className="p-4">{special}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Alertas alimentarias</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>⚠️ Martín García · GA · Aula 2-3 · Alergia al huevo</p>
            <p>⚠️ Lucía Pérez · Benicalap · Aula 1-2 · Sin lactosa</p>
            <p>⚠️ Hugo López · RN · Aula 0-1 · Menú triturado</p>
          </div>
        </div>
      </section>
    </main>
  );
}