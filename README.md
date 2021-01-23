# MultiPlayer

## install

add github.settings.secrets:

- DOCKERHUB_TOKEN : <password>
- DOCKERHUB_USERNAME: <myname>
- DOCKER_REGISTRY: <name.azurecr.io>

## online multiplayer game(s).

Server (node.js)

[![Build Status](https://travis-ci.org/ReneCode/MultiPlayer.svg?branch=master)](https://travis-ci.org/ReneCode/MultiPlayer)

Web-Frontend (React)

[![Netlify Status](https://api.netlify.com/api/v1/badges/029ab0ff-295e-40f4-b444-891158fbeb0e/deploy-status)](https://app.netlify.com/sites/mpgame/deploys)

#Issues

- game_restart playerId should not be the 'current' player

#Ideas

# protocoll

## websocket-connection

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

```mermaid

graph TD;

    Home-->TicTacToe;
    Home-->FiveInARow;
    Home-->NobodyIsPerfect;
```

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
