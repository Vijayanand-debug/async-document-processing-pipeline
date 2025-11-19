import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Appstate } from '@/types/types';

function getUserId() {
    return `user_${Math.floor(Math.random() * 10000)}`;
}

function setDocProcessingStatus() {
    let currStatus = JSON.parse(localStorage.getItem('app-store') || '{}')?.state?.isProcessingDoc ? true : false;
    return currStatus;
}

function setProcessingJobId() {
    let processingJobId = JSON.parse(localStorage.getItem('app-store') || '{}')?.state?.processingJobId ?? null;
    return processingJobId;
}

export const useAppStore = create<Appstate>()(
    persist(
        (set, get) => ({
            userId: '',
            hasSyncedOnce: false,
            currentStep: 0,
            failedStep: -1,
            isProcessingDoc: setDocProcessingStatus(),
            processingJobId: setProcessingJobId(),
            wsConnected: false,
            setUserId: () => {
                set({ userId: JSON.parse(localStorage.getItem('app-store') || '{}')?.state?.userId ?? getUserId() });
            },
            error: null,
            highlight: false,
            pipelineOutput: '',
            chunkSummaryOutput: '',
            generativeAiSection: false,
            setProcessingStart: (id: string, step: number, output: string, chunks: string, status: boolean) => set(
                {
                    processingJobId: id,
                    currentStep: step,
                    pipelineOutput: output,
                    chunkSummaryOutput: chunks,
                    generativeAiSection: status
                }
            ),
            setGenerativeAiSection: (status: boolean) => set({ generativeAiSection: status }),
            setProcessingDoc: (status: boolean) => set({ isProcessingDoc: status }),
            setProcessingJobId: (id: string) => set({ processingJobId: id }),
            setWsConnected: (status: boolean) => set({ wsConnected: status }),
            setCurrentStep: (step: number) => set({ currentStep: step }),
            setFailedStep: (step: number) => set({ failedStep: step }),
            setProcessingDone: () => set({ isProcessingDoc: false, processingJobId: null }),
            setSyncedOnce: () => set({ hasSyncedOnce: true }),
            resetSyncedOnce: () => set({ hasSyncedOnce: false }),
            setSyncFailed: () => set({ processingJobId: null, isProcessingDoc: false, wsConnected: false }),
            setPipelineOutput: (text: string) => {
                set({ pipelineOutput: text });
            },
            setChunkSummaryOutput: (text: string) => {
                set({ chunkSummaryOutput: text });
            },
            appendPipelineOutput: (text: string) => {
                set((state) => ({
                    pipelineOutput: state.pipelineOutput + text
                }));
            },
            appendChunkSummaryOutput: (text: string) => set((state) => ({ chunkSummaryOutput: state.chunkSummaryOutput + text }))

        }),
        {
            name: 'app-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state: Appstate) => (
                {
                    userId: state.userId,
                    isProcessingDoc: state.isProcessingDoc,
                    processingJobId: state.processingJobId
                }
            ),
        },
    ),
);