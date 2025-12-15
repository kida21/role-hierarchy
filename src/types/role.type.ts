export interface Role {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
}

export interface RoleTreeNode {
  id: string;
  name: string;
  description: string;
  children: RoleTreeNode[];
}