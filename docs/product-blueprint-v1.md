# Product Blueprint v1 — Business Starter

## 1. Resumen del producto

**Business Starter** es un starter modular para crear sitios web modernos de negocios locales de forma rápida, reutilizable y escalable. Su propósito es permitir la construcción de múltiples webs para distintos negocios sin comenzar cada proyecto desde cero, manteniendo una base técnica común, una arquitectura limpia y capacidad de personalización profunda por cliente.

El enfoque inicial del producto es resolver necesidades reales de negocios locales mediante sitios profesionales, estilizados según su identidad, con funcionalidades comerciales y operativas básicas. Aunque la prioridad actual es ofrecer este servicio por encargo, la arquitectura debe sentar bases sólidas para evolucionar en el futuro hacia una plataforma centralizada tipo SaaS para múltiples negocios.

## 2. Problema que resuelve

Actualmente, construir un sitio distinto para cada negocio desde cero implica:

- repetir trabajo técnico y visual,
- duplicar decisiones de arquitectura,
- aumentar el tiempo de entrega,
- dificultar el mantenimiento,
- volver costosa la personalización.

Además, muchos negocios locales necesitan visibilidad digital, catálogo, contacto directo y una presencia profesional, pero no requieren soluciones empresariales complejas ni pagos en línea desde la primera etapa.

**Business Starter** resuelve esto ofreciendo una base reusable, configurable y extensible que acelera la entrega de sitios para negocios locales y permite adaptar diseño, contenido y módulos según cada cliente.

## 3. Propuesta de valor

Business Starter ofrece:

- **entrega rápida** de sitios para negocios locales,
- **reutilización técnica** entre proyectos,
- **personalización profunda** por identidad de marca,
- **módulos activables** según necesidades del cliente,
- **estructura preparada para crecimiento**, 
- **evolución progresiva** desde servicio por encargo hacia una solución centralizada.

El cliente final recibe una web profesional, moderna y alineada con su negocio, mientras que internamente el sistema permite operar con mayor eficiencia y consistencia.

## 4. Objetivo de negocio

### Objetivo principal actual
Vender servicios por encargo a negocios que deseen tener su propia web profesional.

### Objetivo de evolución
Convertir gradualmente el sistema en la base de una futura plataforma tipo SaaS orientada a negocios locales.

### Modelo comercial inicial
Servicio con **mensualidad por setup y mantenimiento**, acompañado de posibles extras o módulos avanzados.

## 5. Público objetivo

### Público inicial
- cafeterías,
- pequeños negocios locales,
- emprendimientos que vendan productos,
- negocios que necesiten catálogo digital y canal de contacto.

### Criterio de expansión
Aunque el caso inicial de diseño se apoyará en cafeterías, el sistema debe ser suficientemente abstracto para servir a otros negocios que vendan productos.

### Clientes que no son prioridad al inicio
- negocios con e-commerce complejo,
- operaciones con múltiples sucursales,
- lógica avanzada de reservas,
- inventario complejo,
- integraciones de pago online desde la primera versión,
- requerimientos fuera del alcance de un starter modular simple.

## 6. Contexto de mercado

El contexto inicial es **Cuba**, donde el flujo comercial y digital tiene particularidades importantes:

- el pago online tradicional no será parte del MVP,
- el contacto directo por **WhatsApp** será el canal principal de conversión,
- más adelante podrían investigarse integraciones locales como **Transfermóvil** o **EnZona**,
- en la etapa inicial los pedidos se cierran por coordinación entre cliente y negocio.

Esto implica que el producto no debe diseñarse inicialmente alrededor de checkout o pagos embebidos, sino alrededor de **visibilidad, catálogo, promoción y contacto efectivo**.

## 7. Visión del producto

Construir un sistema base reutilizable para sitios web de negocios locales, que permita:

- entregar múltiples webs desde un solo núcleo técnico,
- personalizar branding, estructura visual y módulos por cliente,
- incorporar gradualmente capacidades operativas,
- centralizar la gestión en el futuro.

La visión no es solo tener una plantilla visual, sino una **base de producto** con identidad arquitectónica clara.

## 8. Principios del producto

- modularidad,
- configuración sobre hardcodeo,
- reusabilidad,
- personalización profunda,
- arquitectura limpia,
- crecimiento progresivo,
- foco realista en necesidades del mercado local,
- escalabilidad futura sin sobrediseñar el presente.

## 9. Alcance del MVP

La primera versión funcional debe permitir construir y entregar una web de negocio local bien hecha, con identidad propia, catálogo, promociones y contacto.

### Páginas del MVP
- Inicio
- Sobre nosotros
- Catálogo / Menú
- Promociones
- Contacto
- FAQ
- Blog
- Galería

