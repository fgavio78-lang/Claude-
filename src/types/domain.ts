// Tipos derivados del data model borrador en docs/spec.md.

export type EstiloPreferido =
  | "casual"
  | "formal"
  | "streetwear"
  | "elegante"
  | "deportivo"
  | (string & {});

export type Prioridad = "precio" | "calidad" | "balance";

export type Ocasion = "trabajo" | "cita" | "evento_especial" | "casual" | "otro";

export type ProyectoEstado =
  | "borrador"
  | "lookbook"
  | "refinamiento"
  | "propuesta"
  | "autorizacion"
  | "compra"
  | "entrega"
  | "cerrado";

export type LookFuente = "ai" | "shopper";

export type LookEstado = "sugerido" | "favorito" | "descartado" | "aprobado";

export type ItemEstado = "pendiente" | "comprado" | "no_disponible";

export type AutorizacionPagoEstado = "preautorizado" | "capturado" | "liberado";

export interface Cliente {
  id: string;
  nombre: string;
  talles: Record<string, string>;
  estilo_preferido: EstiloPreferido[];
  colores_evitar: string[];
  marcas_favoritas: string[];
  fotos_referencia: string[];
}

export interface Proyecto {
  id: string;
  cliente_id: string;
  ocasion: Ocasion;
  fecha_evento: string;
  presupuesto_min: number;
  presupuesto_max: number;
  prioridad: Prioridad;
  estado: ProyectoEstado;
}

export interface Item {
  id: string;
  look_id: string;
  producto: string;
  tienda: string;
  precio: number;
  url: string;
  foto: string;
  estado: ItemEstado;
}

export interface Look {
  id: string;
  proyecto_id: string;
  items: Item[];
  precio_total: number;
  fuente: LookFuente;
  estado: LookEstado;
}

export interface AutorizacionPago {
  id: string;
  proyecto_id: string;
  monto_tope: number;
  medio_pago: string;
  estado: AutorizacionPagoEstado;
  fecha: string;
}

export interface Compra {
  id: string;
  proyecto_id: string;
  items_comprados: string[];
  monto_real: number;
  comprobantes: string[];
  fecha: string;
}
