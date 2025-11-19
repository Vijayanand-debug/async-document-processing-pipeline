export interface Appstate {
    userId: string | null;
    hasSyncedOnce: boolean;
    currentStep: number;
    failedStep: number;
    isProcessingDoc: boolean;
    processingJobId: string | null;
    wsConnected: boolean;
    setUserId: () => void;
    error: string | null;
    highlight: boolean;
    pipelineOutput: string;
    chunkSummaryOutput: string;
    generativeAiSection: boolean;
    setProcessingStart: (id: string, step: number, output: string, chunks: string, status: boolean) => void;
    setGenerativeAiSection: (status: boolean) => void;
    setProcessingDoc: (status: boolean) => void;
    setProcessingJobId: (id: string) => void;
    setWsConnected: (status: boolean) => void;
    setCurrentStep: (step: number) => void;
    setFailedStep: (step: number) => void;
    setProcessingDone: () => void;
    setSyncedOnce: () => void;
    resetSyncedOnce: () => void;
    setSyncFailed: () => void;
    setPipelineOutput: (text: string) => void;
    setChunkSummaryOutput: (text: string) => void;
    appendPipelineOutput: (text: string) => void;
    appendChunkSummaryOutput: (text: string) => void;
}

export interface SocketCallBacks {
    onOpened?: () => void;
    onClosed?: () => void;
    onError?: (err: Event | Error) => void;
    onProgress?: (data: any) => void;
}
