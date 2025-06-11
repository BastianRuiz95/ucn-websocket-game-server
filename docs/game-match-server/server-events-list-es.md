# Listado de eventos utilizables en el servidor de juego

## Conexión de jugadores
### Eventos entrantes

| Evento              | Descripción                                 |
|---------------------|---------------------------------------------|
|`player-connected`   | Se ha conectado un jugador al servidor.     |
|`player-disconnected`| Se ha desconectado un jugador del servidor. |
|`connected-to-server`| Te has conectado al servidor de juego.      |

## Configuración del jugador
### Eventos salientes

| Evento      | Descripción                            |
|-------------|----------------------------------------|
|`player-data`| Obtiene los datos del jugador actual.  |
|`change-name`| Permite cambiar el nombre del jugador. |

## Sala de espera (Lobby)
### Eventos salientes

| Evento               | Descripción                                 |
|----------------------|---------------------------------------------|
|`online-players`      | Obtener el listado de jugadores conectados. |
|`send-public-message` | Enviar un mensaje a todos los jugadores.    |
|`send-private-message`| Enviar un mensaje a un jugador específico.  |

### Eventos entrantes

| Evento          | Descripción                   |
|-----------------|-------------------------------|
|`public-message` | Recibiste un mensaje público. |
|`private-message`| Recibiste un mensaje privado. |

## Emparejamiento (Matchmaking)
### Eventos salientes

| Evento               | Descripción                                     |
|----------------------|-------------------------------------------------|
|`send-match-request`  | Enviar una solicitud de partida a otro jugador. |
|`cancel-match-request`| Cancelar la solicitud de partida actual.        |
|`accept-match`        | Aceptar una solicitud de partida entrante.      |
|`reject-match`        | Rechazar una solicitud de partida entrante.     |

### Eventos entrantes

| Evento                   | Descripción                                                           |
|--------------------------|-----------------------------------------------------------------------|
|`match-request-received`  | Recibiste una solicitud de partida.                                   |
|`match-canceled-by-sender`| La solicitud de partida recibida se canceló por el jugador remitente. |
|`match-accepted`          | El jugador a quien solicitaste una partida aceptó la solicitud.       |
|`match-rejected`          | El jugador a quien solicitaste una partida rechazó la solicitud.      |

