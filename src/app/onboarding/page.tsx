"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenShell } from "@/components/ScreenShell";
import { DEMO_PROYECTO_ID } from "@/lib/mockData";
import { useStore } from "@/lib/store/StoreContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { clienteActual, guardarCliente } = useStore();

  const [nombre, setNombre] = useState(clienteActual.nombre);
  const [talleRemera, setTalleRemera] = useState(clienteActual.talles.remera ?? "");
  const [tallePantalon, setTallePantalon] = useState(clienteActual.talles.pantalon ?? "");
  const [talleCalzado, setTalleCalzado] = useState(clienteActual.talles.calzado ?? "");
  const [estilos, setEstilos] = useState(clienteActual.estilo_preferido.join(", "));
  const [coloresEvitar, setColoresEvitar] = useState(clienteActual.colores_evitar.join(", "));
  const [marcas, setMarcas] = useState(clienteActual.marcas_favoritas.join(", "));

  function handleSubmit() {
    guardarCliente({
      nombre,
      talles: { remera: talleRemera, pantalon: tallePantalon, calzado: talleCalzado },
      estilo_preferido: estilos.split(",").map((s) => s.trim()).filter(Boolean),
      colores_evitar: coloresEvitar.split(",").map((s) => s.trim()).filter(Boolean),
      marcas_favoritas: marcas.split(",").map((s) => s.trim()).filter(Boolean),
    });
    router.push("/proyectos/nuevo");
  }

  return (
    <ScreenShell
      proyectoId={DEMO_PROYECTO_ID}
      activeSlug="onboarding"
      titulo="Onboarding — Perfil del cliente"
      actor="cliente"
    >
      <form
        className="grid max-w-xl gap-5 rounded-lg border border-neutral-200 bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Remera</label>
            <input
              type="text"
              value={talleRemera}
              onChange={(e) => setTalleRemera(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Pantalón</label>
            <input
              type="text"
              value={tallePantalon}
              onChange={(e) => setTallePantalon(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Calzado</label>
            <input
              type="text"
              value={talleCalzado}
              onChange={(e) => setTalleCalzado(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Estilo preferido (separado por comas)
          </label>
          <input
            type="text"
            value={estilos}
            onChange={(e) => setEstilos(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Colores a evitar (separado por comas)
          </label>
          <input
            type="text"
            value={coloresEvitar}
            onChange={(e) => setColoresEvitar(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Marcas favoritas (separado por comas)
          </label>
          <input
            type="text"
            value={marcas}
            onChange={(e) => setMarcas(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Fotos de referencia (opcional)
          </label>
          <div className="mt-1 rounded-md border border-dashed border-neutral-300 px-3 py-6 text-center text-sm text-neutral-400">
            Arrastrá o seleccioná fotos — pendiente de implementar (requiere
            storage de archivos)
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Guardar perfil y continuar
        </button>
      </form>
    </ScreenShell>
  );
}
