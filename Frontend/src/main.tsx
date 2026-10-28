import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { ReservationCartProvider } from './context/ReservationCartContext.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
        <ReservationCartProvider>
          <App />
        </ReservationCartProvider>
      </AuthProvider>
    </Router>
    </QueryClientProvider>
  </StrictMode>,
)
