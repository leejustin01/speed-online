import { useEffect, useState, useCallback } from "react"

import MyHand from "../components/MyHand"
import OpponentHand from "../components/OpponentHand"
import PlayPile from "../components/PlayPile"
import DrawPile from "../components/DrawPile"
import StuckButton from "../components/StuckButton"
import type { Move } from "@game/types"

import type { GameState } from "@game/types"
import { socket } from "../socket"

import "./Board.css"


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function Board({ 
    game, 
    playerIdx, 
    roomId,
    onLeave
}: { 
    game: GameState, 
    playerIdx: number, 
    roomId: string,
    onLeave: () => void
}) {

    const player = game.players[playerIdx]
    const opponent = game.players[playerIdx === 0 ? 1 : 0]

    const [ showError, setShowError ] = useState(false)
    const [ selectedCardIdx, setSelectedCardIdx ] = useState<number | null>(null)
    const [ gameOver, setGameOver ] = useState(false)
    const [ resultMessage, setResultMesssage] = useState("")


    const handlePlay = (pileIdx: number, cardId?: string) => {
        let finalCardId = cardId

        if (!finalCardId && selectedCardIdx !== null) {
            finalCardId = player.hand[selectedCardIdx]?.id
        }

        if (!finalCardId) return

        const play: Move = {
            type: "PLAY_CARD",
            playerIndex: playerIdx,
            cardId: finalCardId,
            pileIndex: pileIdx
        }

        socket.emit("player_move", {
            roomId,
            move: play
        })

        setSelectedCardIdx(null)
    }

    const handleStuck = () => {
        const stuck: Move = {
            type: "CANNOT_PLAY",
            playerIndex: playerIdx
        }
        socket.emit("player_move", { roomId: roomId, move: stuck })
    }

    const handleDraw = useCallback(() => {
        const draw: Move = {
            type: "DRAW_CARD",
            playerIndex: playerIdx
        }

        socket.emit("player_move", {
            roomId,
            move: draw
        })
    }, [playerIdx, roomId])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const num = Number(e.key)

            if (num >= 1 && num <= player.hand.length) {
                setSelectedCardIdx(num - 1)
            }

            if (e.key === "Escape") {
                setSelectedCardIdx(null)
            }

            if (e.key.toLowerCase() === "r") {
                handleDraw()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [player.hand.length, handleDraw])

    useEffect(() => {
        
        const handleInvalidMove = async () => {
            setShowError(true)

            await delay(1000)

            setShowError(false)
        }

        const handleErrorMessage = (message: string) => {
            console.log("Server error: ", message)
        }

        const handleGameOver = (winner: number) => {
            setGameOver(true)
            const opponentIdx = playerIdx === 0 ? 1 : 0
            if (winner === 2) {
                setResultMesssage("Tie!")
            } else if (winner === playerIdx) {
                setResultMesssage("You Win!")
            } else if (winner === opponentIdx) {
                setResultMesssage("You Lose.")
            }
        }

        socket.on("invalid_move", handleInvalidMove)
        socket.on("error_message", handleErrorMessage)
        socket.on("game_over", handleGameOver)

        return () => {
            socket.off("invalid_move", handleInvalidMove)
            socket.off("error_message", handleErrorMessage)
            socket.off("game_over", handleGameOver)
        }
    }, [])


    return (
        <div className="Board">

            <div className={`board-content ${gameOver ? "over" : ""}`}>

                <div className="opp-side">
                    <DrawPile count={opponent.drawPile.length}/>
                    <OpponentHand count={opponent.hand.length}/>
                </div>

                <div className={`error-message ${showError ? "show" : "hide"}`}>
                    Invalid Move
                </div>

                <div className="play-field">
                    <DrawPile count={game.drawPiles[0].length}/>

                    <PlayPile
                        faceUp={game.status !== "waiting"}
                        topCard={game.playPiles[0][game.playPiles[0].length-1]}
                        pileIdx={0}
                        handlePlay={handlePlay}
                    />

                    <PlayPile
                        faceUp={game.status !== "waiting"}
                        topCard={game.playPiles[1][game.playPiles[1].length-1]}
                        pileIdx={1}
                        handlePlay={handlePlay}
                    />

                    <DrawPile count={game.drawPiles[1].length}/>

                    <StuckButton handleStuck={handleStuck}/>
                </div>

                <div className="my-side">
                    <MyHand
                        hand={player.hand}
                        selectedCardIdx={selectedCardIdx}
                        setSelectedCardIdx={setSelectedCardIdx}
                    />

                    <DrawPile
                        count={player.drawPile.length}
                        handleDraw={handleDraw}
                    />
                </div>

            </div>

            {gameOver && (
                <div className="game-over-overlay">

                    <div className="game-over-message">
                        {resultMessage}
                    </div>

                    <button
                        className="return-home-button"
                        onClick={onLeave}
                    >
                        Return Home
                    </button>

                </div>
            )}

        </div>
    )
}