# Eventos de conexión y desconexión.

> Si necesitas volver al documento anterior, haz clic [aquí](./server-connect-and-use-es.md).

- [Resumen de eventos](#resumen-de-eventos)
- [Conectado](#conectado)
- [Jugador conectado](#jugador-conectado)
- [Jugador desconectado](#jugador-desconectado)

Los eventos de conexión y desconexión son gatillados por el servidor al momento que algun jugador se conecta
al endpoint de WebSocket establecido. Estas acciones estan definidas principalmente para gestionar de mejor
forma el listado de usuarios que se mostrará en su juego, y así no tenga la necesidad de ejecutar el evento
`get-connected-players` cada cierto tiempo.

Los tres tipos de eventos relacionados a la conexión y desconexión son de escucha (Eventos entrantes), por
lo que su cliente de juego debe realizar alguna acción al momento que los reciba.

Estos eventos son enviados por el servidor al momento que este u otro usuario realizan alguna acción. Su
cliente de juego debe escuchar los mensajes que el servidor puede enviar, interpretarlos, y realizar las
acciones que sean necesarias para su correcto funcionamiento.

## Resumen de eventos

| Nombre               | Evento              | Tipo     | Descripción                               |
|----------------------|---------------------|----------|-------------------------------------------|
| Conectado            |`connected-to-server`| Entrante | Indica que te has conectado al servidor.  |
| Jugador conectado    |`player-connected`   | Entrante | Indica que un jugador se ha conectado.    |
| Jugador desconectado |`player-disconnected`| Entrante | Indica que un jugador se ha desconectado. |

## Conectado

| Resumen         |                                                                                         |
|-----------------|-----------------------------------------------------------------------------------------|
| __Evento__      | `connected-to-server`                                                                   |
| __Tipo__        | Evento entrante (_Listen_).                                                             |
| __Descripción__ | Mensaje recibido para indicar que el cliente se ha conectado al servidor correctamente. |
| __Respuesta__   | `id` (_string_): ID de jugador que se te ha asignado al conectarte.                     |
|                 | `name` (_string_): Nombre de jugador que se te ha asignado al conectarte.               |

Este es un evento gatillado al momento de conectarse al servidor con el fin de saber que la operación se
realizó correctamente. En el mensaje viene incluido el identificador y el nombre asignado al cliente con
el fin de utilizarlo a lo largo de la conexión.

Ejemplo de respuesta:
```jsonc
{
  "event": "connected-to-server",
  "msg": "Welcome! You are connected to the game server",
  "data": {
    "id": "0f2cc688-dcf3-4952-b8f8-c52f75f316d4",
    "name": "Player_Name"
  }
}
```

## Jugador Conectado

| Resumen         |                                                                           |
|-----------------|---------------------------------------------------------------------------|
| __Evento__      | `player-connected`                                                        |
| __Tipo__        | Evento entrante (_Listen_).                                               |
| __Descripción__ | Mensaje recibido para indicar que un jugador se ha conectado al servidor. |
| __Respuesta__   | `id` (_string_): ID de jugador que se conectó.                            |
|                 | `name` (_string_): Nombre de jugador que se conectó.                      |

Este evento se gatilla cuando otro jugador se ha conectado al servidor. El mensaje recibido contiene tanto
el identificador y el nombre del jugador. Puede usarse para actualizar el listado de jugadores de su cliente
de juego, agregando al jugador en cuestión. De esta forma, no es necesario llamar al evento
`get-connected-players` para actualizar el listado cuando se produce este evento.

Ejemplo de respuesta:
```jsonc
{
  "event": "player-connected",
  "msg": "Player 'Player_Two' (5db4f2a5-5982-4f85-a4ea-56f3ad6eafd0) has connected",
  "data": {
    "id": "5db4f2a5-5982-4f85-a4ea-56f3ad6eafd0",
    "name": "Player_Two"
  }
}
```

## Jugador Desconectado

| Resumen         |                                                                              |
|-----------------|------------------------------------------------------------------------------|
| __Evento__      | `player-disconnected`                                                        |
| __Tipo__        | Evento entrante (_Listen_).                                                  |
| __Descripción__ | Mensaje recibido para indicar que un jugador se ha desconectado al servidor. |
| __Respuesta__   | `id` (_string_): ID de jugador que se desconectó.                            |
|                 | `name` (_string_): Nombre de jugador que se desconectó.                      |

De forma contraria al evento anterior, `player-disconnected` es un evento gatillado cuando un jugador se
desconecta del servidor, ya sea de forma automática, manual o forzosa. Se puede utilizar de igual forma para
actualizar el listado de jugadores conectados, eliminando al jugador en cuestión.

Ejemplo de respuesta:
```jsonc
{
  "event": "player-disconnected",
  "msg": "Player 'Player_Two' (5db4f2a5-5982-4f85-a4ea-56f3ad6eafd0) has disconnected",
  "data": {
    "id": "5db4f2a5-5982-4f85-a4ea-56f3ad6eafd0",
    "name": "Player_Two"
  }
}
```