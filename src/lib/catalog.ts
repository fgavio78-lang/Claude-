// Catálogo local usado por el generador de looks (src/lib/aiMock.ts).
// Reemplaza a un catálogo real de tiendas conectadas — placeholder de datos.

export type Categoria = "vestido" | "top" | "pantalon" | "blazer" | "calzado" | "accesorio";

export interface CatalogItem {
  id: string;
  producto: string;
  tienda: string;
  precio: number;
  categoria: Categoria;
  estilos: string[];
  colores: string[];
  tags: string[];
}

export const CATALOGO: CatalogItem[] = [
  { id: "c-1", producto: "Vestido midi satinado", tienda: "Rapsodia", precio: 89000, categoria: "vestido", estilos: ["elegante", "formal"], colores: ["negro"], tags: ["liso"] },
  { id: "c-2", producto: "Vestido camisero", tienda: "Ver", precio: 62000, categoria: "vestido", estilos: ["casual", "elegante"], colores: ["celeste"], tags: ["liso"] },
  { id: "c-3", producto: "Conjunto blazer + short", tienda: "Ver", precio: 98500, categoria: "blazer", estilos: ["formal", "elegante"], colores: ["beige"], tags: ["liso"] },
  { id: "c-4", producto: "Blazer oversize", tienda: "Complot", precio: 71000, categoria: "blazer", estilos: ["casual", "streetwear"], colores: ["gris"], tags: ["liso"] },
  { id: "c-5", producto: "Pantalón de vestir", tienda: "Rapsodia", precio: 54000, categoria: "pantalon", estilos: ["formal", "elegante"], colores: ["negro"], tags: ["liso"] },
  { id: "c-6", producto: "Jean recto", tienda: "Complot", precio: 48000, categoria: "pantalon", estilos: ["casual", "streetwear"], colores: ["azul"], tags: ["liso"] },
  { id: "c-7", producto: "Top estampado", tienda: "Mishka", precio: 32000, categoria: "top", estilos: ["casual", "streetwear"], colores: ["blanco"], tags: ["estampado"] },
  { id: "c-8", producto: "Camisa de seda", tienda: "Ver", precio: 45000, categoria: "top", estilos: ["formal", "elegante"], colores: ["blanco"], tags: ["liso"] },
  { id: "c-9", producto: "Jumpsuit estampado", tienda: "Complot", precio: 76000, categoria: "vestido", estilos: ["casual"], colores: ["multicolor"], tags: ["estampado"] },
  { id: "c-10", producto: "Sandalias con taco", tienda: "Mishka", precio: 43000, categoria: "calzado", estilos: ["elegante", "formal"], colores: ["negro"], tags: ["liso"] },
  { id: "c-11", producto: "Stilettos", tienda: "Mishka", precio: 20000, categoria: "calzado", estilos: ["formal", "elegante"], colores: ["negro"], tags: ["liso"] },
  { id: "c-12", producto: "Zapatillas urbanas", tienda: "Complot", precio: 38000, categoria: "calzado", estilos: ["casual", "streetwear"], colores: ["blanco"], tags: ["liso"] },
  { id: "c-13", producto: "Sandalias plataforma", tienda: "Complot", precio: 20000, categoria: "calzado", estilos: ["casual", "streetwear"], colores: ["marron"], tags: ["liso"] },
  { id: "c-14", producto: "Cartera de cuero", tienda: "Rapsodia", precio: 35000, categoria: "accesorio", estilos: ["elegante", "formal", "casual"], colores: ["negro"], tags: ["liso"] },
  { id: "c-15", producto: "Cinturón ancho", tienda: "Ver", precio: 15000, categoria: "accesorio", estilos: ["casual", "elegante"], colores: ["marron"], tags: ["liso"] },
  { id: "c-16", producto: "Riñonera streetwear", tienda: "Mishka", precio: 22000, categoria: "accesorio", estilos: ["streetwear", "casual"], colores: ["negro"], tags: ["estampado"] },
];
