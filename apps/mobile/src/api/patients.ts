import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "./client";

import { ApiResponse, Patient, CreatePatientRequest } from "@hbridge/shared";
import { all } from "axios";

export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...patientKeys.lists(), filters ?? {}] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
};

// list patients by the current user role

export function usePatients(){
    return useQuery({
        queryKey: patientKeys.lists(),
        queryFn: async () =>{
            const response = await apiClient.get<ApiResponse<Patient[]>>
            ('/patients');
            return response.data.data;
        },
        staleTime:30_000,
        retry:1,
    });
}

// single patient record

export default function usePatient(id: string | undefined){
    return useQuery({
        queryKey:patientKeys.detail(id ?? ''),
        queryFn: async () =>{
            const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`,

            );
            return response.data.data;
        },
        enabled: !!id,
        staleTime: 30_000,
        retry:1,
    });
}

// create a new patient mutation

export  function useCreatePatient(){
   const query = useQueryClient();
   return useMutation({
    mutationFn: async (data: CreatePatientRequest) =>{
        const response = await apiClient.post<ApiResponse<Patient>>
        ('/patients', data,);
        return response.data.data;
    },
    onSuccess: (patient) =>{
        // Invalidate the list so it refetches with the new patient
      query.invalidateQueries({ queryKey: patientKeys.lists() });

      // Pre-seed the detail cache so navigating is instant
      query.setQueryData(patientKeys.detail(patient.id), patient);
    },
   });
}

// update patient
 
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePatientRequest>;
    }) => {
      const response = await apiClient.patch<ApiResponse<Patient>>(
        `/patients/${id}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (patient) => {
      // Refresh the list
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      // Update the specific detail cache
      queryClient.setQueryData(patientKeys.detail(patient.id), patient);
    },
  });
}