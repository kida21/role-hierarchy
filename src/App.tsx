import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleHierarchyPage } from './pages/RolesHierarchyPages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="light">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleHierarchyPage />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}