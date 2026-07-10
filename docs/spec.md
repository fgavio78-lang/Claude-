# Personal Shopper App — Especificación de Producto (Flujos y Pantallas)

## Actores

- **Cliente**: quiere que le armen un look para una ocasión, con presupuesto definido.
- **Shopper**: el emprendedor, cura y aprueba la propuesta final, ejecuta la compra.
- **Sistema**: orquesta el flujo, genera sugerencias con AI, maneja presupuesto y autorización de pago.

---

## Flujo completo (alto nivel)

```
Onboarding → Nuevo Proyecto → Perfil + Ocasión + Presupuesto
   → Lookbook AI (sugerencias) → Feedback del cliente
   → Propuesta curada por el shopper (precio + calidad)
   → Aprobación del cliente → Autorización de pago (preauth)
   → Compra ejecutada por el shopper → Confirmación + comprobantes
   → Entrega → Feedback / devolución (si aplica)
```

---

## Pantallas

### 1. Onboarding — Perfil del cliente
- Datos básicos: talles, estilo preferido (casual/formal/streetwear/etc.), colores que evita, marcas favoritas.
- Fotos de referencia opcionales (para que la AI entienda el tipo de cuerpo/estilo).
- Método de pago a asociar (se pide acá o se difiere al momento de autorizar — ver pantalla 6).

### 2. Nuevo Proyecto — Ocasión + Presupuesto
- Selector de ocasión: trabajo / cita / evento especial / casual / otro (custom).
- Fecha del evento (define urgencia).
- Presupuesto: slider o input con rango mín-máx.
- Nivel de "propuesta superadora": ¿priorizás precio, calidad o balance? (esto define cómo pondera el shopper/AI las opciones).

### 3. Lookbook AI — Sugerencias iniciales
- Grid de 3-6 looks generados (AI genera combinaciones visuales basadas en perfil + ocasión + presupuesto).
- Cada look muestra: preview visual, breakdown de ítems, precio total estimado, tiendas de referencia.
- Cliente puede: ❤️ marcar favoritos, 👎 descartar, comentar ("más formal", "sin estampados").

### 4. Refinamiento — Feedback iterativo
- Basado en el feedback, se regeneran variantes de los looks marcados como favoritos.
- Opción de chat con el shopper si el cliente quiere guiar manualmente en vez de solo iterar con AI.

### 5. Propuesta Final — Curada por el shopper
- El shopper revisa las opciones favoritas del cliente y arma la propuesta definitiva.
- Muestra: comparación de precio de mercado vs. precio conseguido (el "superador"), justificación de calidad, links/fotos reales de los productos en las tiendas seleccionadas.
- Cliente ve el desglose: costo de la ropa + comisión del shopper (transparente) + abono ya pagado (se descuenta si corresponde).

### 6. Autorización de pago
- Cliente ve el monto total y el tope máximo autorizado.
- Confirma medio de pago (tarjeta) con **preautorización** (hold), no cobro directo todavía.
- Firma digital / checkbox de términos: "autorizo al shopper a comprar en mi nombre hasta el monto de $X, ítems detallados arriba".
- Notificación clara: nada se compra sin esta confirmación explícita.

### 7. Ejecución de compra
- Vista interna del shopper: checklist de ítems a comprar, con estado (pendiente/comprado/no disponible).
- Si un ítem no está disponible, se dispara un flujo de reemplazo que vuelve a pasar por aprobación del cliente si cambia el precio significativamente.
- Al comprar, se captura el monto real (puede ser menor al preautorizado, nunca mayor sin nueva aprobación).

### 8. Confirmación y tracking
- Cliente ve comprobantes/facturas de cada ítem comprado.
- Estado de envío/entrega (si aplica logística propia o de las tiendas).
- Resumen final: total gastado vs. presupuesto original.

### 9. Post-entrega — Feedback y devoluciones
- Cliente califica el look recibido.
- Flujo de devolución: quién paga el flete, plazo, reembolso parcial si aplica.
- Data de feedback alimenta el perfil del cliente para el próximo proyecto (mejora la curaduría futura).

---

## Data model (borrador)

```
Cliente
- id, talles, estilo_preferido[], colores_evitar[], marcas_favoritas[], fotos_referencia[]

Proyecto
- id, cliente_id, ocasion, fecha_evento, presupuesto_min, presupuesto_max, prioridad (precio/calidad/balance), estado

Look
- id, proyecto_id, items[], precio_total, fuente (AI | shopper), estado (sugerido/favorito/descartado/aprobado)

Item
- id, look_id, producto, tienda, precio, url, foto, estado (pendiente/comprado/no_disponible)

Autorizacion_Pago
- id, proyecto_id, monto_tope, medio_pago, estado (preautorizado/capturado/liberado), fecha

Compra
- id, proyecto_id, items_comprados[], monto_real, comprobantes[], fecha
```

---

## Notas de implementación

- La preautorización (hold) es clave: evita que el shopper cobre de más o compre sin visibilidad del cliente. En Argentina, Mercado Pago soporta este tipo de flujo.
