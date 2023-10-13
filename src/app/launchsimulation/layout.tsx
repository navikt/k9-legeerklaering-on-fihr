
export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="mx-auto mt-2 max-w-4xl p-4">
            <h1>Launch simulation</h1>
            {children}
        </div>
    )
}