> Nota estratégica: aunque todas estas páginas están aprobadas, no todas deben tener la misma profundidad en la primera entrega. Algunas pueden salir como módulos básicos y evolucionar después.

## 10. Estructura del Home del MVP

La Home base debe estar compuesta por secciones reutilizables y reordenables. Las secciones iniciales aprobadas son:

- Hero principal
- Productos destacados
- Promociones
- Testimonios
- CTA de WhatsApp
- Ubicación
- Horarios

Estas secciones deben diseñarse para ser:

- configurables,
- activables/desactivables,
- estilables según branding,
- reutilizables entre negocios.

## 11. Funcionalidades obligatorias del MVP

- branding configurable,
- catálogo / menú,
- promociones,
- contacto,
- integración con WhatsApp como canal principal,
- SEO básico,
- base preparada para panel administrativo futuro.

### Decisión importante
Aunque el panel admin es una funcionalidad importante, queda fuera del MVP estricto.

- **MVP del sitio público:** sí
- **panel operativo:** no dentro del MVP estricto, pero sí contemplado en la arquitectura desde el inicio

## 12. Fuera del MVP

La primera versión **no incluirá**:

- pagos online directos,
- checkout real,
- pasarela de pago tradicional,
- lógica compleja de e-commerce,
- multi-sucursal,
- roles avanzados en administración,
- operaciones empresariales complejas.

Esto no significa que se descarten a futuro, sino que no deben condicionar la primera implementación.

## 13. Personalización por cliente

El sistema debe permitir personalizar, idealmente por configuración y estructura de datos:

- nombre del negocio,
- descripción,
- logo,
- colores,
- tipografías,
- imágenes,
- textos,
- navegación,
- orden de secciones,
- módulos activos,
- productos,
- promociones,
- horarios,
- ubicación,
- enlaces sociales,
- elementos de identidad visual.

### Nivel de personalización esperado
No basta con cambiar solo branding superficial. El sistema debe permitir también:

- cambiar bloques,
- activar/desactivar secciones,
- variar composición visual,
- adaptar la experiencia sin perder el núcleo reusable.

En otras palabras: **misma raíz técnica, distintas identidades de negocio**.

## 14. Sistema modular

El producto debe incorporar una lógica de módulos activables/desactivables para que cada negocio use solo lo que necesita.

### Módulos base
- catálogo
- promociones
- contacto
- CTA WhatsApp
- horarios
- ubicación

### Módulos opcionales
- galería
- testimonios
- FAQ
- blog
- carrito
- pedido por WhatsApp

La arquitectura debe contemplar desde el inicio que los módulos puedan:
- renderizarse condicionalmente,
- tener configuración propia,
- evolucionar independientemente.

## 15. Modelo funcional del catálogo

Cada producto o ítem del catálogo debe contemplar, como mínimo:

- nombre
- descripción
- precio
- imagen
- categoría
- destacado
- disponible
- variantes

### Requisitos asociados
- soporte para categorías desde el MVP,
- estado de disponibilidad / agotado,
- posibilidad de destacar productos,
- presentación orientada a negocios tipo cafetería pero extensible a otros rubros.

## 16. Modelo funcional de promociones

Las promociones deben incluir, idealmente:

- título,
- descripción,
- imagen,
- fecha de inicio,
- fecha de fin,
- estado activo/inactivo,
- posible vinculación con productos o categorías.

La inclusión de fechas es importante porque mejora la gestión operativa y la automatización futura.

## 17. Conversión y contacto

### Canal principal de conversión
**WhatsApp**

La web debe diseñarse para empujar claramente al usuario hacia la acción principal:
- escribir al negocio,
- consultar,
- reservar,
- pedir productos,
- acordar el pago offline o por medios externos.

### Flujo deseado
Deben convivir dos formas de contacto:

1. **contacto directo por WhatsApp**
2. **flujo de carrito con mensaje generado a WhatsApp**

Esto permite que, aunque no exista pago online, el usuario pueda:
- explorar productos,
- armar un pedido,
- generar un resumen,
- enviarlo al negocio por WhatsApp.

### Formulario de contacto
No es prioridad máxima, pero sí debe existir en el producto base.

### Horarios y ubicación
No serán obligatorios para todos los negocios, pero sí serán módulos activables/desactivables.

## 18. Panel operativo

### Decisión de fase
El panel administrativo queda para **fase 2**, no para el MVP público inicial.

### Alcance futuro del panel
Cuando se implemente, deberá permitir editar como mínimo:

- información del negocio,
- categorías,
- productos,
- promociones,
- textos de páginas,
- imágenes,
- navegación,
- horarios,
- redes sociales.

### Modelo de acceso inicial
- un solo admin por negocio en la primera etapa,
- posibilidad de múltiples roles más adelante.

