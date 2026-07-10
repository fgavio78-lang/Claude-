"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AutorizacionPago,
  Cliente,
  Compra,
  ItemEstado,
  Look,
  Proyecto,
} from "@/types/domain";
import {
  DEMO_PROYECTO_ID,
  mockAutorizacionPago,
  mockCliente,
  mockCompra,
  mockLooks,
  mockProyecto,
} from "@/lib/mockData";
import { encontrarReemplazo, generarLooksIA, regenerarVariantes } from "@/lib/aiMock";

const STORAGE_KEY = "personal-shopper-store-v2";

export interface DevolucionDetalle {
  quienPagaFlete: "cliente" | "shopper";
  plazoDias: number;
  reembolsoParcial: boolean;
  montoReembolso?: number;
}

export interface FeedbackEntrega {
  rating: number;
  comentario: string;
  devolucion_solicitada: boolean;
  devolucion?: DevolucionDetalle;
}

export interface ChatMensaje {
  autor: "cliente" | "shopper";
  texto: string;
}

export interface ReemplazoInfo {
  producto: string;
  tienda: string;
  precio: number;
  precioOriginal: number;
  requiereAprobacion: boolean;
  aprobado: boolean;
}

interface StoreState {
  clienteActualId: string;
  clientes: Record<string, Cliente>;
  proyectos: Record<string, Proyecto>;
  looksPorProyecto: Record<string, Look[]>;
  comentariosPorLook: Record<string, string>;
  variantePadre: Record<string, string>;
  chatPorProyecto: Record<string, ChatMensaje[]>;
  autorizaciones: Record<string, AutorizacionPago>;
  compras: Record<string, Compra>;
  feedbacks: Record<string, FeedbackEntrega>;
  entregadoPorProyecto: Record<string, boolean>;
  reemplazos: Record<string, ReemplazoInfo>;
}

function seedState(): StoreState {
  return {
    clienteActualId: mockCliente.id,
    clientes: { [mockCliente.id]: mockCliente },
    proyectos: { [mockProyecto.id]: mockProyecto },
    looksPorProyecto: { [DEMO_PROYECTO_ID]: mockLooks },
    comentariosPorLook: {},
    variantePadre: {},
    chatPorProyecto: { [DEMO_PROYECTO_ID]: [] },
    autorizaciones: { [DEMO_PROYECTO_ID]: mockAutorizacionPago },
    compras: {},
    feedbacks: {},
    entregadoPorProyecto: {},
    reemplazos: {},
  };
}

interface StoreApi {
  state: StoreState;
  clienteActual: Cliente;
  guardarCliente: (datos: Partial<Omit<Cliente, "id">>) => void;
  crearProyecto: (
    datos: Omit<Proyecto, "id" | "estado" | "cliente_id">
  ) => string;
  toggleFavorito: (proyectoId: string, lookId: string) => void;
  descartarLook: (proyectoId: string, lookId: string) => void;
  setComentarioLook: (lookId: string, texto: string) => void;
  regenerarDesdeFavoritos: (proyectoId: string) => void;
  enviarMensajeChat: (proyectoId: string, texto: string) => void;
  aprobarLookComoPropuesta: (proyectoId: string, lookId: string) => void;
  confirmarAutorizacion: (
    proyectoId: string,
    montoTope: number,
    medioPago: string
  ) => void;
  actualizarItemEstado: (
    proyectoId: string,
    itemId: string,
    estado: ItemEstado
  ) => void;
  buscarReemplazo: (proyectoId: string, itemId: string) => void;
  aprobarReemplazoCliente: (itemId: string) => void;
  confirmarReemplazo: (proyectoId: string, itemId: string) => void;
  confirmarCompra: (proyectoId: string) => void;
  marcarEntregado: (proyectoId: string) => void;
  guardarFeedback: (proyectoId: string, rating: number, comentario: string) => void;
  solicitarDevolucion: (proyectoId: string, detalle: DevolucionDetalle) => void;
  looksDe: (proyectoId: string) => Look[];
  proyectoDe: (proyectoId: string) => Proyecto | undefined;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(seedState);

