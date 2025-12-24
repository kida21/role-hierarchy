
import { Button, Title, Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <Container size="sm" className="flex flex-col items-center justify-center min-h-screen">
      <Title order={1} className="mb-4">Organization Role Manager</Title>
      <Text size="lg" className="mb-8 text-gray-600">
        Manage your company's hierarchical structure with ease.
      </Text>
      <Button component={Link} to="/login" size="lg">
        Login to Get Started
      </Button>
    </Container>
  );
};