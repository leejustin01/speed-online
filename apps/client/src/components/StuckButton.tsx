import { useEffect, useState } from "react"
import { socket } from "../socket"
import "./StuckButton.css"


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export default function StuckButton({ handleStuck }: { handleStuck: () => void }) {
    const [ on, setOn ] = useState(true)

    useEffect(() => {
        socket.on("countdown_1", async () => {
            await delay(1000)
            setOn(true)
        })

        return () => {
            socket.off("countdown_1")
        }
    }, [])

    
    return (
        <>
            <button 
                className={`stuck-button ${!on? "disabled" : ""}`}
                disabled={!on} 
                onClick={() => {
                    handleStuck()
                    setOn(false)
                }
            }>
                Stuck?
            </button>
        </>
    )
}