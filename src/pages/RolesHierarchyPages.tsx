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
  Box,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { RoleForm } from '../components/RoleForm';
import { RoleTree } from '../components/RoleTree';
import { useRoleHierarchy, useDeleteRole } from '../hooks/useRoleTree';
import { rolesApi } from '../api/rolesApi';
import type { Role, RoleTreeNode } from '../types/role.type';
import { useAuth } from '../hooks/useAuth'; 

type ModalType = 'edit' | 'delete' | 'addChild' | null;

export const RoleHierarchyPage = () => {
  const { logout } = useAuth(); 

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [addChildTo, setAddChildTo] = useState<{ id: string; name: string } | null>(null);

  const {
    data: tree = [],
    isLoading: loadingTree,
  } = useRoleHierarchy();

  const {
    data: allRoles = [],
    isLoading: loadingAll,
  } = useQuery<Role[]>({
    queryKey: ['allRoles'],
    queryFn: () => rolesApi.getAll().then(res => res.data),
  });

  const deleteMutation = useDeleteRole();

  const handleEdit = async (node: RoleTreeNode) => {
    const res = await rolesApi.getById(node.id);
    setSelectedRole(res.data);
    setActiveModal('edit');
  };

  const handleDelete = (node: RoleTreeNode) => {
    setRoleToDelete({ id: node.id, name: node.name });
    setActiveModal('delete');
  };

  const handleAddChild = (id: string, name: string) => {
    setAddChildTo({ id, name });
    setActiveModal('addChild');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRole(null);
    setRoleToDelete(null);
    setAddChildTo(null);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete.id, {
        onSuccess: closeModal,
      });
    }
  };

  if (loadingTree || loadingAll) {
    return <Text className="p-6">Loading organization structure...</Text>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with Title and Logout */}
      <Box className="flex justify-between items-center mb-6">
        <Title order={2}>Organization Role Hierarchy</Title>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder>
            <RoleForm
              editingRole={selectedRole}
              onCloseEdit={closeModal}
              allRoles={allRoles}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder>
            <Title order={3} mb="sm">Hierarchy Tree</Title>
            <div className="overflow-x-auto pb-4">
              <RoleTree
                tree={tree}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
              />
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Edit Modal */}
      <Modal opened={activeModal === 'edit'} onClose={closeModal} title="Edit Role" size="lg">
        {selectedRole && (
          <RoleForm
            editingRole={selectedRole}
            onCloseEdit={closeModal}
            allRoles={allRoles}
          />
        )}
        <Divider my="sm" />
        <Group justify="space-between">
          <Button
            color="red"
            onClick={() => {
              if (selectedRole) {
                setRoleToDelete({ id: selectedRole.id, name: selectedRole.name });
                setActiveModal('delete');
                setSelectedRole(null);
              }
            }}
          >
            Delete Role
          </Button>
          <Button onClick={closeModal}>Close</Button>
        </Group>
      </Modal>

      {/* Add Child Modal */}
      <Modal
        opened={activeModal === 'addChild'}
        onClose={closeModal}
        title={`Add Child to "${addChildTo?.name}"`}
        size="lg"
      >
        {addChildTo && (
          <RoleForm
            editingRole={null}
            onCloseEdit={closeModal}
            allRoles={allRoles}
            parentIdOverride={addChildTo.id}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={activeModal === 'delete'}
        onClose={closeModal}
        title="Confirm Deletion"
        centered
      >
        <Stack>
          {roleToDelete && (
            <Text>
              Delete role <strong>"{roleToDelete.name}"</strong>?<br />
              Its children will be moved up one level.
            </Text>
          )}
        </Stack>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleteMutation.isPending}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};