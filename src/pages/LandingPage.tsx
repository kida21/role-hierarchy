import { Button, Title, Text, Container, Box } from '@mantine/core';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Hero Section */}
      <Container size="lg" className="flex flex-col items-center justify-center text-center py-12 grow">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M7 21h10M7 9h10m-4 4H11" />
            </svg>
          </div>
          <Title order={1} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Organization Role Manager
          </Title>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
            Build, manage, and visualize your company's hierarchical structure with Ease. 
          </Text>
        </div>

        <Button
          component={Link}
          to="/login"
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Get Started
        </Button>
      </Container>

      {/* Footer */}
      <Box className="py-6 text-center text-gray-500 text-sm border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} Organization Role Manager. All rights reserved.
      </Box>
    </div>
  );
};