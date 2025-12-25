import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, getCurrentUser, logout as logoutApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data:user, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser,
    retry: false,
    throwOnError: false,
    enabled: typeof window !== 'undefined',
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      navigate('/roles');
    },
  });

  
  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      queryClient.invalidateQueries(); 
      navigate('/login');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};