"use client";

import Link from "next/link";
import { useState } from "react";
import { ScreenShell } from "@/components/ScreenShell";
import { useStore } from "@/lib/store/StoreContext";

export default function RefinamientoPage({ params }: { params: { id: string } }) {
  const { looksDe, state, enviarMensajeChat } = useStore();
  const [mensaje, setMensaje] = useState("");

  const looks = looksDe(params.id);
  const favoritos = looks.filter((look) => look.estado === "favorito");
  const variantes = looks.filter((look) => look.fuente === "ai" && look.estado === "sugerido");
  const chat = state.chatPorProyecto[params.id] ?? [];

  return (
    <ScreenShell proyectoId={params.id} activeSlug="refinamiento" titulo="Refinamiento — Feedback iterativo" actor="cliente">
      <p className="max-w-2xl text-sm text-neutral-600">
        Se regeneraron variantes de tus looks favoritos según el feedback que
        dejaste. También podés chatear directamente con tu shopper si
        preferís guiar manualmente.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {favoritos.map((favorito) => {
          const variante = variantes.find((v) => v.proyecto_id === favorito.proyecto_id);
          return (
            <div key={favorito.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-400">
                variante regenerada
              </div>
              <p className="text-sm font-medium text-neutral-900">
                Basado en Look {favorito.id.slice(0, 6)}
              </p>
              {variante ? (
                <>
                  <ul className="mt-1 space-y-1 text-xs text-neutral-600">
                    {variante.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.producto} · {item.tienda}
                        </span>
                        <span>${item.precio.toLocaleString("es-AR")}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs text-neutral-500">
                    Total: ${variante.precio_total.toLocaleString("es-AR")}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-xs text-neutral-500">Sin variante generada.</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-900">Chat con el shopper</p>
        <div className="mt-2 h-32 space-y-2 overflow-y-auto rounded-md bg-neutral-50 p-3 text-xs">
          {chat.length === 0 && (
            <p className="text-neutral-400">
              Sin mensajes todavía. El shopper responde automáticamente en
              esta demo — la mensajería real todavía no está conectada.
            </p>
          )}
          {chat.map((m, i) => (
            <p key={i} className={m.autor === "cliente" ? "text-neutral-800" : "text-neutral-500"}>
              <strong className="mr-1">{m.autor === "cliente" ? "Vos:" : "Shopper:"}</strong>
              {m.texto}
            </p>
          ))}
        </div>
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!mensaje.trim()) return;
            enviarMensajeChat(params.id, mensaje.trim());
            setMensaje("");
          }}
        >
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribí tu mensaje..."
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
            Enviar
          </button>
        </form>
      </div>

      <div className="mt-6">
        <Link
          href={`/proyectos/${params.id}/propuesta`}
          className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Ver propuesta final del shopper
        </Link>
      </div>
    </ScreenShell>
  );
}
