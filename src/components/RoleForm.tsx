import {
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  
  type ComboboxItem,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Role } from '../types/role.type';
import { useCreateRole, useUpdateRole } from '../hooks/useRoleTree';


const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  editingRole?: Role;
  onCloseEdit?: () => void;
  allRoles: Role[];
}

export const RoleForm = ({ editingRole, onCloseEdit, allRoles }: RoleFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: editingRole?.name || '',
      description: editingRole?.description || '',
      parentId: editingRole?.parentId || null,
    },
  });

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();

  const onSubmit = (data: RoleFormValues) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      parentId: data.parentId === 'null' ? null : data.parentId || null,
    };

    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data: payload });
      onCloseEdit?.();
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          reset({ name: '', description: '', parentId: null });
        },
      });
    }
  };

  
  const parentOptions: ComboboxItem[] = [
    { value: 'null', label: 'None (Root)' },
    ...allRoles
      .filter((r) => r.id !== editingRole?.id) // prevent self as parent
      .map((r) => ({ value: r.id, label: r.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Name"
            placeholder="e.g. CEO"
            {...field}
            error={errors.name?.message}
            mb="sm"
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Description"
            placeholder="Optional description"
            {...field}
            mb="sm"
          />
        )}
      />

      <Controller
        name="parentId"
        control={control}
        render={({ field: { value, onChange, ...fieldRest } }) => (
          <Select
            label="Parent Role"
            placeholder="Select parent"
            data={parentOptions}
            value={value ?? 'null'}
            onChange={(val) => onChange(val === 'null' ? null : val)}
            mb="sm"
            {...fieldRest}
          />
        )}
      />

      <Group justify="flex-end">
        <Button
          type="submit"
          loading={createMutation.isPending || updateMutation.isPending}
        >
          {editingRole ? 'Update Role' : 'Create Role'}
        </Button>
      </Group>
    </form>
  );
};