  useEffect(() => {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        setState(JSON.parse(guardado) as StoreState);
      } catch {
        // Datos corruptos en localStorage: se ignora y se mantiene el seed.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const guardarCliente = useCallback<StoreApi["guardarCliente"]>((datos) => {
    setState((prev) => ({
      ...prev,
      clientes: {
        ...prev.clientes,
        [prev.clienteActualId]: { ...prev.clientes[prev.clienteActualId], ...datos },
      },
    }));
  }, []);

  const crearProyecto = useCallback<StoreApi["crearProyecto"]>((datos) => {
    const id = crypto.randomUUID();
    let proyecto: Proyecto | undefined;
    setState((prev) => {
      proyecto = {
        id,
        cliente_id: prev.clienteActualId,
        estado: "lookbook",
        ...datos,
      };
      const looks = generarLooksIA(proyecto, prev.clientes[prev.clienteActualId]);
      return {
        ...prev,
        proyectos: { ...prev.proyectos, [id]: proyecto },
        looksPorProyecto: { ...prev.looksPorProyecto, [id]: looks },
        chatPorProyecto: { ...prev.chatPorProyecto, [id]: [] },
      };
    });
    return id;
  }, []);

  const toggleFavorito = useCallback<StoreApi["toggleFavorito"]>((proyectoId, lookId) => {
    setState((prev) => ({
      ...prev,
      looksPorProyecto: {
        ...prev.looksPorProyecto,
        [proyectoId]: (prev.looksPorProyecto[proyectoId] ?? []).map((look) =>
          look.id === lookId
            ? { ...look, estado: look.estado === "favorito" ? "sugerido" : "favorito" }
            : look
        ),
      },
    }));
  }, []);

  const descartarLook = useCallback<StoreApi["descartarLook"]>((proyectoId, lookId) => {
    setState((prev) => ({
      ...prev,
      looksPorProyecto: {
        ...prev.looksPorProyecto,
        [proyectoId]: (prev.looksPorProyecto[proyectoId] ?? []).map((look) =>
          look.id === lookId ? { ...look, estado: "descartado" } : look
        ),
      },
    }));
  }, []);

  const setComentarioLook = useCallback<StoreApi["setComentarioLook"]>((lookId, texto) => {
    setState((prev) => ({
      ...prev,
      comentariosPorLook: { ...prev.comentariosPorLook, [lookId]: texto },
    }));
  }, []);

  const regenerarDesdeFavoritos = useCallback<StoreApi["regenerarDesdeFavoritos"]>(
    (proyectoId) => {
      setState((prev) => {
        const proyecto = prev.proyectos[proyectoId];
        const cliente = prev.clientes[prev.clienteActualId];
        const looks = prev.looksPorProyecto[proyectoId] ?? [];
        const favoritos = looks.filter((look) => look.estado === "favorito");
        if (!proyecto || favoritos.length === 0) return prev;

        const variantes = regenerarVariantes(
          proyecto,
          cliente,
          favoritos,
          prev.comentariosPorLook
        );

        const nuevaAsociacion: Record<string, string> = {};
        favoritos.forEach((favorito, i) => {
          const variante = variantes[i];
          if (variante && variante.id !== favorito.id) {
            nuevaAsociacion[variante.id] = favorito.id;
          }
        });

        return {
          ...prev,
          proyectos: { ...prev.proyectos, [proyectoId]: { ...proyecto, estado: "refinamiento" } },
          looksPorProyecto: {
            ...prev.looksPorProyecto,
            [proyectoId]: [...looks, ...variantes],
          },
          variantePadre: { ...prev.variantePadre, ...nuevaAsociacion },
        };
      });
    },
    []
  );

  const enviarMensajeChat = useCallback<StoreApi["enviarMensajeChat"]>((proyectoId, texto) => {
    setState((prev) => {
      const previos = prev.chatPorProyecto[proyectoId] ?? [];
      const respuestaShopper: ChatMensaje = {
        autor: "shopper",
        texto: "¡Gracias por el detalle! Lo tengo en cuenta para la propuesta final.",
      };
      return {
        ...prev,
        chatPorProyecto: {
          ...prev.chatPorProyecto,
          [proyectoId]: [...previos, { autor: "cliente", texto }, respuestaShopper],
        },
      };
    });
  }, []);

