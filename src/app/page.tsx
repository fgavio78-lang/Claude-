"use client";

import Link from "next/link";
import { FLOW_STEPS } from "@/lib/flow";
import { useStore } from "@/lib/store/StoreContext";
import type { ProyectoEstado } from "@/types/domain";

const ESTADO_RUTA: Record<ProyectoEstado, (id: string) => string> = {
  borrador: (id) => `/proyectos/${id}/lookbook`,
  lookbook: (id) => `/proyectos/${id}/lookbook`,
  refinamiento: (id) => `/proyectos/${id}/refinamiento`,
  propuesta: (id) => `/proyectos/${id}/propuesta`,
  autorizacion: (id) => `/proyectos/${id}/autorizacion`,
  compra: (id) => `/proyectos/${id}/tracking`,
  entrega: (id) => `/proyectos/${id}/tracking`,
  cerrado: (id) => `/proyectos/${id}/feedback`,
};

const ESTADO_LABEL: Record<ProyectoEstado, string> = {
  borrador: "Borrador",
  lookbook: "Lookbook AI",
  refinamiento: "Refinamiento",
  propuesta: "Propuesta final",
  autorizacion: "Autorización de pago",
  compra: "Compra en curso",
  entrega: "Entregado",
  cerrado: "Cerrado",
};

export default function HomePage() {
  const { state, clienteActual } = useStore();
  const proyectos = Object.values(state.proyectos).sort((a, b) =>
    a.fecha_evento < b.fecha_evento ? 1 : -1
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Proyectos</h1>
        <Link
          href="/proyectos/nuevo"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          + Nuevo proyecto
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Cliente actual: <strong>{clienteActual.nombre}</strong>. Los datos se
        guardan en este navegador (localStorage) — todavía no hay un backend
        real conectado.
      </p>

      <div className="mt-6 space-y-3">
        {proyectos.map((proyecto) => (
          <Link
            key={proyecto.id}
            href={ESTADO_RUTA[proyecto.estado](proyecto.id)}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-5 hover:border-neutral-400"
          >
            <div>
              <p className="font-medium text-neutral-900">
                {proyecto.ocasion.replace("_", " ")}
              </p>
              <p className="text-sm text-neutral-500">
                evento el {proyecto.fecha_evento} · presupuesto $
                {proyecto.presupuesto_min.toLocaleString("es-AR")} - $
                {proyecto.presupuesto_max.toLocaleString("es-AR")}
              </p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              {ESTADO_LABEL[proyecto.estado]}
            </span>
          </Link>
        ))}
        {proyectos.length === 0 && (
          <p className="text-sm text-neutral-500">
            Todavía no creaste ningún proyecto.
          </p>
        )}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-neutral-900">
        Flujo completo (referencia)
      </h2>
      <ol className="mt-4 space-y-2">
        {FLOW_STEPS.map((step) => (
          <li
            key={step.slug}
            className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
              {step.numero}
            </span>
            <span className="text-neutral-800">{step.titulo}</span>
            <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-xs uppercase text-neutral-500">
              {step.actor}
            </span>
          </li>
        ))}
      </ol>
    </main>
  );
}
