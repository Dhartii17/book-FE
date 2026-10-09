import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type {
  CreateTaskInput,
  Task,
  User,
} from "../../types";
import { useAuth } from "../../hooks/useAuth";

interface TaskFormProps {
  open: boolean;
  task?: Task | null;
  users: User[];
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  onUpdate?: (id: string, input: {
    title: string;
    description?: string;
  }) => Promise<void>;
}

export function TaskForm({
  open,
  task,
  users,
  onClose,
  onSubmit,
  onUpdate,
}: TaskFormProps) {
  const { user } = useAuth();

  const editing = Boolean(task);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setSelectedUser(task?.assignedTo ?? null);
  }, [open, task]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setSaving(true);

    try {
      if (editing && task && onUpdate) {
        await onUpdate(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
        });
      } else {
        if (!selectedUser) return;

        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          assignedTo: selectedUser.id,
          assignedBy: user.id,
        });
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Edit task" : "Create task"}</DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 2, pt: "20px !important" }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          inputProps={{ maxLength: 200 }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          inputProps={{ maxLength: 1000 }}
        />

        {!editing && (
          <Autocomplete
            options={users}
            value={selectedUser}
            onChange={(_, value) => setSelectedUser(value)}
            getOptionLabel={(user) => `${user.name} (${user.email})`}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="Assign to" required />
            )}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            saving ||
            !title.trim() ||
            (!editing && !selectedUser)
          }
        >
          {saving ? "Saving..." : editing ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