### Fuente de datos
La dirección estratégica es que la edición viva en **base de datos**, no en archivos estáticos, aunque algunas decisiones de arranque podrían mantenerse en config si eso acelera la fase inicial.

## 19. Decisión arquitectónica clave

### Enfoque recomendado
**Especializado al principio, extensible internamente.**

Eso significa:
- usar cafeterías como caso de diseño inicial,
- pero modelar entidades y componentes de forma suficientemente abstracta para que luego sirvan a otros negocios que vendan productos.

Este punto es fundamental: no queremos un sistema atado semánticamente a “cafetería” en todo el código.

Por ejemplo:
- usar `products`, no `coffeeItems`
- usar `business_settings`, no `cafe_settings`

## 20. Estrategia de escalabilidad

Aunque la primera fase será por encargo, la intención estratégica es **centralizarlo todo a futuro**.

Por tanto, desde el diseño del sistema conviene:
- separar claramente configuración del negocio,
- pensar cada sitio como una instancia configurable,
- evitar decisiones irreversibles por cliente,
- preparar entidades que en el futuro puedan convivir bajo un modelo multi-negocio.

La prioridad declarada es **escalabilidad futura**, así que las decisiones técnicas deben favorecer estructura y consistencia, incluso si al inicio se implementa con moderación.

## 21. Dirección visual

### Estética base inicial
**Cálida y artesanal**

Esto encaja bien con:
- cafeterías,
- negocios pequeños,
- marcas locales con cercanía,
- una identidad visual humana y agradable.

### Evolución visual
El sistema no debe limitarse a una sola estética. Debe prepararse para futuras **skins o variantes visuales**, de modo que distintos negocios puedan proyectar identidades muy distintas sin cambiar el núcleo.

### Sistema de diseño
El sistema debe nacer con **tokens bien definidos**, no improvisados:
- colores semánticos,
- tipografías,
- espaciado,
- radios,
- sombras,
- variantes de componentes.

Esto es clave para que el starter no se convierta en una plantilla rígida sino en una base adaptable.

## 22. Modelo de monetización inicial

Business Starter se ofrecerá inicialmente como:

- setup del sitio,
- personalización por negocio,
- mantenimiento continuo,
- mensualidad por servicio.

### Posibles extras futuros
- panel admin avanzado,
- analíticas,
- multiidioma,
- blog enriquecido,
- carrito más avanzado,
- funciones específicas por sector,
- SEO ampliado,
- integraciones futuras de pago o canales locales.

## 23. Criterios de éxito para la v1

La v1 será exitosa si en un plazo de 30-60 días permite:

- tener una base sólida y reusable,
- construir varias webs bien hechas sin reiniciar desde cero,
- adaptar la identidad visual por negocio,
- soportar catálogo, promociones y contacto,
- servir como producto real para vender servicios.

El criterio rector es:

> tener el sistema para entregar varias páginas webs bien hechas.

## 24. Riesgos a controlar

- hacer el sistema demasiado específico para cafeterías,
- inflar el MVP con demasiadas funciones,
- intentar resolver SaaS demasiado pronto,
- diseñar demasiada complejidad antes de validar entregas reales,
- no separar bien contenido, branding y estructura,
- dejar la personalización dependiente de cambios manuales en muchos archivos.

## 25. Decisiones fundacionales del producto

1. El producto es un **starter modular**, no una plantilla estática simple.
2. La prioridad de negocio actual es **servicio por encargo**.
3. La dirección futura es una **plataforma centralizada / SaaS**.
4. El nicho inicial de diseño será **cafeterías**, pero el sistema apuntará a negocios que venden productos en general.
5. El canal principal de conversión es **WhatsApp**.
6. No habrá **pago online directo** en el MVP.
7. La personalización debe ir más allá de colores: también composición, módulos y estructura visual.
8. El panel administrativo va en **fase 2**.
9. La arquitectura debe ser **extensible, robusta y basada en configuración**.
10. El sistema de diseño debe nacer con **tokens definidos**.

## 26. Observaciones estratégicas consolidadas

### Priorización de páginas
No todas las páginas aprobadas tendrán el mismo peso en la primera entrega.

#### Core real del MVP
- Inicio
- Catálogo / Menú
- Promociones
- Contacto
- Sobre nosotros

#### Secundarias / activables
- FAQ
- Galería
- Blog

### Panel en fase 2
Primero se debe lograr:
- sitio público excelente,
- arquitectura de contenido correcta,
- branding configurable,
- módulos reutilizables.

Luego vendrá el panel.

### Carrito con WhatsApp como módulo
El carrito con mensaje a WhatsApp se contempla como módulo importante, pero no como núcleo inicial del sitio público base.

### Escalabilidad con pragmatismo
La escalabilidad futura debe influir en la arquitectura, pero sin intentar simular un SaaS completo desde la primera fase.