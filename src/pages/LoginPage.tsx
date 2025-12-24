
import { useState } from 'react';
import { Button, TextInput, PasswordInput, Title, Container, Group, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const { login, isLoggingIn, user } = useAuth();
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setError('');
    login(values, {
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      },
    });
  };

  if (user) {
    // Redirect if already logged in
    return <div>Redirecting...</div>;
  }

  return (
    <Container size="xs" className="min-h-screen flex flex-col justify-center">
      <Title order={2} className="mb-6 text-center">Login</Title>

      {error && <Alert color="red" className="mb-4">{error}</Alert>}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          {...form.getInputProps('email')}
          mb="sm"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          mb="lg"
        />
        <Group justify="space-between">
          <Button variant="subtle" component={Link} to="/">
            Back to Home
          </Button>
          <Button type="submit" loading={isLoggingIn}>
            Login
          </Button>
        </Group>
      </form>
    </Container>
  );
};