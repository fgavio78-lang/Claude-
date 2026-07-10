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
  const {
    looksDe,
    actualizarItemEstado,
    confirmarCompra,
    buscarReemplazo,
    aprobarReemplazoCliente,
    confirmarReemplazo,
    state,
  } = useStore();

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
              {items.map((item) => {
                const reemplazo = state.reemplazos[item.id];
                return (
                  <div key={item.id} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
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

                    {item.estado === "no_disponible" && (
                      <div className="mt-2 rounded-md bg-neutral-50 p-3 text-xs">
                        {!reemplazo && (
                          <button
                            onClick={() => buscarReemplazo(params.id, item.id)}
                            className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-white"
                          >
                            Buscar reemplazo
                          </button>
                        )}

                        {reemplazo && (
                          <div>
                            <p className="text-neutral-700">
                              Reemplazo sugerido: <strong>{reemplazo.producto}</strong> ·{" "}
                              {reemplazo.tienda} · ${reemplazo.precio.toLocaleString("es-AR")}
                              {reemplazo.precio > reemplazo.precioOriginal && (
                                <span className="ml-1 text-amber-700">
                                  (+$
                                  {(reemplazo.precio - reemplazo.precioOriginal).toLocaleString("es-AR")}{" "}
                                  vs. original)
                                </span>
                              )}
                            </p>

                            {reemplazo.requiereAprobacion && !reemplazo.aprobado && (
                              <div className="mt-2 rounded-md bg-amber-50 p-2 text-amber-800">
                                El precio cambió de forma significativa (+
                                {Math.round(
                                  ((reemplazo.precio - reemplazo.precioOriginal) / reemplazo.precioOriginal) * 100
                                )}
                                %) — requiere aprobación del cliente antes de comprar.
                                <button
                                  onClick={() => aprobarReemplazoCliente(item.id)}
                                  className="ml-2 rounded-md border border-amber-300 bg-white px-2 py-1 font-medium text-amber-900 hover:bg-amber-100"
                                >
                                  Simular aprobación del cliente
                                </button>
                              </div>
                            )}

                            <button
                              disabled={!reemplazo.aprobado}
                              onClick={() => confirmarReemplazo(params.id, item.id)}
                              className="mt-2 rounded-md bg-neutral-900 px-3 py-1.5 font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                            >
                              Confirmar reemplazo y marcar comprado
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 max-w-2xl rounded-md bg-amber-50 p-3 text-xs text-amber-800">
            Si un ítem queda &ldquo;no disponible&rdquo;, se busca un
            reemplazo en el catálogo; si su precio sube más de un 15%, se
            requiere una nueva aprobación antes de comprarlo.
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
