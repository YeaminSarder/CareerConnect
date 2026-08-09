import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getMyApplications,
    getRecruiterApplications,
    updateApplicationStatus,
} from "../api/application";

export function useMyApplications() {
    return useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            const response = await getMyApplications();
            return response.data;
        },
        refetchInterval: 10000,
        refetchIntervalInBackground: false
    });
}

export function useUpdateApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) =>
            updateApplicationStatus(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"],
            });
        },
    });
}

export function useInvalidateMyApplications() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({
            queryKey: ["applications"],
        });
    };
}