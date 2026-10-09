import {
  Avatar,
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import type {
  UserListQuery,
  UserWithStats,
} from "../../types";

interface UserTableProps {
  users: UserWithStats[];
  query: UserListQuery;
  total: number;
  currentUserId: string;
  onQueryChange: (query: Partial<UserListQuery>) => void;
  onEdit: (user: UserWithStats) => void;
  onDelete: (user: UserWithStats) => void;
}

export function UserTable({
  users,
  query,
  total,
  currentUserId,
  onQueryChange,
  onEdit,
  onDelete,
}: UserTableProps) {

  console.log("cheking the prop", users[0])
  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Assigned tasks</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar>{(user.name?.charAt(0) || "U").toUpperCase()}</Avatar>
                    <div>
                      <Typography fontWeight={600}>
                        {user.name}
                        {user.id === currentUserId && " (you)"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === "admin" ? "warning" : "primary"}
                  />
                </TableCell>

                <TableCell align="center">{user.taskCount}</TableCell>

                <TableCell align="center">
                  

                  <Tooltip
                    title={
                      user.id === currentUserId
                        ? "You cannot delete your own account"
                        : user.taskCount > 0
                        ? "Reassign this user's tasks first"
                        : "Delete user"
                    }
                  >
                    <span>
                      <IconButton
                        color="error"
                        disabled={
                          user.id === currentUserId ||
                          user.taskCount > 0
                        }
                        onClick={() => onDelete(user)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!users.length && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">
                    No users found.
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
        onRowsPerPageChange={(event) =>
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
