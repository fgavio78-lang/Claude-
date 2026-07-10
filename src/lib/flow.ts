export interface FlowStep {
  slug: string;
  numero: number;
  titulo: string;
  actor: "cliente" | "shopper";
  href: (proyectoId: string) => string;
}

export const FLOW_STEPS: FlowStep[] = [
  {
    slug: "onboarding",
    numero: 1,
    titulo: "Onboarding — Perfil del cliente",
    actor: "cliente",
    href: () => "/onboarding",
  },
  {
    slug: "nuevo-proyecto",
    numero: 2,
    titulo: "Nuevo Proyecto — Ocasión + Presupuesto",
    actor: "cliente",
    href: () => "/proyectos/nuevo",
  },
  {
    slug: "lookbook",
    numero: 3,
    titulo: "Lookbook AI — Sugerencias iniciales",
    actor: "cliente",
    href: (id) => `/proyectos/${id}/lookbook`,
  },
  {
    slug: "refinamiento",
    numero: 4,
    titulo: "Refinamiento — Feedback iterativo",
    actor: "cliente",
    href: (id) => `/proyectos/${id}/refinamiento`,
  },
  {
    slug: "propuesta",
    numero: 5,
    titulo: "Propuesta Final — Curada por el shopper",
    actor: "cliente",
    href: (id) => `/proyectos/${id}/propuesta`,
  },
  {
    slug: "autorizacion",
    numero: 6,
    titulo: "Autorización de pago",
    actor: "cliente",
    href: (id) => `/proyectos/${id}/autorizacion`,
  },
  {
    slug: "compra",
    numero: 7,
    titulo: "Ejecución de compra",
    actor: "shopper",
    href: (id) => `/shopper/proyectos/${id}/compra`,
  },
  {
    slug: "tracking",
    numero: 8,
    titulo: "Confirmación y tracking",
    actor: "cliente",
    href: (id) => `/proyectos/${id}/tracking`,
  },
  {
    slug: "feedback",
    numero: 9,
    titulo: "Post-entrega — Feedback y devoluciones",
    actor: "cliente",
    href: (id) => `/proyectos/${id}/feedback`,
  },
];
