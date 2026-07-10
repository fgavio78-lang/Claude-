import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { mockAutorizacionPago } from "@/lib/mockData";

export default function AutorizacionPage({ params }: { params: { id: string } }) {
  return (
    <ScreenShell
      proyectoId={params.id}
      activeSlug="autorizacion"
      titulo="Autorización de pago"
      actor="cliente"
    >
      <div className="max-w-lg rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm text-neutral-500">Monto máximo autorizado</p>
        <p className="text-3xl font-semibold text-neutral-900">
          ${mockAutorizacionPago.monto_tope.toLocaleString("es-AR")}
        </p>

        <div className="mt-4 flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm">
          <span>{mockAutorizacionPago.medio_pago}</span>
          <button className="text-xs font-medium text-neutral-600 underline">
            Cambiar
          </button>
        </div>

        <div className="mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          Esto es una <strong>preautorización (hold)</strong>, no un cobro
          directo. El monto real capturado nunca podrá superar este tope sin
          una nueva aprobación tuya.
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm text-neutral-700">
          <input type="checkbox" className="mt-1" />
          Autorizo al shopper a comprar en mi nombre hasta el monto de $
          {mockAutorizacionPago.monto_tope.toLocaleString("es-AR")}, según los
          ítems detallados en la propuesta.
        </label>

        <button className="mt-4 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
          Confirmar preautorización
        </button>
      </div>

      <div className="mt-6">
        <Link
          href={`/shopper/proyectos/${params.id}/compra`}
          className="text-sm text-neutral-500 underline hover:text-neutral-800"
        >
          Ver vista interna del shopper (ejecución de compra) →
        </Link>
      </div>
    </ScreenShell>
  );
}
