import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { mockLooks } from "@/lib/mockData";

const ESTADO_STYLE: Record<string, string> = {
  pendiente: "bg-neutral-100 text-neutral-600",
  comprado: "bg-emerald-100 text-emerald-700",
  no_disponible: "bg-red-100 text-red-700",
};

export default function CompraShopperPage({ params }: { params: { id: string } }) {
  const items = mockLooks.flatMap((look) => look.items);

  return (
    <ScreenShell
      proyectoId={params.id}
      activeSlug="compra"
      titulo="Ejecución de compra"
      actor="shopper"
    >
      <div className="max-w-2xl rounded-lg border border-neutral-200 bg-white">
        <div className="divide-y divide-neutral-100">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-neutral-900">{item.producto}</p>
                <p className="text-xs text-neutral-500">
                  {item.tienda} · ${item.precio.toLocaleString("es-AR")}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${ESTADO_STYLE[item.estado]}`}
              >
                {item.estado.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 max-w-2xl rounded-md bg-amber-50 p-3 text-xs text-amber-800">
        Si un ítem queda &ldquo;no disponible&rdquo; y su reemplazo cambia el
        precio de forma significativa, se dispara un flujo de re-aprobación
        con el cliente antes de comprarlo (pendiente de implementar).
      </div>

      <div className="mt-6">
        <Link
          href={`/proyectos/${params.id}/tracking`}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Confirmar compra realizada
        </Link>
      </div>
    </ScreenShell>
  );
}
