import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";

export default function FeedbackPage({ params }: { params: { id: string } }) {
  return (
    <ScreenShell
      proyectoId={params.id}
      activeSlug="feedback"
      titulo="Post-entrega — Feedback y devoluciones"
      actor="cliente"
    >
      <div className="max-w-xl rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-neutral-900">
          ¿Cómo calificás el look recibido?
        </p>
        <div className="mt-2 flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} aria-label={`${n} estrellas`} className="text-neutral-300 hover:text-amber-400">
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Contanos qué te pareció (opcional)"
          className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          rows={3}
        />

        <div className="mt-6 border-t border-neutral-200 pt-4">
          <p className="text-sm font-medium text-neutral-900">
            ¿Necesitás devolver algún ítem?
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Definí quién paga el flete, el plazo y si aplica reembolso
            parcial — pendiente de implementar el flujo completo de
            devolución.
          </p>
          <button className="mt-3 rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50">
            Iniciar devolución
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Enviar feedback y volver al inicio
        </Link>
      </div>
    </ScreenShell>
  );
}
