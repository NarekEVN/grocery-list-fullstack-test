import { useParams, useNavigate } from 'react-router-dom'
import GroceryEntryView from './GroceryEntryView'

export function GroceryEntryRoute() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return null

  return <GroceryEntryView id={id} onDeleted={() => navigate('/')} />
}
