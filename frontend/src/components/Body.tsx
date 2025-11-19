import type { ReactNode } from "react";

export default function Body({ children }: { children: ReactNode }) {
    return (

        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen flex flex-col items-center justify-start">

            {children}
        </div>

    );
}


