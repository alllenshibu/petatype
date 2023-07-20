export default function Join() {
    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">Join a lobby</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
                <input type="text" placeholder="Lobby name" />
                <button>Join</button>
            </div>
        </main>
    )
}
