import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import type { ChangeEvent } from "react";
import type {
  Task,
  TaskListQuery,
  TaskStatus,
  User,
} from "../../types";
import { StatusSelect } from "./StatusSelect";

interface TaskTableProps {
  tasks: Task[];
  users: User[];
  query: TaskListQuery;
  total: number;
  loading: boolean;
  isAdmin: boolean;
  currentUserId: string;
  onQueryChange: (query: Partial<TaskListQuery>) => void;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onReassign: (id: string, assignedTo: string) => Promise<void>;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

const statusColor = (
  status: TaskStatus
): "default" | "warning" | "success" => {
  if (status === "done") return "success";
  if (status === "in-progress") return "warning";
  return "default";
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TaskTable({
  tasks,
  users,
  query,
  total,
  loading,
  isAdmin,
  currentUserId,
  onQueryChange,
  onStatusChange,
  onReassign,
  onEdit,
  onDelete,
}: TaskTableProps) {
  const sortBy = (field: TaskListQuery["sortBy"]) => {
    const sameField = query.sortBy === field;
    const nextOrder =
      sameField && query.order === "asc" ? "desc" : "asc";

    onQueryChange({
      sortBy: field,
      order: nextOrder,
      page: 1,
    });
  };

  const sortDirection = (field: TaskListQuery["sortBy"]) =>
    query.sortBy === field ? query.order : false;

  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={Boolean(sortDirection("title"))}
                  direction={sortDirection("title") || "asc"}
                  onClick={() => sortBy("title")}
                >
                  Task
                </TableSortLabel>
              </TableCell>

              <TableCell>Assigned to</TableCell>
              <TableCell>Assigned by</TableCell>

              <TableCell>
                <TableSortLabel
                  active={Boolean(sortDirection("status"))}
                  direction={sortDirection("status") || "asc"}
                  onClick={() => sortBy("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={Boolean(sortDirection("createdAt"))}
                  direction={sortDirection("createdAt") || "desc"}
                  onClick={() => sortBy("createdAt")}
                >
                  Created
                </TableSortLabel>
              </TableCell>

              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.map((task) => {
              const canUpdateStatus =
                task.assignedTo.id === currentUserId;

              return (
                <TableRow hover key={task.id}>
                  <TableCell sx={{ minWidth: 280 }}>
                    <Typography fontWeight={600}>
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 380,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.description || "No description"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 220 }}>
                    {isAdmin ? (
                      <Autocomplete
                        size="small"
                        options={users}
                        value={task.assignedTo}
                        onChange={(_, value) => {
                          if (
                            value &&
                            value.id !== task.assignedTo.id
                          ) {
                            void onReassign(task.id, value.id);
                          }
                        }}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Assignee" />
                        )}
                        sx={{ minWidth: 190 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Avatar sx={{ width: 30, height: 30 }}>
                          {initials(task.assignedTo.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {task.assignedTo.id === currentUserId
                              ? "You"
                              : task.assignedTo.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {task.assignedTo.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {task.assignedBy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.assignedBy.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {canUpdateStatus ? (
                      <StatusSelect
                        value={task.status}
                        onChange={(status) =>
                          void onStatusChange(task.id, status)
                        }
                        disabled={loading}
                      />
                    ) : (
                      <Tooltip title="Only the assigned user can change status">
                        <Chip
                          label={
                            task.status === "in-progress"
                              ? "In progress"
                              : task.status === "todo"
                              ? "To do"
                              : "Done"
                          }
                          color={statusColor(task.status)}
                          size="small"
                        />
                      </Tooltip>
                    )}
                  </TableCell>

                  <TableCell>
                    <Tooltip title={new Date(task.createdAt).toLocaleString()}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {isAdmin && (
                    <TableCell align="right">
                     

                      <Tooltip title="Delete task">
                        <IconButton
                          color="error"
                          onClick={() => onDelete?.(task.id)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {!tasks.length && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 6 : 5}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography color="text.secondary">
                    {loading ? "Loading tasks..." : "No tasks found."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={(query.page ?? 1) - 1}
        onPageChange={(_, page) =>
          onQueryChange({ page: page + 1 })
        }
        rowsPerPage={query.limit ?? 10}
        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) =>
          onQueryChange({
            page: 1,
            limit: Number(event.target.value),
          })
        }
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Paper>
  );
}
