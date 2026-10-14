import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./client";
import { useAuthStore } from "../stores/auth";

import type { ApiResponse,LoginRequest, LoginResponse, VerifyOtpRequest,VerifyOtpResponse, AuthUser } from "@hbridge/shared";

// send login request to the server using phone and password

export function useLogin() {
    // we use the useMutation hook from react-query to handle the login request
    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await apiClient.post<ApiResponse<LoginResponse>>
            ('/auth/login', data);
            return response.data.data;
        }
    });

}

// we send the OTP verification request to the server using tempToken and code

export function useVerifyOtp(){
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation({
        mutationFn: async (data: VerifyOtpRequest) =>{
            const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
                '/auth/verify-otp', data
            );
            return response.data.data;
        },
        onSuccess: async (data) =>{
            // we save user session data in zustand and secure store
            await setSession({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            });
        },
    });
}