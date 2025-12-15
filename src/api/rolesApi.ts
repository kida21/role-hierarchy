import axios from 'axios';
import type { Role, RoleTreeNode } from '../types/role.type';

const api = axios.create({
  baseURL: '/api/v1/roles',
});

export const rolesApi = {
  create: (data: Partial<Role>) => api.post('', data),
  getAll: () => api.get<Role[]>(''),
  getHierarchy: () => api.get<RoleTreeNode[]>('hierarchy'),
  getById: (id: string) => api.get<Role>(`${id}`),
  update: (id: string, data: Partial<Role>) => api.put(`${id}`, data),
  delete: (id: string) => api.delete(`${id}`),
};