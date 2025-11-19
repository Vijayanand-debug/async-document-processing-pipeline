import { menuItems } from '@/utils/utils';
import { useAppStore } from '@/store/store';
import { useEffect, useState } from 'react';
import '../../styles/app.css';

export default function GenerativeAISection() {
    const highlight = useAppStore((state) => state.highlight);
    const pipelineOutput = useAppStore((state) => state.pipelineOutput);
    const isGenerativeAiSection = useAppStore((state) => state.generativeAiSection);
    const Icon = { GenAIContent: menuItems.geniAIcontent, Instructions: menuItems.instructions };
    const chunkHtml = useAppStore((state) => state.chunkSummaryOutput);
    const [showChunks, setShowChunks] = useState(true);

    useEffect(() => {
        const container = document.getElementById("gen-ai-content");
        if (!container) return;

        requestAnimationFrame(() => {
            container.scrollIntoView({ behavior: "smooth", block: "end" });
        });

    }, [pipelineOutput]);

    useEffect(() => {
        const container = document.getElementById("thinking-text");
        if (!container) return;

        requestAnimationFrame(() => {
            const lastPara = container.querySelector("p:last-child");
            if (lastPara) lastPara.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }, [chunkHtml]);

    return (
        <>
            <section id="gen-ai-section" className={`card glass p-6 rounded-2xl shadow-md transition-all duration-700 ring-0 ${highlight
                ? 'ring-4 ring-cyan-400/70 shadow-cyan-200/50 scale-[1.01]'
                : 'ring-0'
                }`}>

                {
                    isGenerativeAiSection ?
                        (<h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4 flex items-center gap-2">
                            <Icon.GenAIContent className="text-emerald-600" /> Generative AI Response
                        </h2>) :
                        (<h2 className="text-xl font-semibold text-gray-900 mt-2 mb-4 flex items-center gap-2">
                            <Icon.Instructions className="text-emerald-600" /> Why Document Sizes Are Limited in This Demo.
                        </h2>)
                }

                <div className="output relative border border-emerald-100 bg-white backdrop-blur-sm rounded-xl p-4 min-h-[550px] max-h-[550px] overflow-y-auto text-gray-800 text-sm scrollbar-hide">

                    {
                        chunkHtml.length > 0 && (
                            <button
                                onClick={() => setShowChunks(!showChunks)}
                                className="mb-3 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                            >
                                {showChunks ? "Hide Chunk Summaries" : "Show Chunk Summaries"}
                            </button>
                        )
                    }

                    {
                        !isGenerativeAiSection && (
                            <section className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm text-gray-700 leading-relaxed">
                                <ul className="list-disc pl-5 space-y-1 text-base">
                                    <li>
                                        Recruiters usually spend <strong> less than 60 seconds </strong>reviewing a portfolio project.
                                        Large file uploads can slow down the demo experience without adding any real value.
                                    </li>

                                    <li>
                                        By using smaller documents, the processing pipeline runs faster, keeping the focus on the architecture and engineering behind the project.
                                    </li>

                                    <li>
                                        The goal of this project is to demonstrate the full async pipeline workflow:
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                            <li>Async task processing with <strong>FastAPI, AWS SQS, Redis, and FastAPI Websocket.</strong></li>
                                            <li>Chunk based summarization with an <strong>LLM</strong></li>
                                            <li>Live <strong>WebSocket</strong> progress updates</li>
                                            <li>Multi step pipeline management</li>
                                            <li>Frontend state management</li>
                                        </ul>
                                    </li>

                                    <li>
                                        Large documents consume a lot of <strong>LLM tokens</strong>, making inference much <strong> more expensive</strong>.
                                    </li>

                                    <li>
                                        While this backend can handle large documents, for real world applications, text extraction should be done page by page (or section by section) and be stored in S3 or a similar service, rather than keeping all the extracted text in memory.
                                    </li>
                                </ul>
                            </section>
                        )
                    }


                    <div
                        id="thinking-text"
                        className={`thinking-text transition-all duration-300 ease-in-out ${showChunks ? "block max-h-[250px] opacity-100" : "hidden"} overflow-y-auto scrollbar-hide`}
                        dangerouslySetInnerHTML={{ __html: chunkHtml }}
                    />
                    <div
                        id="gen-ai-content"
                        className="mt-5 ml-5"
                        dangerouslySetInnerHTML={{ __html: pipelineOutput }}
                    />
                </div>

            </section>
        </>
    );
}