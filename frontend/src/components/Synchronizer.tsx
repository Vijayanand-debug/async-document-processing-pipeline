import { useEffect } from "react";
import { useAppStore } from '@/store/store';
import { fetchExistingChunksAndSummary } from '@/app/services/pipelineApi';
import { initializeWsForJob } from '@/lib/wsClient';
import toast from 'react-hot-toast';


export default function Synchronizer() {

    const {
        isProcessingDoc,
        processingJobId,
        wsConnected,
        hasSyncedOnce,
        setSyncFailed,
        appendChunkSummaryOutput,
        setPipelineOutput,
        setProcessingDone,
        setWsConnected,
        setGenerativeAiSection,
        setSyncedOnce,
        setChunkSummaryOutput } = useAppStore();

    useEffect(() => {
        if (hasSyncedOnce) return;

        if (!processingJobId || !isProcessingDoc || wsConnected) return;

        let cancelled = false;
        const run = async () => {

            try {

                const response = await fetchExistingChunksAndSummary(processingJobId);

                if (cancelled) return;

                setSyncedOnce();

                if (response.status === "failed") {
                    setSyncFailed();
                    return;
                }

                setGenerativeAiSection(true);

                if (response.chunks.length) {
                    setChunkSummaryOutput("");
                    response.chunks.map((chunk: any) => appendChunkSummaryOutput(chunk.summary));
                }

                if (response?.current_step < 6 && !wsConnected) {
                    initializeWsForJob(processingJobId);
                    return;
                }

                if (response.final_summary) {
                    setPipelineOutput(response?.final_summary);
                }

                setProcessingDone();
                setWsConnected(false);

            } catch (error) {
                console.error("error fetching pipeline data:", error);
                toast.error("Failed to fetch pipeline data. Please try again later.");
                setSyncFailed();
                setSyncedOnce();
            }

        };

        run();

        return () => {
            cancelled = true;
        };

    }, [processingJobId, isProcessingDoc, wsConnected, hasSyncedOnce]);

    return null;

}