  const aprobarLookComoPropuesta = useCallback<StoreApi["aprobarLookComoPropuesta"]>(
    (proyectoId, lookId) => {
      setState((prev) => ({
        ...prev,
        proyectos: {
          ...prev.proyectos,
          [proyectoId]: { ...prev.proyectos[proyectoId], estado: "propuesta" },
        },
        looksPorProyecto: {
          ...prev.looksPorProyecto,
          [proyectoId]: (prev.looksPorProyecto[proyectoId] ?? []).map((look) =>
            look.id === lookId ? { ...look, estado: "aprobado" } : look
          ),
        },
      }));
    },
    []
  );

  const confirmarAutorizacion = useCallback<StoreApi["confirmarAutorizacion"]>(
    (proyectoId, montoTope, medioPago) => {
      setState((prev) => ({
        ...prev,
        proyectos: {
          ...prev.proyectos,
          [proyectoId]: { ...prev.proyectos[proyectoId], estado: "autorizacion" },
        },
        autorizaciones: {
          ...prev.autorizaciones,
          [proyectoId]: {
            id: prev.autorizaciones[proyectoId]?.id ?? crypto.randomUUID(),
            proyecto_id: proyectoId,
            monto_tope: montoTope,
            medio_pago: medioPago,
            estado: "preautorizado",
            fecha: new Date().toISOString(),
          },
        },
      }));
    },
    []
  );

  const actualizarItemEstado = useCallback<StoreApi["actualizarItemEstado"]>(
    (proyectoId, itemId, estado) => {
      setState((prev) => {
        const { [itemId]: _omit, ...reemplazosSinItem } = prev.reemplazos;
        return {
          ...prev,
          reemplazos: estado === "no_disponible" ? prev.reemplazos : reemplazosSinItem,
          looksPorProyecto: {
            ...prev.looksPorProyecto,
            [proyectoId]: (prev.looksPorProyecto[proyectoId] ?? []).map((look) => ({
              ...look,
              items: look.items.map((item) => (item.id === itemId ? { ...item, estado } : item)),
            })),
          },
        };
      });
    },
    []
  );

  const buscarReemplazo = useCallback<StoreApi["buscarReemplazo"]>((proyectoId, itemId) => {
    setState((prev) => {
      const looks = prev.looksPorProyecto[proyectoId] ?? [];
      const todosLosItems = looks.flatMap((look) => look.items);
      const item = todosLosItems.find((i) => i.id === itemId);
      if (!item) return prev;

      const usados = todosLosItems.map((i) => i.producto);
      const candidato = encontrarReemplazo(item, usados);
      if (!candidato) return prev;

      const delta = (candidato.precio - item.precio) / item.precio;
      const requiereAprobacion = delta > 0.15;

      return {
        ...prev,
        reemplazos: {
          ...prev.reemplazos,
          [itemId]: {
            producto: candidato.producto,
            tienda: candidato.tienda,
            precio: candidato.precio,
            precioOriginal: item.precio,
            requiereAprobacion,
            aprobado: !requiereAprobacion,
          },
        },
      };
    });
  }, []);

  const aprobarReemplazoCliente = useCallback<StoreApi["aprobarReemplazoCliente"]>((itemId) => {
    setState((prev) => {
      const actual = prev.reemplazos[itemId];
      if (!actual) return prev;
      return {
        ...prev,
        reemplazos: { ...prev.reemplazos, [itemId]: { ...actual, aprobado: true } },
      };
    });
  }, []);

