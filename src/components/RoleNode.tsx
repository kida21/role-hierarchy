import { Button, Text } from '@mantine/core';
import type { RoleTreeNode } from '../types/role.type';

interface RoleNodeProps {
  node: RoleTreeNode;
  level?: number;
  onClick: (node: RoleTreeNode) => void;
}

export const RoleNode = ({ node, level = 0, onClick }: RoleNodeProps) => {
  const indent = level * 24;

  return (
    <>
      <div style={{ paddingLeft: indent, paddingTop: '4px', paddingBottom: '4px' }}>
        <Button
          variant="subtle"
          fullWidth
          justify="left"
          onClick={() => onClick(node)}
        >
          <Text size="sm" fw={500}>
            {node.name}
          </Text>
        </Button>
      </div>
      {node.children.map(child => (
        <RoleNode key={child.id} node={child} level={level + 1} onClick={onClick} />
      ))}
    </>
  );
};