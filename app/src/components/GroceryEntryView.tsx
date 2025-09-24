import { FC, useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material'
import { ArrowBack, CheckCircle, Delete, RemoveShoppingCart } from '@mui/icons-material'
import { queryClient } from '@utils/client'
import { useDeleteGrocery, useGrocery, useGroceryHistory, useUpdateGrocery } from 'hooks/useGrocery'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const GroceryEntryView: FC<{ id: string; onDeleted?: () => void }> = ({ id, onDeleted }) => {
  const { data: item, isLoading, isError, error } = useGrocery(id)
  const { data: history, isLoading: histLoading } = useGroceryHistory(id)
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateGrocery()
  const { mutateAsync: deleteMut, isPending: deleting } = useDeleteGrocery()
  const [ask, setAsk] = useState(false)

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  if (isLoading) return <CircularProgress size={24} />
  if (isError) return <Typography color="error">{(error as Error)?.message || 'Failed to load item'}</Typography>
  if (!item) return <Typography color="text.secondary">Not found</Typography>

  const flip = async () => {
    const nextStatus = item.status === 'HAVE' ? 'RANOUT' : 'HAVE'

    queryClient.setQueryData<GroceryItem>(['grocery', item.id], { ...item, status: nextStatus })

    try {
      await updateItem({ item: { ...item, status: nextStatus } })

      queryClient.setQueryData<GroceryItem[] | undefined>(['groceryList'], prev =>
        prev?.map(i => (i.id === item.id ? { ...i, status: nextStatus } : i)),
      )
      queryClient.invalidateQueries({ queryKey: ['groceryHistory', item.id] })
      enqueueSnackbar(`Status set to ${nextStatus === 'HAVE' ? 'Have' : 'Ran out'}`, { variant: 'success' })
    } catch {
      queryClient.setQueryData<GroceryItem>(['grocery', item.id], item)
      enqueueSnackbar('Failed to update status', { variant: 'error' })
    }
  }

  const handleDelete = async () => {
    await deleteMut(item.id)
    setAsk(false)
    onDeleted?.()
  }

  return (
    <Card sx={{ my: 4 }} variant="outlined">
      <CardHeader
        avatar={
          <IconButton aria-label="back" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
        }
        title={item.name}
        action={
          <IconButton aria-label="delete" onClick={() => setAsk(true)} disabled={deleting}>
            <Delete />
          </IconButton>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Button
              onClick={flip}
              disabled={isUpdating}
              variant="contained"
              color={item.status === 'HAVE' ? 'success' : 'inherit'}
              startIcon={
                isUpdating ? (
                  <CircularProgress size={16} />
                ) : item.status === 'HAVE' ? (
                  <CheckCircle />
                ) : (
                  <RemoveShoppingCart />
                )
              }
              sx={{ textTransform: 'none' }}
              aria-pressed={item.status === 'HAVE'}
            >
              {item.status === 'HAVE' ? 'Have' : 'Ran out'}
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Priority
            </Typography>
            <Typography>{item.priority}</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Quantity
            </Typography>
            <Typography>{item.quantity}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Status history</Typography>
            {histLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>When</TableCell>
                    <TableCell>Changed to</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history && history.length > 0 ? (
                    history.map(h => (
                      <TableRow key={h.id}>
                        <TableCell>{new Date(h.changedAt).toLocaleString()}</TableCell>
                        <TableCell>{h.newStatus}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography color="text.secondary">No history yet</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Stack>
        </Stack>

        <Dialog open={ask} onClose={() => setAsk(false)}>
          <DialogTitle>Delete entry</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <b>{item?.name}</b>? This cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAsk(false)}>Cancel</Button>
            <Button color="error" onClick={handleDelete} disabled={deleting}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default GroceryEntryView
