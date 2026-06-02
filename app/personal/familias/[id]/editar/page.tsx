import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function EditarFamiliaPage({
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

  const { data: family, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !family) {
    notFound();
  }

  async function updateFamily(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const firstName = String(formData.get("first_name") || "");
    const lastName = String(formData.get("last_name") || "");
    const dni = String(formData.get("dni") || "");
    const relationship = String(formData.get("relationship") || "madre");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const secondPhone = String(formData.get("second_phone") || "");
    const workPhone = String(formData.get("work_phone") || "");
    const address = String(formData.get("address") || "");
    const occupation = String(formData.get("occupation") || "");
    const preferredContactMethod = String(
      formData.get("preferred_contact_method") || "whatsapp"
    );
    const notes = String(formData.get("notes") || "");

    const authorizedPickup = formData.get("authorized_pickup") === "on";
    const emergencyContact = formData.get("emergency_contact") === "on";
    const billingContact = formData.get("billing_contact") === "on";
    const receivesCommunications =
      formData.get("receives_communications") === "on";
    const active = formData.get("active") === "on";

    const { error } = await supabase
      .from("families")
      .update({
        first_name: firstName,
        last_name: lastName,
        dni: dni || null,
        relationship,
        email: email || null,
        phone: phone || null,
        second_phone: secondPhone || null,
        work_phone: workPhone || null,
        address: address || null,
        occupation: occupation || null,
        preferred_contact_method: preferredContactMethod,
        notes: notes || null,
        authorized_pickup: authorizedPickup,
        emergency_contact: emergencyContact,
        billing_contact: billingContact,
        receives_communications: receivesCommunications,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      redirect(`/personal/familias/${id}/editar?error=1`);
    }

    redirect(`/personal/familias/${id}?updated=1`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Familias · Editar
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Editar familia
            </h1>

            <p className="mt-2 text-slate-600">
              Modifica la ficha de {family.first_name} {family.last_name}.
            </p>
          </div>

          <Link
            href={`/personal/familias/${family.id}`}
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Volver a la ficha
          </Link>
        </div>

        <form action={updateFamily} className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Datos personales</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                name="first_name"
                label="Nombre"
                required
                defaultValue={family.first_name}
              />
              <Input
                name="last_name"
                label="Apellidos"
                required
                defaultValue={family.last_name}
              />
              <Input name="dni" label="DNI/NIE" defaultValue={family.dni} />

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Relación con el alumno
                </label>
                <select
                  name="relationship"
                  defaultValue={family.relationship || "madre"}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="madre">Madre</option>
                  <option value="padre">Padre</option>
                  <option value="tutor">Tutor</option>
                  <option value="tutora">Tutora</option>
                  <option value="abuelo">Abuelo</option>
                  <option value="abuela">Abuela</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <Input
                name="occupation"
                label="Profesión"
                defaultValue={family.occupation}
              />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Contacto</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                name="email"
                label="Email"
                type="email"
                defaultValue={family.email}
              />
              <Input
                name="phone"
                label="Teléfono principal"
                defaultValue={family.phone}
              />
              <Input
                name="second_phone"
                label="Teléfono secundario"
                defaultValue={family.second_phone}
              />
              <Input
                name="work_phone"
                label="Teléfono trabajo"
                defaultValue={family.work_phone}
              />

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Método preferido de contacto
                </label>
                <select
                  name="preferred_contact_method"
                  defaultValue={family.preferred_contact_method || "whatsapp"}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                >
                  <option value="telefono">Teléfono</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="app">App / plataforma</option>
                  <option value="indiferente">Indiferente</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Input
                  name="address"
                  label="Dirección"
                  defaultValue={family.address}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Permisos y configuración</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <Checkbox
                name="authorized_pickup"
                label="Autorizado para recoger al alumno"
                defaultChecked={family.authorized_pickup}
              />
              <Checkbox
                name="emergency_contact"
                label="Contacto de emergencia"
                defaultChecked={family.emergency_contact}
              />
              <Checkbox
                name="billing_contact"
                label="Contacto de facturación"
                defaultChecked={family.billing_contact}
              />
              <Checkbox
                name="receives_communications"
                label="Recibe comunicaciones"
                defaultChecked={family.receives_communications}
              />
              <Checkbox
                name="active"
                label="Familiar activo"
                defaultChecked={family.active}
              />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Observaciones</h2>

            <textarea
              name="notes"
              rows={5}
              defaultValue={family.notes || ""}
              placeholder="Notas internas sobre la familia."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
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
              Guardar cambios
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
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | null;
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
        defaultValue={defaultValue || ""}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
      />
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mr-2"
      />
      {label}
    </label>
  );
}