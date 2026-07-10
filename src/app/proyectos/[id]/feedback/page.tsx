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
          <p className="mt-1 text-xs text-neutral-500">
            Definir quién paga el flete, el plazo y si aplica reembolso
            parcial es un flujo de coordinación con el shopper — pendiente de
            implementar por completo. Por ahora esto solo registra el pedido.
          </p>
          {state.feedbacks[params.id]?.devolucion_solicitada ? (
            <p className="mt-3 text-sm text-amber-700">
              Devolución solicitada — el shopper la va a coordinar con vos.
            </p>
          ) : (
            <button
              onClick={() => solicitarDevolucion(params.id)}
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
