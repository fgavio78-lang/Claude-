import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { mockAutorizacionPago, mockCompra } from "@/lib/mockData";

export default function TrackingPage({ params }: { params: { id: string } }) {
  const ahorro = mockAutorizacionPago.monto_tope - mockCompra.monto_real;

  return (
    <ScreenShell
      proyectoId={params.id}
      activeSlug="tracking"
      titulo="Confirmación y tracking"
      actor="cliente"
    >
      <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm text-neutral-500">Estado del envío</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          {["Comprado", "En camino", "Entregado"].map((etapa, i) => (
            <div key={etapa} className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  i === 0 ? "bg-emerald-500" : "bg-neutral-300"
                }`}
              />
              <span className={i === 0 ? "text-neutral-900" : "text-neutral-400"}>
                {etapa}
              </span>
              {i < 2 && <span className="text-neutral-300">—</span>}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 text-sm">
          <div>
            <p className="text-neutral-500">Presupuesto tope</p>
            <p className="font-medium text-neutral-900">
              ${mockAutorizacionPago.monto_tope.toLocaleString("es-AR")}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Gastado real</p>
            <p className="font-medium text-neutral-900">
              ${mockCompra.monto_real.toLocaleString("es-AR")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-neutral-500">Ahorro vs. tope autorizado</p>
            <p className="font-medium text-emerald-700">
              ${ahorro.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm font-medium text-neutral-900">
          Comprobantes
        </p>
        <div className="mt-1 rounded-md border border-dashed border-neutral-300 px-3 py-6 text-center text-xs text-neutral-400">
          Sin comprobantes cargados todavía — pendiente de implementar
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/proyectos/${params.id}/feedback`}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Marcar como entregado y dejar feedback
        </Link>
      </div>
    </ScreenShell>
  );
}
