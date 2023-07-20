import { useRouter } from 'next/router'

export default function Lobby() {

    const router = useRouter()

    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">We at lobby {router.query.id}</p>
            </div>
        </main>
    )
}
