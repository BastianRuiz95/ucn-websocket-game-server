# Conexión y uso del servidor de partidas

- [Descripción de Comunicación](#descripción-de-comunicación)
- [Conexión al servidor](#conexión-al-servidor)
- [Envío y recibo de mensajes](#envío-y-recepción-de-mensajes)
- [Descripción de Eventos](#descripción-de-eventos)

## Descripción de Comunicación
La comunicación vía WebSockets se realiza mediante el intercambio de mensajes en tiempo real. Cuando el cliente
(usted) solicite una acción, esta se envia mediante un texto por la conexión concretada y luego el servidor la
procesa. Según el caso, puede recibir una respuesta de confirmación de la acción con información o no.

Según la acción que se realice, el servidor puede enviar acciones a un cliente, a varios, o a todos los clientes
conectados. Por lo tanto, dentro de la comunicación se debe mantener la atencion a los eventos que se pueden
recibir y ejecutar las acciones que estimen pertinentes.

## Conexión al servidor
Para conectarse al servidor de juego, se le entregará una URL a la que su cliente de juego debe conectarse. Esta
URL esta formada de la siguiente manera: 

ws://nombre-del-servidor.com/

Puede usar algun servicio como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/) para
realizar pruebas a este endpoint.

Por funcionamiento del servidor, el jugador es desconectado automaticamente si luego de 1 minuto no ha enviado ni
recibido acciones. Puede enviar un evento aleatorio (como `'ping'`) cada cierto tiempo para evitar ser desconectado
por inactividad.

## Envío y recepción de mensajes
La solicitud y recepción de eventos por parte del cliente se realiza mediante mensajes de texto transmitidos por
el canal de comunicación establecido al conectarse al servidor. Estos mensajes están codificados en formato
[JSON](https://www.json.org/json-es.html), el cuál es un formato de intercambio de datos mediante serialización
utilizando clave-valor.  

La estructura del objeto JSON que se utiliza para el intercambio de eventos (tanto envío como recepción) es el
siguiente:

```json
{
  "event": "connected-to-server",
  "data": {
    "msg": "Welcome! You are connected to the game server",
    "id": "0f2cc688-dcf3-4952-b8f8-c52f75f316d4",
    "name": "Player_Name"
  }
}
```
- `event` (_string_): Nombre del evento que se enviará o recibira del servidor.
- `data` (_object_): Conjunto de datos a enviar o recibir con el evento. Variará según el evento solicitado.

En el caso de los eventos enviados, el servidor responderá con un mensaje en formato JSON con la misma estructura
anterior, pero agregando un parámetro de validación:

```json
{
  "event": "send-public-message",
  "status": "OK",
  "data": {
    "msg": "Message sent to all players"
  }
}
```
- `status` (_string_): Resultado de la solicitud, que puede ser correcta ("OK") o con errores ("ERROR").

Links de interés:
- [Manejo de cadenas de texto JSON en Godot (en inglés)](https://docs.godotengine.org/en/stable/classes/class_json.html)
- [Manejo de cadenas de texto JSON en Unity](https://docs.unity3d.com/es/530/Manual/JSONSerialization.html)

## Descripción de Eventos
En primer lugar, debemos definir dos tipos de eventos:

- __Evento Entrante__: Mensajes que son enviados por el servidor y recibidos por los jugadores. Estos eventos son
                       de escucha, y según el evento recibido en el parámetro `event` se deben ejecutar ciertas
                       acciones en los clientes.
- __Evento Saliente__: Mensajes que son enviados por los jugadores hacia el servidor para ejecutar una acción. Estos
                       eventos se deben construir en los clientes y enviarse al servidor. El servidor responderá al
                       cliente con un mensaje de satisfacción o error, y ejecutará las acciones pertinentes al
                       evento en sí.

El servidor tiene (de momento) 5 tipos de eventos, los cuales se encuentran descritos en documentos separados por
legibilidad. El resumen de los eventos procesados por el servidor  se puede revisar en
[este documento](./server-events-list-es.md).

### [Conexión/desconexión (Login/Logout)](./server-login-events-es.md).
Son todos los eventos relacionados a la conexión y desconexión de jugadores.

### [Configuración del jugador (Player)](./server-player-events-es.md)
Son todos los eventos relacionados a la configuración del jugador, como el cambio de nombre y la obtención de
data importante.

### [Sala de espera y comunicación (Lobby)](./server-lobby-events-es.md)
Son todos los eventos de la sala de espera, como el envío de mensaje públicos y privados.

### [Emparejamiento y creación de partidas (Matchmaking)](./server-match-events-es.md)
Son todos los eventos relacionados a las solicitudes de partida, como invitaciones, aceptar y rechazar.

### [Partidas en ejecución (Playing)](./server-playing-events-es.md)
Son todos los eventos de la partida en ejecución, como el envío de datos a cada juego y las acciones de iniciar
y terminar partida.
