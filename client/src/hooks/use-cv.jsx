import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyCvs as apiGetMyCvs,
    deleteCv as apiDeleteCv,
    createCv as apiCreateCv,
    updateCv as apiUpdateCv,
    setPrimaryCv as apiSetPrimaryCv
} from "../api/cv";

import { getMyApplications } from '../api/application'


export const useCv = () => {
    const { isPending, isError, data, error } = useQuery({ queryKey: ['myCvs'], queryFn: apiGetMyCvs })
    if (isError) {
        return { isPending, isError, cv: null, error: `Error fetching CVs: ${error?.response?.data?.error || error.message}` };
    }
    return { isPending, isError, cv: data?.data || null, error };
};

export const useDeleteCv = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation(
        { mutationFn: apiDeleteCv,
            onSuccess: async() => {
                queryClient.invalidateQueries({ queryKey: ['myCvs'] })
            }
         })
    return {...mutation, deleteCv: mutation.mutateAsync, error: mutation.error?.response?.data?.error || mutation.error};
};

export const useUpdateCv = (setError) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(
        { mutationFn: (p)=>apiUpdateCv(p.id, p.data).catch((error) => {setError(error?.response?.data?.error || error.message)}),
            onSuccess: async() => {
                queryClient.invalidateQueries({ queryKey: ['myCvs'] })
            }
         })
    return {...mutation, updateCv: mutation.mutateAsync, error: mutation.error?.response?.data?.error || mutation.error};
};

export const useSetPrimaryCv = (setError) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(
        { mutationFn: (p)=>apiSetPrimaryCv(p.id).catch((error) => {setError(error?.response?.data?.error || error.message)}),
            onSuccess: async() => {
                queryClient.invalidateQueries({ queryKey: ['myCvs'] })
            }
         })
    return {...mutation, setPrimaryCv: mutation.mutateAsync, error: mutation.error?.response?.data?.error || mutation.error};
};


export const useCreateCv = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation(
        { mutationFn: apiCreateCv,
            onSuccess: async() => {
                queryClient.invalidateQueries({ queryKey: ['myCvs'] })
            }
         })
    return {...mutation, createCv: mutation.mutateAsync, error: mutation.error?.response?.data?.error || mutation.error};
};

export function useCvUsage(cvId) {
	return useQuery({
		queryKey: ['cv-usage', cvId],
		queryFn: async () => {
			const response = await getMyApplications()

			return response.data.filter(
				application => application.cv?._id === cvId
			)
		},
		enabled: !!cvId
	})
}

export default useCv;