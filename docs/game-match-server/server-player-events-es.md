# Eventos de configuración del jugador (Player)

> Si necesitas volver al documento anterior, haz clic [aquí](./server-connect-and-use-es.md).

- [Resumen de eventos](#resumen-de-eventos)
- [Obtener datos del jugador](#obtener-datos-del-jugador)
- [Cambiar nombre del jugador](#cambiar-nombre-del-jugador)

Los eventos descritos acá son de gestión del jugador, con el fin que se deba cambiar algun comportamiento
de este, como su nombre u otros parámetros a definir.

## Resumen de eventos

| Nombre                     | Evento      | Tipo     | Descripción                            |
|----------------------------|-------------|----------|----------------------------------------|
| Datos del jugador          |`player-data`| Saliente | Obtiene los datos del jugador actual.  |
| Cambiar nombre del jugador |`change-name`| Saliente | Permite cambiar el nombre del jugador. |

# Obtener datos del jugador

| Resumen         |                                                                                   |
|-----------------|-----------------------------------------------------------------------------------|
| __Evento__      | `player-data`                                                                     |
| __Tipo__        | Evento saliente (_Trigger_).                                                      |
| __Descripción__ | Evento para solicitar los datos del jugador actual.                               |
| __Parámetros__  | _Ninguno_.                                                                        |
| __Respuesta__   | `id` (_string_): ID de jugador.                                                   |
|                 | `name` (_string_): Nombre de jugador.                                             |
|                 | `status` (_string_): Estado actual del jugador (`AVAILABLE`, `BUSY`, `IN_MATCH`). |

Con este evento es posible recuperar la información actual del jugador, en caso que se haya perdido y deba
recuperarse. El evento como respuesta retornará el ID del jugador, su nombre y el estado actual.

Los estados posibles para el jugador son los siguientes:
- `AVAILABLE`: El jugador se encuentra disponible para recibir solicitudes de partida.
- `BUSY`: El jugador esta ocupado con una solicitud de partida, por lo que no puede recibir otras.
- `IN_MATCH`: El jugador se encuentra actualmente en una partida, por lo que no puede recibir solicitudes.

Ejemplo de solicitud:
```jsonc
// Evento enviado por el jugador
{
  "event": "player-data"
}

// Respuesta entregada por el servidor
{
  "event": "player-data",
  "status": "OK",
  "data": {
    "id": "c3e5aca7-f1c0-40ed-8b5c-aac3f58d137f",
    "name": "Player_Two",
    "status": "AVAILABLE"
  }
}
```

# Cambiar nombre del jugador

| Resumen         |                                                              |
|-----------------|--------------------------------------------------------------|
| __Evento__      | `change-name`                                                |
| __Tipo__        | Evento saliente (_Trigger_).                                 |
| __Descripción__ | Evento para cambiar el nombre representativo del jugador.    |
| __Parámetros__  | `name` (_string_): Nombre nuevo del jugador.                 |
| __Respuesta__   | `msg` (_string_): Mensaje descriptivo del evento.            |
|                 | `name` (_string_): Nuevo nombre establecido para el jugador. |

Al conectarse, el servidor establece un nombre por defecto. Con este evento, es posible cambiar el nombre del
jugador por el que estime conveniente, el cual se envía por parámetro a la solicitud. Si la solicitud esta
correcta, se retornará el nuevo nombre establecido para el jugador.

Ejemplo de solicitud:
```jsonc
// Evento enviado por el jugador
{
  "event": "change-name",
  "data": {
    "name": "Player_Two"
  }
}

// Respuesta entregada por el servidor
{
  "event": "change-name",
  "status": "OK",
  "data": {
    "msg": "Name changed",
    "name": "Player_Two"
  }
}
```