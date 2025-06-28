# Eventos de la jugabilidad en línea (GameMatch)

> Si necesitas volver al documento anterior, haz clic [aquí](./server-connect-and-use-es.md).
 
- [Resumen de eventos](#resumen-de-eventos)

- [Jugadores Listos (players-ready)](#jugadores-listos-players-ready)
- [Partida Iniciada (match-start)](#partida-iniciada-match-start)
- [Datos recibidos por el jugador contrincante (receive-game-data)](#datos-recibidos-por-el-jugador-contrincante-receive-game-data)
- [Partida Terminada (game-ended)](#partida-terminada-game-ended)
- [Repetir juego / Revancha (rematch-request)](#repetir-juego--revancha-rematch-request)
- [Partida cerrada o concluida (close-match)](#partida-cerrada-o-concluida-close-match)


Después de establecer una solicitud de partida correcta, los jugadores podrán conectarse a una sala dedicada y 
comenzar a jugar sin problemas. Al inicio, deberán conectarse y mandar un ping para establecer conexión. Luego,
la sala estará lista para recibir eventos personalizados entre los jugadores. El juego termina cuando uno de
los jugadores manda el evento de partida finalizada, que lo declara ganador. Finalmente, ambos jugadores
tendrán la opción para volver a jugar enviando una solicitud de nueva partida, o bien, pueden abandonar la
partida.

## Resumen de eventos

| Evento                 | Tipo     | Descripción                                                             |
|------------------------|----------|-------------------------------------------------------------------------|
| `players-ready`        | Entrante | Avisa que ambos jugadores estan listos para comenzar la partida.        |
| `match-start`          | Entrante | Avisa que la partida ha iniciado y esta lista para recibir eventos.     |
| `receive-game-data`    | Entrante | Avisa que el otro jugador envió un evento a su partida.                 |
| `game-ended`           | Entrante | Avisa que un jugador ha ganado la partida.                              |
| `rematch-request`      | Entrante | Avisa que el otro jugador envió una solicitud para volver a jugar.      |
| `close-match`          | Entrante | Avisa que el otro jugador salió de la partida.                          |
| `connect-match`        | Saliente | Se utiliza para conectarse a la partida creada por la solicitud.        |
| `ping-match`           | Saliente | Se utiliza para establecer un primer contacto y determinar la latencia. |
| `send-game-data`       | Saliente | Envía datos hacia la partida del otros jugador.                         |
| `finish-game`          | Saliente | Se utiliza para declarar como ganador al jugador que manda este evento. |
| `send-rematch-request` | Saliente | Envía una solicitud para volver a jugar la misma partida.               |
| `quit-match`           | Saliente | Se utiliza para salir de una partida que ha finalizado.                 |

<details>
<summary>Diagrama de secuencia y descripción de los eventos:</summary>
TODO
</details>

## Jugadores Listos (players-ready)

| Resumen         |                                                                          |
|-----------------|--------------------------------------------------------------------------|
| __Evento__      | `players-ready`                                                          |
| __Tipo__        | Evento entrante (_Listen_).                                              |
| __Descripción__ | Aviso que ambos jugadores ya se encuentran listos en la sala para jugar. |
| __Respuesta__   | `matchId` (_string_): ID de la partida asociada a la solicitud.          |

Este evento se recibe cuando ambos jugadores se han conectado a la sala con `connect-match`.
Esta acción permite avanzar con el flujo, enviando por parte del jugador el evento `ping-match`.

Ejemplo de respuesta:
```jsonc
{
  "event": "players-ready",
  "msg": "Both players are ready to start. Send 'ping-match' to sync times.",
  "data": {
    "matchId": "30c3d082-bcd9-48b0-9a90-76212636bc6f"
  }
}
```

## Partida Iniciada (match-start)

| Resumen         |                                                                 |
|-----------------|-----------------------------------------------------------------|
| __Evento__      | `match-start`                                                   |
| __Tipo__        | Evento entrante (_Listen_).                                     |
| __Descripción__ | Evento que inicia la partida en ambos juegos.                   |
| __Respuesta__   | `matchId` (_string_): ID de la partida asociada a la solicitud. |

Cuando ambos jugadores realizaron la prueba de ping, la partida inicia en ambos clientes. Esto habilita el
evento `send-game-data`, que permite enviar datos directamente al otro cliente de juego. 

Como nota, no es necesario iniciar la partida inmediatamente. Pueden enviar eventos previos para configurar las
partidas y luego iniciar.

Ejemplo de respuesta:
```jsonc
{
  "event": "match-start",
  "msg": "Match is ready to receive events. Send it with 'send-game-data'.",
  "data": {
    "matchId": "30c3d082-bcd9-48b0-9a90-76212636bc6f"
  }
}
```

## Datos recibidos por el jugador contrincante (receive-game-data)

| Resumen         |                                                       |
|-----------------|-------------------------------------------------------|
| __Evento__      | `receive-game-data`                                   |
| __Tipo__        | Evento entrante (_Listen_).                           |
| __Descripción__ | Indica que se recibió información del otro juego.     |
| __Respuesta__   | `any`: Datos del otro juego dentro del objeto `data`. |

Durante el juego, su contrincante puede mandar datos de todo tipo, como beneficios, castigos, actualizaciones,
entre otros. Esta información llega dentro del parámetro `data`. Pueden establecer distintos parámentros, como
subeventos, valores de puntaje, vida, tipo de beneficio o perjuicio, etc. Es importante coordinarse entre
equipos de desarrollo para estandarizar los datos enviados, ya sea entre todos los clientes de juego, o uno en
particular.

Ejemplo de respuesta:

> _Los datos recibidos dentro de `data` variarán según el estándar establecido. No es necesario seguir este_
> _estándar por obligación._
```jsonc
{
  "event": "receive-game-data",
  "msg": "Event received from match.",
  "data": {
    "subEvent": "attack",
    "attackType": "MID-RANGE-ATTACK",
    "opDamage": 30,
    "opLives": 940,
    "opScore": 90291,
    "skills": {
      "sword": 3,
      "shield": 5,
      "bow": 10, 
    }
  }
}
```

## Partida Terminada (game-ended)

| Resumen         |                                                            |
|-----------------|------------------------------------------------------------|
| __Evento__      | `game-ended`                                               |
| __Tipo__        | Evento entrante (_Listen_).                                |
| __Descripción__ | Evento que indica el término de la partida.                |
| __Respuesta__   | `matchStatus` (_string_): Estado de la partida (FINISHED). |

Recibir este evento indica que la partida terminó, dando como ganador al oponente. Esto se realizó asi por
tiempo y evitar validaciones innecesarias, confiando en los clientes de juego y en sus desarrolladores. En un
futuro, esto debe cambiarse para que la validación venga del servidor.

Con esta llamada, el jugador muestra la pantalla de derrota, la posibilidad de revancha mandando el evento
`send-match-request`, o bien salir de la partida, activando el evento `quit-match`.

Ejemplo de respuesta:
```jsonc
{
  "event": "game-ended",
  "msg": "Game over! Player_Two wins!",
  "data": {
    "matchStatus": "FINISHED"
  }
}
```

## Repetir juego / Revancha (rematch-request)

| Resumen         |                                                       |
|-----------------|-------------------------------------------------------|
| __Evento__      | `rematch-request`                                     |
| __Tipo__        | Evento entrante (_Listen_).                           |
| __Descripción__ | Evento que indica que el oponente desea una revancha. |
| __Respuesta__   | `null`: No se recibe nada en data.                    |

Recibir este evento indica que el oponente desea una revancha. Esta función permite volver a competir en una
partida con el mismo jugador sin necesidad de volver a crear una solicitud de partida. El jugador puede aceptar
esta solicitud mandando el evento `send-rematch-request`, lo cual reinicia el flujo de eventos recibiendo el
evento `players-ready`.

Ejemplo de respuesta:
```jsonc
{
  "event": "rematch-request",
  "msg": "Player 'Player_Two' wants to play again. Send 'send-rematch-request' to accept.",
  "data": null
}
```

## Partida cerrada o concluida (close-match)

| Resumen         |                                                             |
|-----------------|-------------------------------------------------------------|
| __Evento__      | `close-match`                                               |
| __Tipo__        | Evento entrante (_Listen_).                                 |
| __Descripción__ | Evento que indica que la partida ha concluido por abandono. |
| __Respuesta__   | `null`: No se recibe nada en data.                          |

Recibir este evento indica que el oponente abandonó la sala después de terminar el juego, por lo que no es
posible solicitar una revancha. Con lo que solo queda la opción de abandonar la partida.

Ejemplo de respuesta:
```jsonc
{
  "event": "close-match",
  "msg": "Player 'Player_Two' has quit to the game. Rematch is not possible.",
  "data": null
}
```

