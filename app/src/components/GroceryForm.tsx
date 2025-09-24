import { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'

import { useCreateGrocery } from 'hooks/useGrocery'
import { useSnackbar } from 'notistack'

const GroceryForm: FC<{ openForm: boolean; setOpenForm: (openForm: boolean) => void }> = ({
  openForm,
  setOpenForm,
}) => {
  const { handleSubmit, control, reset } = useForm<GroceryFormItem>()
  const { mutateAsync: createGroceryItem } = useCreateGrocery()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    reset({
      name: '',
      quantity: 0,
      priority: 1,
    })
  }, [openForm, reset])

  const handleFormClose = () => {
    setOpenForm(false)
  }

  const onSubmit = async (data: GroceryFormItem) => {
    try {
      await createGroceryItem(data)
      enqueueSnackbar('Item created successfully', { variant: 'success' })
      setOpenForm(false)
      reset()
    } catch {
      enqueueSnackbar('Failed to create item', { variant: 'error' })
    }
  }

  return (
    <Dialog open={openForm} onClose={handleFormClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} autoFocus margin="dense" label="Name" fullWidth />}
          />
          <Controller
            name="quantity"
            control={control}
            defaultValue={0}
            render={({ field }) => <TextField {...field} margin="dense" label="Quantity" fullWidth />}
          />
          <Controller
            name="priority"
            control={control}
            defaultValue={1 as 1 | 2 | 3 | 4 | 5}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                margin="dense"
                label="Priority"
                fullWidth
                onChange={e => field.onChange(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              >
                {[1, 2, 3, 4, 5].map(p => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <DialogActions>
            <Button onMouseDown={handleFormClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default GroceryForm
