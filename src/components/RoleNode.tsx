import { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import type { RoleTreeNode } from '../types/role.type';

interface RoleNodeProps {
  node: RoleTreeNode;
  onEdit: (node: RoleTreeNode) => void;
  onDelete: (node: RoleTreeNode) => void;
  onAddChild: (id: string, name: string) => void;
}

export const RoleNode = ({ node, onEdit, onDelete, onAddChild }: RoleNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = node.children.length > 0;

  const toggle = () => hasChildren && setIsOpen(!isOpen);

  return (
    <div className="flex flex-col items-center relative">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggle}
      >
        <div className="w-32 h-32 bg-white border-2 border-blue-400 rounded-lg shadow flex items-center justify-center text-center p-2 hover:bg-blue-50 transition">
          <span className="text-sm font-medium text-gray-800">{node.name}</span>
        </div>

        {isHovered && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded p-1 shadow-md border z-10">
            <Tooltip label="Edit">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(node);
                }}
              >
                <IconPencil size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Add Child">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="green"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(node.id, node.name);
                }}
              >
                <IconPlus size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node);
                }}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
      </div>

      {hasChildren && isOpen && (
        <>
          <div className="h-6 w-px bg-gray-400 my-1"></div>
          <div className="flex justify-center">
            <div className="flex gap-6">
              {node.children.map(child => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="h-6 w-px bg-gray-400"></div>
                  <RoleNode
                    node={child}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddChild={onAddChild}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {hasChildren && !isOpen && (
        <button
          onClick={toggle}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
        >
          + Expand
        </button>
      )}
    </div>
  );
};