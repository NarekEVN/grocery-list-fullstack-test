import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@utils/client'
import { login, register, Credentials, AuthResponse } from '@services/auth'

export const useLogin = () => {
  return useMutation<AuthResponse, Error, Credentials>({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
    onSuccess: data => {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      queryClient.setQueryData(['auth', 'me'], data.user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export const useRegister = () => {
  return useMutation<AuthResponse, Error, Credentials>({
    mutationKey: ['auth', 'register'],
    mutationFn: register,
    onSuccess: data => {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      queryClient.setQueryData(['auth', 'me'], data.user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}
