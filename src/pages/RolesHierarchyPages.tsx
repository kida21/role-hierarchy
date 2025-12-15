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
} from '@mantine/core';
import { RoleForm } from '../components/RoleForm';
import { RoleTree } from '../components/RoleTree';
import { useRoleHierarchy, useDeleteRole } from '../hooks/useRoleTree';
import { rolesApi } from '../api/rolesApi';
import type { Role, RoleTreeNode } from '../types/role.type';
import { useQuery } from '@tanstack/react-query';

export const RoleHierarchyPage = () => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteModal, setDeleteModal] = useState<Role | null>(null);

  const { data: tree = [], isLoading } = useRoleHierarchy();
  const deleteMutation = useDeleteRole();

  // Fetch flat list for dropdown
  const { data: allRoles = [] } = useQuery({
    queryKey: ['allRoles'],
    queryFn: () => rolesApi.getAll().then(res => res.data),
  });

  const handleNodeClick = async (node: RoleTreeNode) => {
    const role = await rolesApi.getById(node.id).then(res => res.data);
    setEditingRole(role);
  };

  const handleDelete = () => {
    if (deleteModal) {
      deleteMutation.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal(null),
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title order={2} mb="lg">Organization Role Hierarchy</Title>

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
            <Title order={3} mb="sm">Hierarchy Tree</Title>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <RoleTree
                tree={tree}
                onNodeClick={handleNodeClick}
              />
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete role "{deleteModal?.name}"?</Text>
        <Text size="sm" c="dimmed" mt="xs">
          All sub-roles will be moved up one level.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      {/* Optional: Edit in modal (if preferred) */}
      {editingRole && (
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
              onClick={() => setDeleteModal(editingRole)}
            >
              Delete Role
            </Button>
            <Button onClick={() => setEditingRole(null)}>Close</Button>
          </Group>
        </Modal>
      )}
    </div>
  );
};