import { useAppStore } from '@/store/store';
import { menuItems } from '@/utils/utils';
import { useRef, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import Modal from '@/components/Modal';
import { useUI } from '@/context/UIContext';
import { PipelineService } from '@/app/services/pipelineService';
import toast from 'react-hot-toast';
import { initializeWsForJob } from '@/lib/wsClient';

export default function ControlPanel() {

    const [validationError, setValidationError] = useState<string>('');
    const isProcessingDoc = useAppStore((state) => state.isProcessingDoc);
    const { handleDocClick, renderViewer } = useUI();

    const { setProcessingDoc, setProcessingStart, setSyncedOnce, setFailedStep } = useAppStore();

    const Icon = { ProcessDoc: menuItems.processDoc, Pdf: menuItems.pdf, Word: menuItems.word, Text: menuItems.text };
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const processText = async () => {
        const input = textAreaRef.current?.value.trim();

        if (!input) return;

        let words = input.split(/\s+/).filter(Boolean);

        const wordCount = words.length;

        if (wordCount < 100) {
            setValidationError(`Please enter at least 100 words. Current count: ${wordCount}`);
            return;
        }

        if (wordCount > 2000) {
            words = words.slice(0, 2000);
            const modifiedText = words.join(" ");

            if (textAreaRef.current) {
                textAreaRef.current.value = modifiedText;
            }
        }

        const finalText = words.join(" ");
        textAreaRef.current ? textAreaRef.current.value = '' : '';

        setProcessingDoc(true);
        setFailedStep(-1);

        const result = await PipelineService.startPipeline('customText', finalText);
        if (result.error) {
            toast.error(result.error);
            setProcessingDoc(false);
            return;
        }
        setSyncedOnce();
        setProcessingStart(result.jobId, 2, '', '', true);

        toast.success("Push data to SQS completed");
        initializeWsForJob(result.jobId);
    }

    const processDoc = async (docType: string) => {
        const section = document.getElementById('live-feed-section');

        setTimeout(() => {
            section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2000);

        setProcessingDoc(true);
        setFailedStep(-1);

        const result = await PipelineService.startPipeline(docType);
        if (result.error) {
            toast.error(result.error);
            setProcessingDoc(false);
            return;
        }
        setSyncedOnce();
        setProcessingStart(result.jobId, 2, '', '', true);

        toast.success("Push data to SQS completed");
        initializeWsForJob(result.jobId);
    }

    return (
        <>
            <section className="mt-[80px] md:mt-0 card glass p-8 rounded-2xl shadow-md border border-gray-200/60 bg-white/70 backdrop-blur">

                {isProcessingDoc && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-90 opacity-[0.2]">
                        <Rings
                            height="100"
                            width="100"
                            color="#fff"
                            visible={true}
                        />
                    </div>
                )}

                <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4 flex items-center gap-2">
                    <Icon.ProcessDoc className="text-emerald-600" /> Document Panel
                </h2>
                <p className="text-sm text-gray-700 mb-6">
                    These docs have been pre selected to save you time and at the same time demonstrating the pipeline in action.
                </p>

                <div className="space-y-3 mb-6">
                    {[
                        { icon: <Icon.Pdf size={25} />, title: "Relativity (.pdf)", type: 'pdf' },
                        { icon: <Icon.Word size={25} />, title: "Superfluidity (.docx)", type: 'doc' },
                        { icon: <Icon.Text size={25} />, title: "Map Reduce (.txt)", type: 'txt' },
                    ].map((doc, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl hover:border-emerald-400 transition-all duration-200 shadow-sm bg-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-emerald-600">{doc.icon}</div>
                                <h5 className="font-medium text-gray-800">{doc.title}</h5>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDocClick(doc.type)}
                                    className="bg-gradient-to-r from-emerald-500 to-green-400 text-white p-2.5 rounded-xl hover:opacity-90 transition text-sm font-medium shadow cursor-pointer">
                                    View
                                </button>
                                <button
                                    onClick={() => processDoc(doc.type)}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-2.5 rounded-xl hover:opacity-90 transition text-sm font-medium shadow cursor-pointer">
                                    Process Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Up to 2000 Words Will Be Processed
                    </label>

                    {
                        validationError.length > 0 && (
                            <label className="block text-sm font-medium text-red-700">
                                {validationError}
                            </label>
                        )
                    }

                    <textarea
                        ref={textAreaRef}
                        onInput={() => setValidationError('')}
                        placeholder="Enter or paste your text here..."
                        rows={6}
                        className="w-full border border-emerald-300 p-3 rounded-xl focus:outline-none focus:border-cyan-500 text-sm shadow-inner resize-none"
                    />

                    <button
                        onClick={processText}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2.5 rounded-xl hover:opacity-90 transition text-sm font-medium shadow"
                    >
                        PROCESS TEXT
                    </button>
                </div>


            </section>

            <Modal>{renderViewer()} </Modal>

        </>
    );
}