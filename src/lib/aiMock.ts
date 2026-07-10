// Generador de looks basado en reglas simples sobre un catálogo local.
// Placeholder de la "Lookbook AI" del spec: reemplazar por una llamada real
// a un modelo (ej. Claude) que razone sobre perfil + ocasión + presupuesto
// una vez que haya credenciales de un proveedor de IA disponibles.

import type { Cliente, Item, Look, Proyecto } from "@/types/domain";
import { CATALOGO, type CatalogItem, type Categoria } from "@/lib/catalog";

interface Preferencias {
  avoidTags: string[];
  boostStyles: string[];
}

const PLANTILLAS: Categoria[][] = [
  ["vestido", "calzado", "accesorio"],
  ["top", "pantalon", "calzado"],
  ["blazer", "pantalon", "calzado"],
];

function coincideEstilo(item: CatalogItem, estilos: string[]) {
  return item.estilos.some((e) => estilos.includes(e));
}

function puntaje(item: CatalogItem, cliente: Cliente, prefs: Preferencias, prioridad: Proyecto["prioridad"]) {
  let score = 0;
  if (coincideEstilo(item, prefs.boostStyles)) score += 10;
  if (coincideEstilo(item, cliente.estilo_preferido)) score += 5;
  if (prioridad === "precio") score -= item.precio / 10000;
  if (prioridad === "calidad") score += item.precio / 10000;
  return score;
}

function elegirItem(
  categoria: Categoria,
  cliente: Cliente,
  prefs: Preferencias,
  prioridad: Proyecto["prioridad"],
  excluirIds: string[] = []
): CatalogItem | undefined {
  const candidatos = CATALOGO.filter(
    (item) =>
      item.categoria === categoria &&
      !excluirIds.includes(item.id) &&
      !item.tags.some((tag) => prefs.avoidTags.includes(tag)) &&
      !item.colores.some((color) => cliente.colores_evitar.includes(color))
  );
  if (candidatos.length === 0) return undefined;
  return [...candidatos].sort(
    (a, b) => puntaje(b, cliente, prefs, prioridad) - puntaje(a, cliente, prefs, prioridad)
  )[0];
}

function catalogItemToItem(catItem: CatalogItem, lookId: string): Item {
  return {
    id: crypto.randomUUID(),
    look_id: lookId,
    producto: catItem.producto,
    tienda: catItem.tienda,
    precio: catItem.precio,
    url: "#",
    foto: "",
    estado: "pendiente",
  };
}

function construirLook(
  proyectoId: string,
  plantilla: Categoria[],
  cliente: Cliente,
  prefs: Preferencias,
  prioridad: Proyecto["prioridad"],
  fuente: Look["fuente"]
): Look | undefined {
  const lookId = crypto.randomUUID();
  const usados: string[] = [];
  const items: Item[] = [];

  for (const categoria of plantilla) {
    const elegido = elegirItem(categoria, cliente, prefs, prioridad, usados);
    if (!elegido) continue;
    usados.push(elegido.id);
    items.push(catalogItemToItem(elegido, lookId));
  }

  if (items.length === 0) return undefined;

  return {
    id: lookId,
    proyecto_id: proyectoId,
    items,
    precio_total: items.reduce((sum, item) => sum + item.precio, 0),
    fuente,
    estado: "sugerido",
  };
}

export function parseComentario(comentario: string): Preferencias {
  const texto = comentario.toLowerCase();
  const prefs: Preferencias = { avoidTags: [], boostStyles: [] };

  if (texto.includes("sin estampado")) prefs.avoidTags.push("estampado");
  if (texto.includes("formal")) prefs.boostStyles.push("formal", "elegante");
  if (texto.includes("casual")) prefs.boostStyles.push("casual");
  if (texto.includes("streetwear") || texto.includes("urbano")) prefs.boostStyles.push("streetwear");
  if (texto.includes("elegante")) prefs.boostStyles.push("elegante");

  return prefs;
}

export function generarLooksIA(proyecto: Proyecto, cliente: Cliente): Look[] {
  const prefs: Preferencias = { avoidTags: [], boostStyles: [] };
  return PLANTILLAS.map((plantilla) =>
    construirLook(proyecto.id, plantilla, cliente, prefs, proyecto.prioridad, "ai")
  ).filter((look): look is Look => Boolean(look));
}

export function encontrarReemplazo(item: Item, productosUsados: string[] = []): CatalogItem | undefined {
  const original = CATALOGO.find((c) => c.producto === item.producto);
  if (!original) return undefined;

  const candidatos = CATALOGO.filter(
    (c) =>
      c.categoria === original.categoria &&
      c.producto !== item.producto &&
      !productosUsados.includes(c.producto)
  );
  if (candidatos.length === 0) return undefined;

  return [...candidatos].sort(
    (a, b) => Math.abs(a.precio - item.precio) - Math.abs(b.precio - item.precio)
  )[0];
}

export function regenerarVariantes(
  proyecto: Proyecto,
  cliente: Cliente,
  favoritos: Look[],
  comentariosPorLook: Record<string, string>
): Look[] {
  return favoritos.map((favorito) => {
    const comentario = comentariosPorLook[favorito.id] ?? "";
    const prefs = parseComentario(comentario);
    const plantilla = favorito.items.map((item) =>
      CATALOGO.find((c) => c.producto === item.producto)?.categoria
    ).filter((c): c is Categoria => Boolean(c));

    const variante = construirLook(
      proyecto.id,
      plantilla.length > 0 ? plantilla : PLANTILLAS[0],
      cliente,
      prefs,
      proyecto.prioridad,
      "ai"
    );

    return variante ?? favorito;
  });
}
