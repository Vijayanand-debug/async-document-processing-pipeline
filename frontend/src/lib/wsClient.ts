import { useAppStore } from "@/store/store";
import type { SocketCallBacks } from "@/types/types";
import toast from 'react-hot-toast';
import { fetchChunk, fetchSummary } from "@/app/services/pipelineApi";

const WebSocketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
const store = useAppStore.getState();

export function connectPipelineWs(jobId: string, callbacks: SocketCallBacks) {
    const { onOpened, onClosed, onError, onProgress } = callbacks;
    const ws = new WebSocket(`${WebSocketUrl}${jobId}`);

    ws.onopen = () => onOpened?.();
    ws.onclose = () => onClosed?.();
    ws.onerror = (err) => onError?.(err);

    ws.onmessage = (message) => {
        try {
            const data = JSON.parse(message.data);
            onProgress?.(data);
        } catch (error) {
            console.error("websocket error", error);
        }
    };

    return ws;
}

export const initializeWsForJob = (jobId: string) => {

    let ws: WebSocket;

    ws = connectPipelineWs(jobId, {

        onOpened: () => {
            store.setWsConnected(true);
            toast.success("WebSocket connected");
        },

        onClosed: () => {
            store.setWsConnected(false);
            toast("WebSocket closed");
        },

        onError: (err) => {
            store.setWsConnected(false);
            toast.error("WebSocket error");
            console.error(err);
        },

        onProgress: async (data) => {
            store.setCurrentStep(data.current_step);

            if (data.current_step === 4) {
                toast.success("Extracting text from the document...");
            }

            if (data?.status === 'llm_processing') {
                toast.success("Analyzing content with LLM...");
            }

            if (data.status === "summarized_chunk") {
                const chunk = await fetchChunk(data.job_id, data.extra);
                store.appendChunkSummaryOutput(chunk);
            }

            if (data.status === "final_summary") {
                const summary = await fetchSummary(data.job_id);
                store.appendPipelineOutput(summary);
            }

            if (data.status === "error") {
                store.setFailedStep(data.current_step - 1);
                toast.error("Pipeline failed");
                store.setProcessingDoc(false);
                store.setProcessingDone();
            }

            if (data.current_step === 6) {
                toast.success("Pipeline complete");
                store.setProcessingDoc(false);
                store.setProcessingDone();
                ws.close();
                return;
            }
        }
    });

    return ws;
};