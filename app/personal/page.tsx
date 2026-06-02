import Link from "next/link";

const modules = [
  ["Alumnos", "Gestión de alumnos, aulas, datos médicos y observaciones.", "👧", "/personal/alumnos"],
  ["Familias", "Datos de padres, madres, tutores y relación con alumnos.", "👨‍👩‍👧", "/personal/familias"],
  ["Agenda diaria", "Asistencia, comedor, matinera, tardes y observaciones.", "📒", "/personal/agenda"],
  ["Cocina", "Comensales diarios, alergias y menús especiales.", "🍽️", "/personal/cocina"],
  ["Comunicados", "Avisos para aula, escuela o todas las familias.", "📢", "/personal/comunicados"],
  ["Documentos", "Subida de circulares, autorizaciones y PDFs.", "📄", "/personal/documentos"],
  ["Mensajes", "Comunicación privada entre familias y personal.", "💬", "/personal/mensajes"],
  ["Objetivos", "Seguimiento educativo individual por alumno.", "🎯", "/personal/objetivos"],
  ["Extras", "Matinera, tardes, comedor extra y servicios puntuales.", "🧾", "/personal/extras"],
  ["Matrículas", "Reservas de plaza, documentación y altas.", "📝", "/personal/matriculas"],
  ["CRM", "Familias interesadas, visitas y captación.", "📈", "/personal/crm"],
  ["Informes", "Resumen por escuela, aula, comedor y extras.", "📊", "/personal/informes"],
];

export default function PersonalPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Lápices Manager
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Panel de personal
            </h1>

            <p className="mt-2 text-slate-600">
              Gestión interna para dirección, administración, profesorado,
              coordinación y cocina.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Inicio
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Alumnos activos</p>
            <p className="mt-2 text-3xl font-bold">486</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Comedor hoy</p>
            <p className="mt-2 text-3xl font-bold">267</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Matinera hoy</p>
            <p className="mt-2 text-3xl font-bold">42</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Mensajes pendientes</p>
            <p className="mt-2 text-3xl font-bold">18</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modules.map(([title, description, icon, href]) => (
            <Link
              key={title}
              href={href}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-3xl">{icon}</div>

              <h2 className="mt-4 text-xl font-bold">{title}</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}