import type { Cliente, Compra, AutorizacionPago, Look, Proyecto } from "@/types/domain";

// Datos de ejemplo para poder navegar el flujo completo sin backend conectado.
// TODO: reemplazar por lecturas reales a Supabase (ver src/lib/supabase).

export const DEMO_PROYECTO_ID = "demo";

export const mockCliente: Cliente = {
  id: "cliente-demo",
  nombre: "Valentina Gomez",
  talles: { remera: "M", pantalon: "38", calzado: "37" },
  estilo_preferido: ["casual", "elegante"],
  colores_evitar: ["amarillo flúo"],
  marcas_favoritas: ["Rapsodia", "Ver"],
  fotos_referencia: [],
};

export const mockProyecto: Proyecto = {
  id: DEMO_PROYECTO_ID,
  cliente_id: mockCliente.id,
  ocasion: "evento_especial",
  fecha_evento: "2026-08-15",
  presupuesto_min: 80000,
  presupuesto_max: 150000,
  prioridad: "balance",
  estado: "lookbook",
};

export const mockLooks: Look[] = [
  {
    id: "look-1",
    proyecto_id: DEMO_PROYECTO_ID,
    fuente: "ai",
    estado: "favorito",
    precio_total: 132000,
    items: [
      {
        id: "item-1",
        look_id: "look-1",
        producto: "Vestido midi satinado",
        tienda: "Rapsodia",
        precio: 89000,
        url: "#",
        foto: "",
        estado: "pendiente",
      },
      {
        id: "item-2",
        look_id: "look-1",
        producto: "Sandalias con taco",
        tienda: "Mishka",
        precio: 43000,
        url: "#",
        foto: "",
        estado: "pendiente",
      },
    ],
  },
  {
    id: "look-2",
    proyecto_id: DEMO_PROYECTO_ID,
    fuente: "ai",
    estado: "sugerido",
    precio_total: 118500,
    items: [
      {
        id: "item-3",
        look_id: "look-2",
        producto: "Conjunto blazer + short",
        tienda: "Ver",
        precio: 98500,
        url: "#",
        foto: "",
        estado: "pendiente",
      },
      {
        id: "item-4",
        look_id: "look-2",
        producto: "Stilettos",
        tienda: "Mishka",
        precio: 20000,
        url: "#",
        foto: "",
        estado: "pendiente",
      },
    ],
  },
  {
    id: "look-3",
    proyecto_id: DEMO_PROYECTO_ID,
    fuente: "ai",
    estado: "descartado",
    precio_total: 96000,
    items: [
      {
        id: "item-5",
        look_id: "look-3",
        producto: "Jumpsuit estampado",
        tienda: "Complot",
        precio: 76000,
        url: "#",
        foto: "",
        estado: "pendiente",
      },
      {
        id: "item-6",
        look_id: "look-3",
        producto: "Sandalias plataforma",
        tienda: "Complot",
        precio: 20000,
        url: "#",
        foto: "",
        estado: "pendiente",
      },
    ],
  },
];

export const mockAutorizacionPago: AutorizacionPago = {
  id: "auth-1",
  proyecto_id: DEMO_PROYECTO_ID,
  monto_tope: 132000,
  medio_pago: "Visa •••• 4242",
  estado: "preautorizado",
  fecha: "2026-07-10",
};

export const mockCompra: Compra = {
  id: "compra-1",
  proyecto_id: DEMO_PROYECTO_ID,
  items_comprados: ["item-1", "item-2"],
  monto_real: 129000,
  comprobantes: [],
  fecha: "2026-07-12",
};