  const confirmarReemplazo = useCallback<StoreApi["confirmarReemplazo"]>((proyectoId, itemId) => {
    setState((prev) => {
      const reemplazo = prev.reemplazos[itemId];
      if (!reemplazo || !reemplazo.aprobado) return prev;
      const { [itemId]: _omit, ...restoReemplazos } = prev.reemplazos;

      return {
        ...prev,
        reemplazos: restoReemplazos,
        looksPorProyecto: {
          ...prev.looksPorProyecto,
          [proyectoId]: (prev.looksPorProyecto[proyectoId] ?? []).map((look) => ({
            ...look,
            items: look.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    producto: reemplazo.producto,
                    tienda: reemplazo.tienda,
                    precio: reemplazo.precio,
                    estado: "comprado",
                  }
                : item
            ),
          })),
        },
      };
    });
  }, []);

  const confirmarCompra = useCallback<StoreApi["confirmarCompra"]>((proyectoId) => {
    setState((prev) => {
      const looks = prev.looksPorProyecto[proyectoId] ?? [];
      const itemsComprados = looks
        .flatMap((look) => look.items)
        .filter((item) => item.estado === "comprado");
      const montoReal = itemsComprados.reduce((sum, item) => sum + item.precio, 0);
      const autorizacion = prev.autorizaciones[proyectoId];

      return {
        ...prev,
        proyectos: {
          ...prev.proyectos,
          [proyectoId]: { ...prev.proyectos[proyectoId], estado: "compra" },
        },
        autorizaciones: autorizacion
          ? {
              ...prev.autorizaciones,
              [proyectoId]: { ...autorizacion, estado: "capturado" },
            }
          : prev.autorizaciones,
        compras: {
          ...prev.compras,
          [proyectoId]: {
            id: prev.compras[proyectoId]?.id ?? crypto.randomUUID(),
            proyecto_id: proyectoId,
            items_comprados: itemsComprados.map((item) => item.id),
            monto_real: montoReal,
            comprobantes: [],
            fecha: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const marcarEntregado = useCallback<StoreApi["marcarEntregado"]>((proyectoId) => {
    setState((prev) => ({
      ...prev,
      proyectos: {
        ...prev.proyectos,
        [proyectoId]: { ...prev.proyectos[proyectoId], estado: "entrega" },
      },
      entregadoPorProyecto: { ...prev.entregadoPorProyecto, [proyectoId]: true },
    }));
  }, []);

  const guardarFeedback = useCallback<StoreApi["guardarFeedback"]>(
    (proyectoId, rating, comentario) => {
      setState((prev) => ({
        ...prev,
        proyectos: {
          ...prev.proyectos,
          [proyectoId]: { ...prev.proyectos[proyectoId], estado: "cerrado" },
        },
        feedbacks: {
          ...prev.feedbacks,
          [proyectoId]: {
            rating,
            comentario,
            devolucion_solicitada: prev.feedbacks[proyectoId]?.devolucion_solicitada ?? false,
            devolucion: prev.feedbacks[proyectoId]?.devolucion,
          },
        },
      }));
    },
    []
  );

  const solicitarDevolucion = useCallback<StoreApi["solicitarDevolucion"]>(
    (proyectoId, detalle) => {
      setState((prev) => ({
        ...prev,
        feedbacks: {
          ...prev.feedbacks,
          [proyectoId]: {
            rating: prev.feedbacks[proyectoId]?.rating ?? 0,
            comentario: prev.feedbacks[proyectoId]?.comentario ?? "",
            devolucion_solicitada: true,
            devolucion: detalle,
          },
        },
      }));
    },
    []
  );

  const looksDe = useCallback((proyectoId: string) => state.looksPorProyecto[proyectoId] ?? [], [state]);
  const proyectoDe = useCallback((proyectoId: string) => state.proyectos[proyectoId], [state]);

  const value = useMemo<StoreApi>(
    () => ({
      state,
      clienteActual: state.clientes[state.clienteActualId],
      guardarCliente,
      crearProyecto,
      toggleFavorito,
      descartarLook,
      setComentarioLook,
      regenerarDesdeFavoritos,
      enviarMensajeChat,
      aprobarLookComoPropuesta,
      confirmarAutorizacion,
      actualizarItemEstado,
      buscarReemplazo,
      aprobarReemplazoCliente,
      confirmarReemplazo,
      confirmarCompra,
      marcarEntregado,
      guardarFeedback,
      solicitarDevolucion,
      looksDe,
      proyectoDe,
    }),
    [
      state,
      guardarCliente,
      crearProyecto,
      toggleFavorito,
      descartarLook,
      setComentarioLook,
      regenerarDesdeFavoritos,
      enviarMensajeChat,
      aprobarLookComoPropuesta,
      confirmarAutorizacion,
      actualizarItemEstado,
      buscarReemplazo,
      aprobarReemplazoCliente,
      confirmarReemplazo,
      confirmarCompra,
      marcarEntregado,
      guardarFeedback,
      solicitarDevolucion,
      looksDe,
      proyectoDe,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
