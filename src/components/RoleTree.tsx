import { Stack } from '@mantine/core';
import type { RoleTreeNode } from '../types/role.type';
import { RoleNode } from './RoleNode';

interface RoleTreeProps {
  tree: RoleTreeNode[];
  onNodeClick: (node: RoleTreeNode) => void;
}

export const RoleTree = ({ tree, onNodeClick }: RoleTreeProps) => {
  return (
    <Stack gap="xs">
      {tree.map(root => (
        <RoleNode key={root.id} node={root} onClick={onNodeClick} />
      ))}
    </Stack>
  );
};