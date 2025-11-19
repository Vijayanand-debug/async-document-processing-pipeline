import DocViewer from "@/components/DocView";
import ImgViewer from "@/components/ImgViewer";
import PdfView from "@/components/PdfView";
import TextViewer from "@/components/TextViewer";
import { createContext, useContext, useState, type ReactNode } from "react";

type UIContextType = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    handleDocClick: (fileType: string) => void
    renderViewer: () => React.ReactNode;
}


export const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docType, setDocType] = useState<string>('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleDocClick = (fileType: string) => {
        setDocType(fileType);
        openModal();
    };

    const renderViewer = () => {
        switch (docType) {
            case 'pdf':
                return <PdfView />;
            case 'doc':
                return <DocViewer file="/superfluidity.docx" />;
            case 'txt':
                return <TextViewer file="/mapReduce.txt" />;
            case 'img':
                return <ImgViewer file="/arch.png" />;
            default:
                return <div>Unsupported file type</div>;
        }
    }

    return (
        <UIContext.Provider value={{ isModalOpen, openModal, closeModal, handleDocClick, renderViewer }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);

    if (!context) {
        throw new Error("useUI must be used with in UIProvider");
    }

    return context;
}