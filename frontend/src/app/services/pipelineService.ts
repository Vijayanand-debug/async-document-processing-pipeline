import { useAppStore } from "@/store/store";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const store = useAppStore.getState();

export const PipelineService = {
    async startPipeline(docType: string, customText = "") {
        try {

            const formData = new FormData();
            const user_id = store.userId;
            formData.append("user_id", user_id || '1');

            let response;

            if (docType === "customText") {
                formData.append("text", customText);

                response = await fetch(`${apiUrl}/process`, {
                    method: "POST",
                    body: formData,
                });
            } else {
                const fileMap: Record<string, string> = {
                    pdf: "/rel.pdf",
                    doc: "/superfluidity.docx",
                    txt: "/mapReduce.txt",
                };

                const filePath = fileMap[docType];
                const fileRes = await fetch(filePath);
                const blob = await fileRes.blob();

                formData.append("file", blob, filePath.split("/").pop());
                formData.append("file_type", docType);

                response = await fetch(`${apiUrl}/process`, {
                    method: "POST",
                    body: formData,
                });
            }

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            return {
                jobId: data.job_id,
                currentStep: data.current_step
            };

        } catch (e: any) {
            return { error: e.message };
        }
    }
}