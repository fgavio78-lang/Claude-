"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenShell } from "@/components/ScreenShell";
import { DEMO_PROYECTO_ID } from "@/lib/mockData";
import { useStore } from "@/lib/store/StoreContext";
import type { Ocasion, Prioridad } from "@/types/domain";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const { crearProyecto } = useStore();

  const [ocasion, setOcasion] = useState<Ocasion>("evento_especial");
  const [fechaEvento, setFechaEvento] = useState("2026-08-15");
  const [presupuestoMin, setPresupuestoMin] = useState(80000);
  const [presupuestoMax, setPresupuestoMax] = useState(150000);
  const [prioridad, setPrioridad] = useState<Prioridad>("balance");

  function handleSubmit() {
    const id = crearProyecto({
      ocasion,
      fecha_evento: fechaEvento,
      presupuesto_min: presupuestoMin,
      presupuesto_max: presupuestoMax,
      prioridad,
    });
    router.push(`/proyectos/${id}/lookbook`);
  }

  return (
    <ScreenShell
      proyectoId={DEMO_PROYECTO_ID}
      activeSlug="nuevo-proyecto"
      titulo="Nuevo Proyecto — Ocasión + Presupuesto"
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
          <label className="block text-sm font-medium text-neutral-700">Ocasión</label>
          <select
            value={ocasion}
            onChange={(e) => setOcasion(e.target.value as Ocasion)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="trabajo">Trabajo</option>
            <option value="cita">Cita</option>
            <option value="evento_especial">Evento especial</option>
            <option value="casual">Casual</option>
            <option value="otro">Otro (custom)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Fecha del evento
          </label>
          <input
            type="date"
            value={fechaEvento}
            onChange={(e) => setFechaEvento(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Presupuesto mínimo
            </label>
            <input
              type="number"
              value={presupuestoMin}
              onChange={(e) => setPresupuestoMin(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Presupuesto máximo
            </label>
            <input
              type="number"
              value={presupuestoMax}
              onChange={(e) => setPresupuestoMax(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Prioridad de la propuesta
          </label>
          <div className="mt-2 flex gap-2">
            {(["precio", "calidad", "balance"] as const).map((opcion) => (
              <label
                key={opcion}
                className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm capitalize ${
                  prioridad === opcion
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-600"
                }`}
              >
                <input
                  type="radio"
                  name="prioridad"
                  value={opcion}
                  checked={prioridad === opcion}
                  onChange={() => setPrioridad(opcion)}
                  className="sr-only"
                />
                {opcion}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Crear proyecto y generar lookbook
        </button>
      </form>
    </ScreenShell>
  );
}
