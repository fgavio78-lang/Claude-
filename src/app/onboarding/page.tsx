import { ScreenShell } from "@/components/ScreenShell";
import { DEMO_PROYECTO_ID, mockCliente } from "@/lib/mockData";

export default function OnboardingPage() {
  return (
    <ScreenShell
      proyectoId={DEMO_PROYECTO_ID}
      activeSlug="onboarding"
      titulo="Onboarding — Perfil del cliente"
      actor="cliente"
    >
      <form className="grid max-w-xl gap-5 rounded-lg border border-neutral-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Nombre
          </label>
          <input
            type="text"
            defaultValue={mockCliente.nombre}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Remera
            </label>
            <input
              type="text"
              defaultValue={mockCliente.talles.remera}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Pantalón
            </label>
            <input
              type="text"
              defaultValue={mockCliente.talles.pantalon}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Calzado
            </label>
            <input
              type="text"
              defaultValue={mockCliente.talles.calzado}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Estilo preferido
          </label>
          <input
            type="text"
            defaultValue={mockCliente.estilo_preferido.join(", ")}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Colores a evitar
          </label>
          <input
            type="text"
            defaultValue={mockCliente.colores_evitar.join(", ")}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Marcas favoritas
          </label>
          <input
            type="text"
            defaultValue={mockCliente.marcas_favoritas.join(", ")}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Fotos de referencia (opcional)
          </label>
          <div className="mt-1 rounded-md border border-dashed border-neutral-300 px-3 py-6 text-center text-sm text-neutral-400">
            Arrastrá o seleccioná fotos — pendiente de implementar
          </div>
        </div>

        <button
          type="button"
          className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Guardar perfil y continuar
        </button>
      </form>
    </ScreenShell>
  );
}
