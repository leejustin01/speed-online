import type { GameState } from "@game/types";
import MyHand from "../components/MyHand";
import OpponentHand from "../components/OpponentHand";
import PlayPile from "../components/PlayPile";
import DrawPile from "../components/DrawPile";
import type { Move } from "@game/types";
import "./Board.css"
import { socket } from "../socket";

export default function Board({ game, playerIdx, roomId }: { game: GameState, playerIdx: number, roomId: string }) {
    const player = game.players[playerIdx]
    const opponent = game.players[playerIdx === 0 ? 1 : 0]

    const handlePlay = (pileIdx: number, cardId: string) => {
        const play: Move = {
            type: "PLAY_CARD",
            playerIndex: playerIdx,
            cardId: cardId,
            pileIndex: pileIdx
        }
        socket.emit("player_move", { roomId: roomId, move: play })
    }

    console.log(game)
    return (
        <div className="Board">
            <div className="opp-side">
                <DrawPile count={opponent.drawPile.length}/>
                <OpponentHand count={opponent.hand.length}/>
            </div>
            
            <div className="play-field">
                <DrawPile count={game.drawPiles[0].length}/>
                <PlayPile faceUp={game.status === "waiting"} topCard={game.playPiles[0][game.playPiles[0].length-1]} pileIdx={0} handlePlay={handlePlay}/>
                <PlayPile faceUp={game.status === "waiting"} topCard={game.playPiles[1][game.playPiles[1].length-1]} pileIdx={1} handlePlay={handlePlay}/>
                <DrawPile count={game.drawPiles[1].length}/>
            </div>

            <div className="my-side">
                <MyHand hand={player.hand}/>
                <DrawPile count={player.drawPile.length}/>
            </div>
            
        </div>
    )
}