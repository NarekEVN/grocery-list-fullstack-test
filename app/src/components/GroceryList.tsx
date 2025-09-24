import { FC, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  IconButton,
  TextField,
  Link,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import Logout from './Logout'

import { useGroceryList, useDeleteGrocery, useUpdateGrocery } from 'hooks/useGrocery'
import { useSnackbar } from 'notistack'

const GroceryList: FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HAVE' | 'RANOUT'>('ALL')
  const { data, isLoading, isError, error } = useGroceryList({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteGrocery()
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateGrocery()
  const [editedQty, setEditedQty] = useState<Record<string, string>>({})
  const [ask, setAsk] = useState<{ id: string; name: string } | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const onQtyChange = (id: string, v: string) => {
    const digits = v.replace(/\D+/g, '')
    setEditedQty(prev => ({ ...prev, [id]: digits }))
  }
  const parseQty = (raw: string): number | undefined => {
    const s = raw.trim()
    if (s === '') return undefined
    const n = parseInt(s, 10)
    return Number.isFinite(n) ? n : undefined
  }
  const onQtyBlur = async (item: GroceryItem) => {
    const raw = editedQty[item.id]
    if (raw === undefined) return
    const next = parseQty(raw)
    if (next === undefined || next === item.quantity) return
    try {
      await updateItem({ item: { ...item, quantity: next } })
      enqueueSnackbar('Quantity updated', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to update quantity', { variant: 'error' })
    }
  }
  const onQtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id)
      enqueueSnackbar('Item deleted', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to delete item', { variant: 'error' })
    }
  }

  const toggleStatus = async (item: GroceryItem) => {
    const nextStatus = item.status === 'HAVE' ? 'RANOUT' : 'HAVE'
    try {
      await updateItem({ item: { ...item, status: nextStatus } })
      enqueueSnackbar(`Status set to ${nextStatus === 'HAVE' ? 'Have' : 'Ran out'}`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to update status', { variant: 'error' })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <TableContainer component={Paper}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ p: 1 }}>
        <Select
          size="small"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as 'ALL' | 'HAVE' | 'RANOUT')}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="RANOUT">Ran out</MenuItem>
          <MenuItem value="HAVE">Have</MenuItem>
        </Select>
        <Logout />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Changed Status</TableCell>
            {isEditing && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map(item => (
            <TableRow key={item.id}>
              <TableCell>
                <Link component={RouterLink} to={`/grocery/${item.id}`} underline="hover">
                  {item.name}
                </Link>
              </TableCell>

              <TableCell sx={{ maxWidth: 160 }}>
                {isEditing ? (
                  <TextField
                    size="small"
                    value={editedQty[item.id] ?? String(item.quantity)}
                    onChange={e => onQtyChange(item.id, e.target.value)}
                    onBlur={() => onQtyBlur(item)}
                    onKeyDown={onQtyKeyDown}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    disabled={isUpdating}
                  />
                ) : (
                  item.quantity
                )}
              </TableCell>
              <TableCell>
                <Checkbox checked={item.status === 'HAVE'} onChange={() => toggleStatus(item)} disabled={isUpdating} />
              </TableCell>
              <TableCell>{item.lastUpdatedStatus ? new Date(item.lastUpdatedStatus).toLocaleString() : null}</TableCell>
              {isEditing && (
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => setAsk({ id: item.id, name: item.name })}
                    disabled={isDeleting}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!ask} onClose={() => setAsk(null)}>
        <DialogTitle>Delete item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{ask?.name}</b>? This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAsk(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={async () => {
              if (ask) {
                await handleDelete(ask.id)
                setAsk(null)
              }
            }}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  )
}

export default GroceryList
