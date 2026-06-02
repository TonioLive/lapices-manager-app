import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function NuevaFamiliaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function createFamily(formData: FormData) {
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

    const { error } = await supabase.from("families").insert({
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
    });

    if (error) {
      console.error(error);
      redirect("/personal/familias/nuevo?error=1");
    }

    redirect("/personal/familias?created=1");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              Personal · Familias
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Nueva familia
            </h1>

            <p className="mt-2 text-slate-600">
              Crea una ficha de padre, madre, tutor o familiar autorizado.
            </p>
          </div>

          <Link
            href="/personal/familias"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            Volver a familias
          </Link>
        </div>

        <form action={createFamily} className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Datos personales</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Input name="first_name" label="Nombre" required placeholder="María" />
              <Input name="last_name" label="Apellidos" required placeholder="Pérez García" />
              <Input name="dni" label="DNI/NIE" placeholder="00000000A" />

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Relación con el alumno
                </label>
                <select
                  name="relationship"
                  defaultValue="madre"
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

              <Input name="occupation" label="Profesión" placeholder="Administrativa, autónomo..." />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Contacto</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Input name="email" label="Email" type="email" placeholder="familia@email.com" />
              <Input name="phone" label="Teléfono principal" placeholder="600 000 000" />
              <Input name="second_phone" label="Teléfono secundario" placeholder="600 000 000" />
              <Input name="work_phone" label="Teléfono trabajo" placeholder="960 000 000" />

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Método preferido de contacto
                </label>
                <select
                  name="preferred_contact_method"
                  defaultValue="whatsapp"
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
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Dirección
                </label>
                <input
                  name="address"
                  placeholder="Dirección completa"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Permisos y configuración</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <Checkbox name="authorized_pickup" label="Autorizado para recoger al alumno" />
              <Checkbox name="emergency_contact" label="Contacto de emergencia" />
              <Checkbox name="billing_contact" label="Contacto de facturación" />
              <Checkbox
                name="receives_communications"
                label="Recibe comunicaciones"
                defaultChecked
              />
              <Checkbox name="active" label="Familiar activo" defaultChecked />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Observaciones</h2>

            <textarea
              name="notes"
              rows={5}
              placeholder="Notas internas sobre la familia."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/personal/familias"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Guardar familia
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
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
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