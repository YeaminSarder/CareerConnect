import { useState } from "react";
import { 
    getMyCvs as apiGetMyCvs, 
    deleteCv as apiDeleteCv,
    createCv as apiCreateCv
} from "../api/cv";
export const useCv = () => {
    const [cv, setCv] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const getMyCvs = async () => {
        try {
            setIsLoading(true)
            const response = await apiGetMyCvs();
            if (!response.data) {
                throw new Error('Failed to fetch CVs');
            }
            const data = response.data;
            setCv(data);
            setIsLoading(false)
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { cv, setCv, error, setError, getMyCvs, isLoading, setIsLoading };
};

export const useDeleteCv = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const deleteCv = async (cvId) => {
        try {
            setIsLoading(true)
            const {data} = await apiDeleteCv(cvId);
            if (!data) {
                throw new Error('Failed to delete CV');
            }
            setIsLoading(false)
        } catch (err) {
            setError(`Error deleting CV: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteCv, error, setError, isLoading, setIsLoading };
};

export const useCreateCv = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const createCv = async (cvData) => {
        try {
            setIsLoading(true)
            const {data} = await apiCreateCv(cvData);
            if (!data) {
                throw new Error('Failed to create CV');
            }
            setIsLoading(false)
        } catch (err) {
            setError(`Error creating CV: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { createCv, error, setError, isLoading, setIsLoading };
};

export default useCv;