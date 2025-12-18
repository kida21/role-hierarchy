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
    <div className="flex flex-col w-full">
      {/* Node Row */}
      <div
        className="flex items-center py-1 px-2 rounded hover:bg-gray-100 relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse Triangle */}
        {hasChildren ? (
          <button
            onClick={toggle}
            className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-800 mr-1 focus:outline-none"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4 h-4 mr-1"></span> // Spacer for alignment
        )}

        {/* Role Name */}
        <span className="text-sm font-medium text-gray-800 truncate">
          {node.name}
        </span>

        {/* Action Icons (appear on hover, right-aligned) */}
        {isHovered && (
          <div className="absolute right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="ml-4 border-l-2 border-gray-200 pl-2 pt-1">
          {node.children.map((child) => (
            <RoleNode
              key={child.id}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};