import { Box, Button, Card, CardContent, CardHeader, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useLogin, useRegister } from 'hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthPage() {
  const [tab, setTab] = useState<number>(0)
  const handleTab = (_e: React.SyntheticEvent, value: number) => setTab(value)
  const { mutateAsync: login, isPending: isLoggingIn, error: loginError } = useLogin()
  const { mutateAsync: register, isPending: isRegistering, error: registerError } = useRegister()

  const navigate = useNavigate()

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await login({ email, password })
    window.dispatchEvent(new Event('auth:changed'))
    navigate('/', { replace: true })
  }

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await register({ email, password })
    window.dispatchEvent(new Event('auth:changed'))
    navigate('/', { replace: true })
  }

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <Card sx={{ my: 4 }} variant="outlined">
      <CardHeader title="Authentication" />
      <CardContent>
        <>
          <Tabs value={tab} onChange={handleTab} aria-label="auth tabs" variant="fullWidth">
            <Tab label={isLoggingIn ? 'Logging in…' : 'Login'} />
            <Tab label={isRegistering ? 'Registering…' : 'Register'} />
          </Tabs>
          <Box sx={{ p: 2 }}>
            {tab === 0 && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Welcome back. Enter your credentials to continue.
                </Typography>
                <Box component="form" onSubmit={signIn} sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      fullWidth
                      required
                    />
                    <Button type="submit" variant="contained" size="large">
                      Sign in
                    </Button>
                  </Stack>
                </Box>
                {loginError && (
                  <Typography variant="caption" color="error">
                    {(loginError as Error)?.message || 'Login failed'}
                  </Typography>
                )}
              </>
            )}
            {tab === 1 && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Create a new account.
                </Typography>
                <Box component="form" onSubmit={signUp} sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      fullWidth
                      required
                    />
                    <Button type="submit" variant="contained" size="large">
                      Create account
                    </Button>
                  </Stack>
                </Box>
                {registerError && (
                  <Typography variant="caption" color="error">
                    {(registerError as Error)?.message || 'Registration failed'}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </>
      </CardContent>
    </Card>
  )
}
