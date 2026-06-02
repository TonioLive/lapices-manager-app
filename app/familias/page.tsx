import Link from "next/link";

export default function FamiliasPage() {
  return (
    <main className="min-h-screen bg-sky-50 p-6 text-slate-900">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Agenda familiar
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              Bienvenida, familia de Martín
            </h1>
            <p className="mt-2 text-slate-600">
              Aquí podréis consultar la información diaria del alumno.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Inicio
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold">Agenda de hoy</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">Asistencia</p>
                <p className="mt-1 text-slate-600">
                  Martín ha asistido hoy a clase y ha entrado contento.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">Comedor</p>
                <p className="mt-1 text-slate-600">
                  Ha comido arroz con verduras, pescado al horno y fruta. Ha
                  comido bien.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">
                  Actividad de clase
                </p>
                <p className="mt-1 text-slate-600">
                  Hoy hemos trabajado los animales de la granja con canciones,
                  tarjetas visuales y juego simbólico.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Servicios de hoy</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>✅ Comedor</li>
                <li>❌ Matinera</li>
                <li>✅ Tarde</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Comunicados</h2>
              <p className="mt-3 text-sm text-slate-600">
                Mañana traer una camiseta blanca para la actividad de pintura.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Mensajes</h2>
              <p className="mt-3 text-sm text-slate-600">
                Tienes 1 mensaje nuevo de la profesora.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}