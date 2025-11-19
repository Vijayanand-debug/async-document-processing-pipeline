import { useState, useEffect } from "react";
import mammoth from "mammoth";

export default function DocViewer({ file }: { file: string }) {
    const [html, setHtml] = useState("");

    const handleLoad = async () => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setHtml(value);
    };

    useEffect(() => {
        if (file) handleLoad();
    }, [file]);

    return (
        <div
            className="border border-indigo-100 bg-white rounded-xl p-4 shadow-inner max-h-[90vh] md:w-[700px]  overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
