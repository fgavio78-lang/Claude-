"use client";

import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { useStore } from "@/lib/store/StoreContext";

export default function PropuestaPage({ params }: { params: { id: string } }) {
  const { looksDe, aprobarLookComoPropuesta } = useStore();
  const looks = looksDe(params.id);

  const aprobado = looks.find((look) => look.estado === "aprobado");
  const candidatos = looks.filter(
    (look) => look.estado === "favorito" || (look.fuente === "ai" && look.estado === "sugerido")
  );

  if (!aprobado) {
    return (
      <ScreenShell proyectoId={params.id} activeSlug="propuesta" titulo="Propuesta Final — Curada por el shopper" actor="cliente">
        <p className="max-w-2xl text-sm text-neutral-600">
          El shopper elige, entre tus favoritos y las variantes regeneradas,
          la propuesta definitiva a presentarte.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {candidatos.map((look) => (
            <div key={look.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <ul className="space-y-1 text-xs text-neutral-600">
                {look.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.producto} · {item.tienda}
                    </span>
                    <span>${item.precio.toLocaleString("es-AR")}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-semibold text-neutral-900">
                Total: ${look.precio_total.toLocaleString("es-AR")}
              </p>
              <button
                onClick={() => aprobarLookComoPropuesta(params.id, look.id)}
                className="mt-3 w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                Usar como propuesta final
              </button>
            </div>
          ))}
          {candidatos.length === 0 && (
            <p className="text-sm text-neutral-500">
              No hay looks favoritos ni variantes todavía — volvé al lookbook.
            </p>
          )}
        </div>
      </ScreenShell>
    );
  }

  const precioMercado = aprobado.precio_total * 1.15;
  const comision = aprobado.precio_total * 0.1;
  const abonoPagado = 15000;
  const totalAutorizar = aprobado.precio_total + comision - abonoPagado;

  return (
    <ScreenShell proyectoId={params.id} activeSlug="propuesta" titulo="Propuesta Final — Curada por el shopper" actor="cliente">
      <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex h-48 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-400">
          fotos reales de los productos en tienda
        </div>

        <ul className="space-y-2 text-sm">
          {aprobado.items.map((item) => (
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
            <span>${aprobado.precio_total.toLocaleString("es-AR")}</span>
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
            <span>${totalAutorizar.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</span>
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
