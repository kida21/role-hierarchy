import { useState } from 'react';
import {
  Card,
  Grid,
  Title,
  Button,
  Modal,
  Group,
  Text,
  Divider,
  Stack,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { RoleForm } from '../components/RoleForm';
import { RoleTree } from '../components/RoleTree';
import { useRoleHierarchy, useDeleteRole } from '../hooks/useRoleTree';
import { rolesApi } from '../api/rolesApi';
import type { Role, RoleTreeNode } from '../types/role.type';

export const RoleHierarchyPage = () => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  
  const { data: treeData = [], isLoading: loadingTree } = useRoleHierarchy();

  
  const { data: allRolesData, isLoading: loadingAll } = useQuery({
    queryKey: ['allRoles'],
    queryFn: () => rolesApi.getAll().then(res => res.data),
  });

  const allRoles = Array.isArray(allRolesData) ? allRolesData : [];

  const deleteMutation = useDeleteRole();

  const handleNodeClick = async (node: RoleTreeNode) => {
    try {
      const response = await rolesApi.getById(node.id);
      setEditingRole(response.data);
    } catch (err) {
      console.error('Failed to fetch role:', err);
    }
  };

  const handleDeleteClick = (role: Role) => {
    setEditingRole(null); 
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setRoleToDelete(null);
        },
      });
    }
  };

  if (loadingTree || loadingAll) {
    return (
      <div className="p-6">
        <Text>Loading organization structure...</Text>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title order={2} mb="lg">
        Organization Role Hierarchy
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder>
            <RoleForm
              editingRole={editingRole}
              onCloseEdit={() => setEditingRole(null)}
              allRoles={allRoles}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder>
            <Title order={3} mb="sm">
              Hierarchy Tree
            </Title>
            <RoleTree tree={treeData} onNodeClick={handleNodeClick} />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Edit Role Modal */}
      <Modal
        opened={!!editingRole}
        onClose={() => setEditingRole(null)}
        title="Edit Role"
        size="lg"
      >
        <RoleForm
          editingRole={editingRole}
          onCloseEdit={() => setEditingRole(null)}
          allRoles={allRoles}
        />
        <Divider my="sm" />
        <Group justify="space-between">
          <Button
            color="red"
            onClick={() => editingRole && handleDeleteClick(editingRole)}
          >
            Delete Role
          </Button>
          <Button onClick={() => setEditingRole(null)}>Close</Button>
        </Group>
      </Modal>

      {/* Delete Confirmation Modal — shown separately, not nested */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        centered
      >
        <Stack>
          {roleToDelete && (
            <Text>
              Are you sure you want to delete role <strong>"{roleToDelete.name}"</strong>?
            </Text>
          )}
          <Text size="sm" c="dimmed">
            All sub-roles will be moved up one level.
          </Text>
        </Stack>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};