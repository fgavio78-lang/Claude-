import Link from "next/link";
import { FLOW_STEPS } from "@/lib/flow";

export function FlowProgress({
  proyectoId,
  activeSlug,
}: {
  proyectoId: string;
  activeSlug: string;
}) {
  return (
    <ol className="mb-8 flex flex-wrap gap-2 text-xs">
      {FLOW_STEPS.map((step) => {
        const isActive = step.slug === activeSlug;
        return (
          <li key={step.slug}>
            <Link
              href={step.href(proyectoId)}
              className={`rounded-full border px-3 py-1 transition-colors ${
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-500 hover:border-neutral-500"
              }`}
            >
              {step.numero}. {step.titulo.split(" — ")[0]}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
