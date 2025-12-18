import { RoleNode } from './RoleNode';
import type { RoleTreeNode } from '../types/role.type';

interface RoleTreeProps {
  tree: RoleTreeNode[];
  onEdit: (node: RoleTreeNode) => void;
  onDelete: (node: RoleTreeNode) => void;
  onAddChild: (id: string, name: string) => void;
}

export const RoleTree = ({ tree, onEdit, onDelete, onAddChild }: RoleTreeProps) => {
  if (tree.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4 text-center">
        No roles defined.
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      {tree.map((root) => (
        <RoleNode
          key={root.id}
          node={root}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
};