import Link from "next/link";
import { FLOW_STEPS } from "@/lib/flow";
import { DEMO_PROYECTO_ID, mockCliente, mockProyecto } from "@/lib/mockData";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Proyectos
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Scaffold de navegación para las 9 pantallas del flujo Personal
        Shopper. El proyecto de ejemplo &ldquo;{DEMO_PROYECTO_ID}&rdquo; usa
        datos mock (<code className="text-xs">src/lib/mockData.ts</code>) para
        poder recorrer el flujo completo sin backend conectado.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-900">{mockCliente.nombre}</p>
            <p className="text-sm text-neutral-500">
              {mockProyecto.ocasion.replace("_", " ")} · evento el{" "}
              {mockProyecto.fecha_evento} · presupuesto $
              {mockProyecto.presupuesto_min.toLocaleString("es-AR")} - $
              {mockProyecto.presupuesto_max.toLocaleString("es-AR")}
            </p>
          </div>
          <Link
            href={`/proyectos/${DEMO_PROYECTO_ID}/lookbook`}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Ver lookbook
          </Link>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-neutral-900">
        Flujo completo
      </h2>
      <ol className="mt-4 space-y-2">
        {FLOW_STEPS.map((step) => (
          <li key={step.slug}>
            <Link
              href={step.href(DEMO_PROYECTO_ID)}
              className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm hover:border-neutral-400"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
                {step.numero}
              </span>
              <span className="text-neutral-800">{step.titulo}</span>
              <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-xs uppercase text-neutral-500">
                {step.actor}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
