/**
 * This is a generic data table (client) component
 * It is used to display generically table of data
 * It is based on the tanstack/react-table library
 * 
 * It supports:
 * - Sorting
 * - Filtering
 * - Pagination
 * - Editable cells with backend submission
 * - Create new row
 * - Delete row
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowUpdate?: (rowId: string, data: Partial<TData>) => Promise<void>
  onRowCreate?: (data: Partial<TData>) => Promise<void>
  onRowDelete?: (rowId: string) => Promise<void>
  idField?: string
  showNewButton?: boolean
}

type CustomColumnMeta = {
  editable?: boolean;
  selectableOptions?: {
    fetchOptions: () => Promise<{
      id: string;
      label: string;
      hiddenValue?: {
        field: string;
        value: string;
      };
    }[]>;
  };
};

//declare module '@tanstack/react-table' {
//  interface ColumnMeta<TData extends RowData, TValue> extends CustomColumnMeta {}
//}

type SelectOption = {
  id: string;
  label: string;
  hiddenValue?: {
    field: string;
    value: string;
  };
};

const DeleteDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowUpdate,
  onRowCreate,
  onRowDelete,
  idField = 'id',
  showNewButton = true,
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
  const [selectableOptions, setSelectableOptions] = React.useState<Record<string, SelectOption[]>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (showCreateDialog) {
      columns.forEach(async (column) => {
        const meta = column.meta as CustomColumnMeta;
        if (meta?.selectableOptions) {
          const options = await meta.selectableOptions.fetchOptions();
          setSelectableOptions(prev => ({
            ...prev,
            [column.id || String(("accessorKey" in column ? column.accessorKey : ""))]: options
          }));
        }
      });
    }
  }, [showCreateDialog, columns]);

  const handleDelete = async () => {
    if (!rowToDelete || !onRowDelete) return;
    
    try {
      await onRowDelete(rowToDelete);
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting row:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete record",
      });
    } finally {
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

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
          console.error('Error updating data:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update data",
          });
        }
      },
      deleteRow: (rowId: string) => {
        setRowToDelete(rowId);
        setDeleteDialogOpen(true);
      },
    },
    getRowId: (row: any) => {
      console.log("Getting row id for: ", JSON.stringify(row));
      let ret: string;
      if ('composite_id' in row) {
        ret= String(row.composite_id);
      }
      else {
        ret= String((row as any)[idField]);
      }
      console.log("Returning row id: ", ret);
      return ret;
    },
  });

  // Custom cell renderer that handles editable cells
  const renderCell = (cell: any) => {
    const column = cell.column.columnDef;
    const isEditable = column.meta?.editable;
    const hasSelectableOptions = column.meta?.selectableOptions;
    const isEditing = editingCell?.rowId === cell.row.id && editingCell?.columnId === cell.column.id;

    if (isEditing) {
      if (hasSelectableOptions) {
        const options = selectableOptions[cell.column.id];
        const currentValue = cell.getValue();
        
        return (
          <Select
            value={String(currentValue)}
            onValueChange={async (value) => {
              const option = options?.find(opt => opt.id === value);
              try {
                if (option?.hiddenValue) {
                  // Update hidden value first
                  await (table.options.meta as any).updateData(
                    cell.row.id, 
                    option.hiddenValue.field, 
                    option.hiddenValue.value
                  );
                }
                // Then update visible value
                await (table.options.meta as any).updateData(
                  cell.row.id, 
                  cell.column.id, 
                  value
                );
                
                // Exit edit mode
                setEditingCell(null);
              } catch (error) {
                console.error('Failed to update:', error);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${column.header}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      } else {
        return (
          <Input
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={async () => {
              await (table.options.meta as any).updateData(cell.row.id, cell.column.id, editingValue);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (table.options.meta as any).updateData(cell.row.id, cell.column.id, editingValue);
              }
            }}
            autoFocus
          />
        );
      }
    }

    return (
      <div
        className={isEditable ? "cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded" : ""}
        onClick={async () => {
          if (isEditable) {
            if (hasSelectableOptions && !selectableOptions[cell.column.id]) {
              // Fetch options if they haven't been loaded yet
              const options = await column.meta?.selectableOptions.fetchOptions();
              setSelectableOptions(prev => ({
                ...prev,
                [cell.column.id]: options
              }));
            }
            setEditingCell({
              rowId: cell.row.id,
              columnId: cell.column.id,
              value: cell.getValue(),
            });
            setEditingValue(String(cell.getValue() || ""));
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
      console.error('Error creating new row:', error);
      toast({
        title: "Error",
        description: "Failed to create new record",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <DeleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("all_columns")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("all_columns")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {onRowCreate && showNewButton && (
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
                      !("meta" in column) || !column.meta || !("editable" in column.meta)) {
                    return null
                  }
                  const columnId = column.id || ("accessorKey" in column ? String(column.accessorKey) : "")
                  const columnName = ("accessorKey" in column ? String(column.accessorKey) : column.id) || ""
                  const options = selectableOptions[columnId] as SelectOption[];
                  
                  return (
                    <div key={columnId} className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        {(typeof column.header === 'string' ? column.header : columnName.charAt(0).toUpperCase() + columnName.slice(1).replace(/_/g, ' '))}
                      </Label>
                      {column.meta && "selectableOptions" in column.meta && column.meta.selectableOptions ? (
                        <Select
                          value={String(newRowData[columnId as keyof TData] || "")}
                          onValueChange={(value) => {
                            const option = options?.find(opt => opt.id === value);
                            setNewRowData(prev => ({
                              ...prev,
                              [columnId]: value,
                              ...(option?.hiddenValue ? { category_id: option.hiddenValue } : {})
                            }));
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder={`Select ${typeof column.header === 'string' ? column.header : columnName}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options?.map(option => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
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
                      )}
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