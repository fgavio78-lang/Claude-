"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenShell } from "@/components/ScreenShell";
import { useStore } from "@/lib/store/StoreContext";

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { state, guardarFeedback, solicitarDevolucion } = useStore();
  const existente = state.feedbacks[params.id];

  const [rating, setRating] = useState(existente?.rating ?? 0);
  const [comentario, setComentario] = useState(existente?.comentario ?? "");
  const [enviado, setEnviado] = useState(Boolean(existente));

  const [mostrarFormDevolucion, setMostrarFormDevolucion] = useState(false);
  const [quienPagaFlete, setQuienPagaFlete] = useState<"cliente" | "shopper">("shopper");
  const [plazoDias, setPlazoDias] = useState(10);
  const [reembolsoParcial, setReembolsoParcial] = useState(false);
  const [montoReembolso, setMontoReembolso] = useState(0);

  return (
    <ScreenShell proyectoId={params.id} activeSlug="feedback" titulo="Post-entrega — Feedback y devoluciones" actor="cliente">
      <div className="max-w-xl rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-neutral-900">
          ¿Cómo calificás el look recibido?
        </p>
        <div className="mt-2 flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              aria-label={`${n} estrellas`}
              onClick={() => setRating(n)}
              className={n <= rating ? "text-amber-400" : "text-neutral-300 hover:text-amber-300"}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Contanos qué te pareció (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          rows={3}
        />

        <button
          onClick={() => {
            guardarFeedback(params.id, rating, comentario);
            setEnviado(true);
          }}
          disabled={rating === 0}
          className="mt-3 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Guardar calificación
        </button>
        {enviado && (
          <p className="mt-2 text-xs text-emerald-700">
            Guardado — esta info alimenta el perfil del cliente para el
            próximo proyecto.
          </p>
        )}

        <div className="mt-6 border-t border-neutral-200 pt-4">
          <p className="text-sm font-medium text-neutral-900">
            ¿Necesitás devolver algún ítem?
          </p>

          {state.feedbacks[params.id]?.devolucion_solicitada ? (
            <div className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium">Devolución solicitada</p>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li>
                  Flete a cargo de:{" "}
                  <strong>
                    {state.feedbacks[params.id]?.devolucion?.quienPagaFlete === "cliente"
                      ? "el cliente"
                      : "el shopper"}
                  </strong>
                </li>
                <li>
                  Plazo: <strong>{state.feedbacks[params.id]?.devolucion?.plazoDias} días</strong>
                </li>
                {state.feedbacks[params.id]?.devolucion?.reembolsoParcial && (
                  <li>
                    Reembolso parcial:{" "}
                    <strong>
                      ${(state.feedbacks[params.id]?.devolucion?.montoReembolso ?? 0).toLocaleString("es-AR")}
                    </strong>
                  </li>
                )}
              </ul>
            </div>
          ) : mostrarFormDevolucion ? (
            <div className="mt-3 space-y-3 rounded-md border border-neutral-200 p-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  ¿Quién paga el flete de la devolución?
                </label>
                <div className="mt-1 flex gap-2 text-sm">
                  {(["shopper", "cliente"] as const).map((opcion) => (
                    <label
                      key={opcion}
                      className={`flex-1 cursor-pointer rounded-md border px-3 py-1.5 text-center capitalize ${
                        quienPagaFlete === opcion
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 text-neutral-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="quienPagaFlete"
                        value={opcion}
                        checked={quienPagaFlete === opcion}
                        onChange={() => setQuienPagaFlete(opcion)}
                        className="sr-only"
                      />
                      {opcion}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Plazo para devolver (días)
                </label>
                <input
                  type="number"
                  value={plazoDias}
                  onChange={(e) => setPlazoDias(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={reembolsoParcial}
                  onChange={(e) => setReembolsoParcial(e.target.checked)}
                />
                Aplica reembolso parcial
              </label>

              {reembolsoParcial && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700">
                    Monto a reembolsar
                  </label>
                  <input
                    type="number"
                    value={montoReembolso}
                    onChange={(e) => setMontoReembolso(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
                  />
                </div>
              )}

              <button
                onClick={() =>
                  solicitarDevolucion(params.id, {
                    quienPagaFlete,
                    plazoDias,
                    reembolsoParcial,
                    montoReembolso: reembolsoParcial ? montoReembolso : undefined,
                  })
                }
                className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                Confirmar solicitud de devolución
              </button>
            </div>
          ) : (
            <button
              onClick={() => setMostrarFormDevolucion(true)}
              className="mt-3 rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Iniciar devolución
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => router.push("/")}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Volver al inicio
        </button>
      </div>
    </ScreenShell>
  );
}
