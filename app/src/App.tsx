import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import Container from '@mui/material/Container'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@utils/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { AuthPage } from '@components/AuthPage'
import { RequireAuth } from '@components/RequireAuth'
import { GroceryHome } from '@components/GroceryHome'
import { GroceryEntryRoute } from '@components/GroceryEntryRoute'

function App() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <QueryClientProvider client={queryClient}>
        <Container>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route element={<RequireAuth />}>
                <Route path="/" element={<GroceryHome />} />
                <Route path="/grocery/:id" element={<GroceryEntryRoute />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Container>
      </QueryClientProvider>
    </SnackbarProvider>
  )
}

export default App
