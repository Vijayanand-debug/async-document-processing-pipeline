import { useState, useEffect } from "react";

export default function TextViewer({ file }: { file: string }) {
    const [text, setText] = useState("");

    useEffect(() => {
        fetch(file)
            .then(res => res.text())
            .then(setText);
    }, [file]);

    return (
        <pre className="whitespace-pre-wrap max-h-[90vh] md:w-[700px] overflow-y-auto text-sm text-gray-800 bg-white border border-indigo-100 rounded-xl p-4">
            {text}
        </pre>
    );
}