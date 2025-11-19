export default function ImgViewer({ file }: { file: string }) {

    return (
        <pre className="whitespace-pre-wrap max-h-[90vh] md:w-[700px] overflow-y-auto text-sm text-gray-800 bg-white border border-indigo-100 rounded-xl p-4">
            <img src={file} alt="architecture image" className="rounded-lg shadow-sm w-full mb-4 sticky top-0" />

            <ul className="max-h-[80vh] overflow-y-auto pr-2 list-disc list-inside">
                <li>Users upload documents or text through the API.</li>
                <li>The backend API saves the job metadata and pushes the job message to SQS.</li>
                <li>Background workers poll SQS for new jobs and process them as they arrive.</li>
                <li>The worker app extracts, summarizes, and classifies the document content.</li>
                <li>After each stage, the worker writes updates to PostgreSQL and publishes progress to Redis (pub/sub).</li>
                <li>The WebSocket service subscribes to Redis, receives updates in real time, and sends them to the client.</li>
                <li>The user interface shows live status, and finally displays the completed results.</li>
            </ul>

        </pre>
    );
}