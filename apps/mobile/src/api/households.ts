import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ApiResponse } from "@hbridge/shared";

export interface Household {
    id: string;
    village:string;
    headName:string;
    headId:string|null;
    createdAt: string;
    _count?:{
        individuals:number;
    };
    chw?: {
        id:string;
        firstName:string;
        lastName:string;
    };

}

export const householdKeys ={
    all: ['households'] as const,
    lists: () => [...householdKeys.all, 'list'] as const,
    head: (headId: string) =>[...householdKeys.all,'head',headId] as const,
};

// fetch current logged in chw households

export function useHouseholds(){
    return useQuery({
        queryKey:householdKeys.lists(),
        queryFn: async () =>{
            const response = await apiClient.get<ApiResponse<Household[]>>('/households');
            return response.data.data;
        },
        staleTime:30_000,
    });
}
// get single household by head Id

export function useHouseholdByHeadId(headId:string | undefined){

    return useQuery({
        queryKey:householdKeys.head(headId ?? ''),
        queryFn: async () =>{
            const response = await apiClient.get<ApiResponse<Household>>
            (`/households/head/${headId}`,);
            return response.data.data;
        },
        enabled: !!headId && headId.length > 5,

        retry:false,
    });
}
