import { Save, Edit, Add, Logout } from '@mui/icons-material'
import { Card, CardContent, CardHeader, IconButton } from '@mui/material'
import { useState } from 'react'
import GroceryForm from './GroceryForm'
import GroceryList from './GroceryList'

export function GroceryHome() {
  const [openForm, setOpenForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const handleEditClick = () => setIsEditing(v => !v)
  const handleFormOpen = () => setOpenForm(true)

  return (
    <Card sx={{ my: 4 }} variant="outlined">
      <CardHeader
        title="Grocery List"
        action={
          <>
            <IconButton onClick={handleEditClick}>{isEditing ? <Save /> : <Edit />}</IconButton>
            <IconButton onClick={handleFormOpen}>
              <Add />
            </IconButton>
            <Logout />
          </>
        }
      />
      <CardContent>
        <GroceryList isEditing={isEditing} />
        <GroceryForm openForm={openForm} setOpenForm={setOpenForm} />
      </CardContent>
    </Card>
  )
}
