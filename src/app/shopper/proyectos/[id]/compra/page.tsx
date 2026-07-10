"use client";

import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { useStore } from "@/lib/store/StoreContext";
import type { ItemEstado } from "@/types/domain";

const ESTADO_STYLE: Record<string, string> = {
  pendiente: "bg-neutral-100 text-neutral-600",
  comprado: "bg-emerald-100 text-emerald-700",
  no_disponible: "bg-red-100 text-red-700",
};

const SIGUIENTE_ESTADO: Record<ItemEstado, ItemEstado> = {
  pendiente: "comprado",
  comprado: "no_disponible",
  no_disponible: "pendiente",
};

export default function CompraShopperPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { looksDe, actualizarItemEstado, confirmarCompra, state } = useStore();

  const aprobado = looksDe(params.id).find((look) => look.estado === "aprobado");
  const items = aprobado?.items ?? [];
  const autorizacion = state.autorizaciones[params.id];
  const todosResueltos = items.length > 0 && items.every((item) => item.estado !== "pendiente");

  return (
    <ScreenShell proyectoId={params.id} activeSlug="compra" titulo="Ejecución de compra" actor="shopper">
      {!aprobado && (
        <p className="text-sm text-neutral-500">
          No hay una propuesta aprobada para este proyecto todavía.
        </p>
      )}
      {aprobado && !autorizacion && (
        <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          El cliente todavía no confirmó la preautorización de pago — no se
          debería comprar sin esa autorización.
        </p>
      )}

      {aprobado && (
        <>
          <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white">
            <div className="divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-neutral-900">{item.producto}</p>
                    <p className="text-xs text-neutral-500">
                      {item.tienda} · ${item.precio.toLocaleString("es-AR")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      actualizarItemEstado(params.id, item.id, SIGUIENTE_ESTADO[item.estado])
                    }
                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${ESTADO_STYLE[item.estado]}`}
                  >
                    {item.estado.replace("_", " ")}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 max-w-2xl rounded-md bg-amber-50 p-3 text-xs text-amber-800">
            Si un ítem queda &ldquo;no disponible&rdquo; y su reemplazo cambia
            el precio de forma significativa, debería dispararse un flujo de
            re-aprobación con el cliente antes de comprarlo (pendiente de
            implementar).
          </div>

          <div className="mt-6">
            <button
              disabled={!todosResueltos}
              onClick={() => {
                confirmarCompra(params.id);
                router.push(`/proyectos/${params.id}/tracking`);
              }}
              className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              Confirmar compra realizada
            </button>
            {!todosResueltos && (
              <p className="mt-2 text-xs text-neutral-500">
                Marcá todos los ítems como comprados o no disponibles para
                continuar.
              </p>
            )}
          </div>
        </>
      )}
    </ScreenShell>
  );
}
