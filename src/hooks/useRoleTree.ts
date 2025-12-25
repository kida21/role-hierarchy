import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/rolesApi';
import type { Role, RoleTreeNode } from '../types/role.type';

export const useRoleHierarchy = () => {
  return useQuery<RoleTreeNode[]>({
    queryKey: ['roleHierarchy'],
    queryFn: () => rolesApi.getHierarchy().then(res => res.data),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Role,
    Error & { response?: { data?: { message?: string; statusCode: number } } },
    Partial<Role>
  >({
    mutationFn: (data) => rolesApi.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleHierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['allRoles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Role,
    Error & { response?: { data?: { message?: string; statusCode: number } } },
    { id: string; data: Partial<Role> }
  >({
    mutationFn: ({ id, data }) => rolesApi.update(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleHierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['allRoles'] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rolesApi.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleHierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['allRoles'] });
    },
  });
};