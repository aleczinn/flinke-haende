export default function Loading() {
    return (
        <main className="grow flex flex-col bg-gray-10 min-h-[50svh]">
            <div className="max-w-bt mx-auto w-full px-4 sm:px-6 md:px-8 py-section space-y-4">
                <div className="h-8 w-1/3 bg-gray-20 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-20 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-20 rounded animate-pulse" />
            </div>
        </main>
    )
}
