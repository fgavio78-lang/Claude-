"use client";

import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { useStore } from "@/lib/store/StoreContext";

const ESTADO_LABEL: Record<string, string> = {
  sugerido: "Sugerido",
  favorito: "❤️ Favorito",
  descartado: "👎 Descartado",
  aprobado: "Aprobado",
};

export default function LookbookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { looksDe, toggleFavorito, descartarLook, setComentarioLook, regenerarDesdeFavoritos, state } =
    useStore();

  const looks = looksDe(params.id).filter((look) => look.estado !== "descartado");
  const hayFavoritos = looks.some((look) => look.estado === "favorito");

  return (
    <ScreenShell proyectoId={params.id} activeSlug="lookbook" titulo="Lookbook AI — Sugerencias iniciales" actor="cliente">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {looks.map((look) => (
          <div key={look.id} className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex h-40 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-400">
              preview visual
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900">
                Look {look.id.slice(0, 6)}
              </span>
              <span className="text-xs text-neutral-500">{ESTADO_LABEL[look.estado]}</span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600">
              {look.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.producto} · {item.tienda}
                  </span>
                  <span>${item.precio.toLocaleString("es-AR")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-neutral-900">
              Total: ${look.precio_total.toLocaleString("es-AR")}
            </p>
            <div className="mt-4 flex gap-2 text-sm">
              <button
                onClick={() => toggleFavorito(params.id, look.id)}
                className={`flex-1 rounded-md border py-1.5 ${
                  look.estado === "favorito"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                ❤️ Favorito
              </button>
              <button
                onClick={() => descartarLook(params.id, look.id)}
                className="flex-1 rounded-md border border-neutral-300 py-1.5 hover:bg-neutral-50"
              >
                👎 Descartar
              </button>
            </div>
            <input
              type="text"
              placeholder="Comentario (ej: más formal, sin estampados)"
              value={state.comentariosPorLook[look.id] ?? ""}
              onChange={(e) => setComentarioLook(look.id, e.target.value)}
              className="mt-2 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
            />
          </div>
        ))}
      </div>

      {looks.length === 0 && (
        <p className="text-sm text-neutral-500">
          Descartaste todos los looks sugeridos. Volvé a &ldquo;Nuevo
          proyecto&rdquo; para generar otra tanda.
        </p>
      )}

      <div className="mt-6">
        <button
          disabled={!hayFavoritos}
          onClick={() => {
            regenerarDesdeFavoritos(params.id);
            router.push(`/proyectos/${params.id}/refinamiento`);
          }}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Enviar feedback y refinar
        </button>
        {!hayFavoritos && (
          <p className="mt-2 text-xs text-neutral-500">
            Marcá al menos un look como favorito para continuar.
          </p>
        )}
      </div>
    </ScreenShell>
  );
}
