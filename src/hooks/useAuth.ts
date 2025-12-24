import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, getCurrentUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

 
  const {  data: user, isLoading } = useQuery({
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

  const logout = () => {
   queryClient.setQueryData(['authUser'], null);
    navigate('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};