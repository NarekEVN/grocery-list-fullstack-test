import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

export function RequireAuth() {
  const [hasToken, setHasToken] = useState<boolean>(() => !!localStorage.getItem('token'))

  useEffect(() => {
    const update = () => setHasToken(!!localStorage.getItem('token'))
    window.addEventListener('auth:changed', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('auth:changed', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  return hasToken ? <Outlet /> : <Navigate to="/login" replace />
}
