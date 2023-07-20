export default function Create() {
    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">Create a new lobby</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
                <input type="text" placeholder="Lobby name" />
                <button>Create</button>
            </div>
        </main>
    )
}
