import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type {
  CreateUserInput,
  Role,
  UpdateUserInput,
  UserWithStats,
} from "../../types";

interface UserFormProps {
  open: boolean;
  user?: UserWithStats | null;
  onClose: () => void;
  onCreate: (input: CreateUserInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateUserInput) => Promise<void>;
}

export function UserForm({
  open,
  user,
  onClose,
  onCreate,
  onUpdate,
}: UserFormProps) {
  const editing = Boolean(user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPassword("");
    setRole(user?.role ?? "user");
  }, [open, user]);

  const submit = async () => {
    if (!name.trim() || !email.trim()) return;

    setSaving(true);

    try {
      if (editing && user) {
        await onUpdate(user.id, {
          name: name.trim(),
          email: email.trim(),
          role,
          ...(password ? { password } : {}),
        });
      } else {
        if (!password) return;

        await onCreate({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{editing ? "Edit user" : "Add user"}</DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 2, pt: "20px !important" }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          fullWidth
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <TextField
          label={editing ? "New password (optional)" : "Password"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editing}
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void submit()}
          disabled={
            saving ||
            !name.trim() ||
            !email.trim() ||
            (!editing && !password)
          }
        >
          {saving ? "Saving..." : editing ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
