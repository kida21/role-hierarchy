import { RoleNode } from './RoleNode';
import type { RoleTreeNode } from '../types/role.type';

interface RoleTreeProps {
  tree: RoleTreeNode[];
  onEdit: (node: RoleTreeNode) => void;
  onDelete: (node: RoleTreeNode) => void;
  onAddChild: (parentId: string) => void;
}

export const RoleTree = ({ tree, onEdit, onDelete, onAddChild }: RoleTreeProps) => {
  if (tree.length === 0) {
    return <div className="text-gray-500 text-center py-8">No roles defined.</div>;
  }

  return (
    <div className="flex justify-center py-6 overflow-x-auto">
      <div className="flex gap-8">
        {tree.map(root => (
          <RoleNode
            key={root.id}
            node={root}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
          />
        ))}
      </div>
    </div>
  );
};