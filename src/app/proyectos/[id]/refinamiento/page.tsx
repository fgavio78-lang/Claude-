import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { mockLooks } from "@/lib/mockData";

export default function RefinamientoPage({ params }: { params: { id: string } }) {
  const favoritos = mockLooks.filter((look) => look.estado === "favorito");

  return (
    <ScreenShell
      proyectoId={params.id}
      activeSlug="refinamiento"
      titulo="Refinamiento — Feedback iterativo"
      actor="cliente"
    >
      <p className="max-w-2xl text-sm text-neutral-600">
        Se regeneran variantes de los looks marcados como favoritos según tu
        feedback. También podés chatear directamente con tu shopper si
        preferís guiar manualmente.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {favoritos.map((look) => (
          <div
            key={look.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-400">
              variante regenerada
            </div>
            <p className="text-sm font-medium text-neutral-900">
              Basado en Look {look.id.split("-")[1]}
            </p>
            <p className="text-xs text-neutral-500">
              Total: ${look.precio_total.toLocaleString("es-AR")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-900">
          Chat con el shopper
        </p>
        <div className="mt-2 h-32 overflow-y-auto rounded-md bg-neutral-50 p-3 text-xs text-neutral-500">
          Sin mensajes todavía — pendiente de implementar (integración de
          chat en tiempo real).
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Escribí tu mensaje..."
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
            Enviar
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/proyectos/${params.id}/propuesta`}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Ver propuesta final del shopper
        </Link>
      </div>
    </ScreenShell>
  );
}
