import type { ReactNode } from "react";
import { FlowProgress } from "@/components/FlowProgress";

export function ScreenShell({
  proyectoId,
  activeSlug,
  titulo,
  actor,
  children,
}: {
  proyectoId: string;
  activeSlug: string;
  titulo: string;
  actor: "cliente" | "shopper";
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <FlowProgress proyectoId={proyectoId} activeSlug={activeSlug} />
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">{titulo}</h1>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Vista {actor}
        </span>
      </div>
      {children}
    </main>
  );
}
