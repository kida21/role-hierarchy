import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';


import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Alert, 
  Paper 
} from '@mantine/core';

interface LoginFormInputs {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    setError(null);
    login(data, {
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Paper
        shadow="xl"
        p="xl"
        radius="md"
        className="w-full max-w-md bg-white border border-gray-200"
        withBorder
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <Title order={2} className="text-2xl font-bold text-gray-900">
            Welcome Back
          </Title>
          <Text size="sm" className="text-gray-600 mt-1">
            Enter your credentials to access your account
          </Text>
        </div>

        {error && (
          <Alert 
            color="red" 
            className="mb-6" 
            withCloseButton 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <TextInput
            label="Email"
            placeholder="you@company.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
            size="md"
          />

          
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
            size="md"
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            loading={isLoggingIn}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md shadow-sm hover:shadow transition"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </Paper>
    </div>
  );
};