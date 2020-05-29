# MultiPlayer

online multiplayer game(s) - Server (websocket) and Web-Frontend (React)

#Issues

- game_restart playerId should not be the 'current' player

#Ideas

- try game "five in a row"

# protocoll

## websocket-connection

```txt
SERVER                                                                          CLIENT

get "connection" -           >>  CLIENT_CONNECTED(newPlayerId) >>>
                                                                            save playerId





                                    << GAME_CONNECT(gameId,playerId) <<
game.addPlayer(playerId)
                              >> UPDATE (to all players of that game)>>>



                                    <<<< GAME_START <<<<<
 game.start()
                              >>>>> UPDATE >>>>







get "close" "update"

_Client_
get "CLIENT_CONNECTED"(playerId) - save playerId

send "GAME_CONNECT"
```
