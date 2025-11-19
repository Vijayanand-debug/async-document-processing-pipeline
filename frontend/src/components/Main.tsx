import type { ReactNode } from "react"

export default function Main({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="w-full md:mt-[80px]">
                <main className="md:p-2 overflow-auto">
                    <div className="h-[85vh] grid grid-cols-1 md:grid-cols-[2fr_2fr_3fr] gap-6 ">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}