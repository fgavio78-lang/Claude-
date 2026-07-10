"use client";

import Link from "next/link";
import { useState } from "react";
import { ScreenShell } from "@/components/ScreenShell";
import { useStore } from "@/lib/store/StoreContext";

export default function AutorizacionPage({ params }: { params: { id: string } }) {
  const { looksDe, state, confirmarAutorizacion } = useStore();
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [medioPago, setMedioPago] = useState("Visa •••• 4242");

  const aprobado = looksDe(params.id).find((look) => look.estado === "aprobado");
  const comision = (aprobado?.precio_total ?? 0) * 0.1;
  const abonoPagado = 15000;
  const montoTope = (aprobado?.precio_total ?? 0) + comision - abonoPagado;

  const autorizacion = state.autorizaciones[params.id];
  const yaConfirmada = autorizacion?.estado === "preautorizado" || autorizacion?.estado === "capturado";

  return (
    <ScreenShell proyectoId={params.id} activeSlug="autorizacion" titulo="Autorización de pago" actor="cliente">
      <div className="max-w-lg rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm text-neutral-500">Monto máximo autorizado</p>
        <p className="text-3xl font-semibold text-neutral-900">
          ${(autorizacion?.monto_tope ?? montoTope).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
        </p>

        <div className="mt-4 flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm">
          <input
            value={medioPago}
            onChange={(e) => setMedioPago(e.target.value)}
            disabled={yaConfirmada}
            className="w-full bg-transparent outline-none disabled:text-neutral-500"
          />
        </div>

        <div className="mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          Esto es una <strong>preautorización (hold)</strong>, no un cobro
          directo. El monto real capturado nunca podrá superar este tope sin
          una nueva aprobación tuya. La integración real con una pasarela de
          pago (ej. Mercado Pago) todavía no está conectada — esta
          confirmación queda registrada localmente como demo.
        </div>

        {yaConfirmada ? (
          <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
            Preautorización confirmada el{" "}
            {new Date(autorizacion!.fecha).toLocaleDateString("es-AR")}.
          </p>
        ) : (
          <>
            <label className="mt-4 flex items-start gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-1"
              />
              Autorizo al shopper a comprar en mi nombre hasta el monto de $
              {montoTope.toLocaleString("es-AR", { maximumFractionDigits: 0 })}, según los
              ítems detallados en la propuesta.
            </label>

            <button
              disabled={!aceptaTerminos || !aprobado}
              onClick={() => confirmarAutorizacion(params.id, montoTope, medioPago)}
              className="mt-4 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              Confirmar preautorización
            </button>
            {!aprobado && (
              <p className="mt-2 text-xs text-neutral-500">
                Todavía no hay una propuesta aprobada — volvé al paso anterior.
              </p>
            )}
          </>
        )}
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
