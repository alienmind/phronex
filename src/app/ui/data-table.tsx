/*
 * This is a generic data table (client) component
 * It is used to display generically table of data
 * It is based on the tanstack/react-table library
 * 
 * It supports:
 * - Sorting
 * - Filtering
 * - Pagination
 * - Editable cells with backend submission
 */
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface ColumnMetaType {
  editable?: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue, ColumnMetaType>[]
  data: TData[]
  onRowUpdate?: (rowId: string, data: Partial<TData>) => Promise<void>
  onRowCreate?: (data: Partial<TData>) => Promise<void>
  idField?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowUpdate,
  onRowCreate,
  idField = 'id',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [editingCell, setEditingCell] = React.useState<
  {
      rowId: string;
      columnId: string;
      value: any;
  } | null>(null)
  const [editingValue, setEditingValue] = React.useState("")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newRowData, setNewRowData] = React.useState<Partial<TData>>({})
  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      editingCell,
      setEditingCell,
      updateData: async (rowId: string, columnId: string, value: any) => {
        if (!onRowUpdate) return;
        try {
          await onRowUpdate(rowId, { [columnId]: value } as Partial<TData>);
          setEditingCell(null);
          toast({
            title: "Success",
            description: "Data updated successfully",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update data",
          });
        }
      },
    },
    getRowId: (row: any) => String(row[idField]),
  });

  // Custom cell renderer that handles editable cells
  const renderCell = (cell: any) => {
    const isEditing = 
      editingCell?.rowId === cell.row.id && 
      editingCell?.columnId === cell.column.id;

    const column = cell.column.columnDef;
    const isEditable = column.meta?.editable === true;

    if (isEditing && isEditable) {
      return (
        <Input
          autoFocus
          defaultValue={editingCell?.value}
          onBlur={(e) => {
            const newValue = e.target.value;
            if (newValue !== editingCell?.value) {
              (table.options.meta as any).updateData(
                cell.row.id,
                cell.column.id,
                newValue
              );
            } else {
              setEditingCell(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const newValue = e.currentTarget.value;
              if (newValue !== editingCell?.value) {
                (table.options.meta as any).updateData(
                  cell.row.id,
                  cell.column.id,
                  newValue
                );
              } else {
                setEditingCell(null);
              }
            } else if (e.key === "Escape") {
              setEditingCell(null);
            }
          }}
        />
      );
    }

    return (
      <div
        className={isEditable ? "cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded" : ""}
        onClick={() => {
          if (isEditable) {
            setEditingCell({
              rowId: cell.row.id,
              columnId: cell.column.id,
              value: cell.getValue(),
            });
          }
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    );
  };

  const handleNewRow = () => {
    setShowCreateDialog(true)
    setNewRowData({})
  }

  const handleNewRowSubmit = async () => {
    if (!onRowCreate) return

    try {
      await onRowCreate(newRowData)
      setShowCreateDialog(false)
      setNewRowData({})
      toast({
        title: "Success",
        description: "New record created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new record",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("all_columns")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("all_columns")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {onRowCreate && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleNewRow} className="ml-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {columns.map((column) => {
                  if (column.id === "actions" || 
                      ("accessorKey" in column && column.accessorKey === "all_columns") ||
                      !column.meta?.editable) {
                    return null
                  }
                  const columnId = column.id || ("accessorKey" in column ? String(column.accessorKey) : "")
                  const columnName = ("accessorKey" in column ? String(column.accessorKey) : column.id) || ""
                  
                  return (
                    <div key={columnId} className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        {columnName.charAt(0).toUpperCase() + columnName.slice(1).replace(/_/g, ' ')}
                      </Label>
                      <Input
                        className="col-span-3"
                        value={String(newRowData[columnId as keyof TData] || "")}
                        onChange={(e) => 
                          setNewRowData(prev => ({
                            ...prev,
                            [columnId]: e.target.value
                          }))
                        }
                      />
                    </div>
                  )
                })}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleNewRowSubmit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {renderCell(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}