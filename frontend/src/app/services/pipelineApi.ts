import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchChunk = async (jobId: string, chunkIndex: number) => {
    const url = `${apiUrl}/jobs/${jobId}/chunks/${chunkIndex}`;

    const response = await fetch(`${url}`);

    if (!response.ok) {
        toast.error('something went wrong! please try again later', { duration: 2000 });
        throw new Error(`Server responded with ${response.status}`);
    }
    const data = await response.json();
    return data?.summary;
}


export const fetchSummary = async (jobId: string) => {
    const url = `${apiUrl}/jobs/${jobId}/summary`;
    const response = await fetch(`${url}`);

    if (!response.ok) {
        toast.error('something went wrong! please try again later', { duration: 2000 });
        throw new Error(`Server responded with ${response.status}`);
    }
    const data = await response.json();
    return data?.final_summary;
}

export const fetchExistingChunksAndSummary = async (jobId: string) => {

    const url = `${apiUrl}/jobs/${jobId}/complete_job_data`;
    const response = await fetch(`${url}`);

    if (!response.ok) {
        toast.error('something went wrong! please try again later', { duration: 2000 });
        throw new Error(`Server responded with ${response.status}`);
    }
    const data = await response.json();
    return data;
}