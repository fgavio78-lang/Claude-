import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { mockLooks } from "@/lib/mockData";

export default function PropuestaPage({ params }: { params: { id: string } }) {
  const propuesta = mockLooks.find((look) => look.estado === "favorito")!;
  const precioMercado = propuesta.precio_total * 1.15;
  const comision = propuesta.precio_total * 0.1;
  const abonoPagado = 15000;

  return (
    <ScreenShell
      proyectoId={params.id}
      activeSlug="propuesta"
      titulo="Propuesta Final — Curada por el shopper"
      actor="cliente"
    >
      <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex h-48 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-400">
          fotos reales de los productos en tienda
        </div>

        <ul className="space-y-2 text-sm">
          {propuesta.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.producto} · {item.tienda}
              </span>
              <span>${item.precio.toLocaleString("es-AR")}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between text-neutral-500">
            <span>Precio de mercado (referencia)</span>
            <span className="line-through">
              ${precioMercado.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between font-medium text-emerald-700">
            <span>Precio conseguido (superador)</span>
            <span>${propuesta.precio_total.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Comisión del shopper (transparente)</span>
            <span>${comision.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Abono ya pagado</span>
            <span>-${abonoPagado.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold text-neutral-900">
            <span>Total a autorizar</span>
            <span>
              $
              {(propuesta.precio_total + comision - abonoPagado).toLocaleString(
                "es-AR",
                { maximumFractionDigits: 0 }
              )}
            </span>
          </div>
        </div>

        <p className="mt-4 rounded-md bg-neutral-50 p-3 text-xs text-neutral-500">
          Justificación de calidad: telas premium, devoluciones dentro de 10
          días en todas las tiendas seleccionadas.
        </p>
      </div>

      <div className="mt-6">
        <Link
          href={`/proyectos/${params.id}/autorizacion`}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Aprobar y continuar a autorización de pago
        </Link>
      </div>
    </ScreenShell>
  );
}
