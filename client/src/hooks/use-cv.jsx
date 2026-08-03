import { useState } from "react";
import { getMyCvs as apiGetMyCvs } from "../api/cv";
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

export default useCv;