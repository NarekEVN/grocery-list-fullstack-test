import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={() => {
        localStorage.clear()
        navigate('/login')
      }}
    >
      Logout
    </Button>
  )
}

export default Logout
