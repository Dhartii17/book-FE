import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import type { TaskStatus } from "../../types";

interface StatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
}

const labels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export function StatusSelect({
  value,
  onChange,
  disabled,
}: StatusSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as TaskStatus);
  };

  return (
    <Select
      size="small"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      sx={{ minWidth: 130 }}
    >
      {Object.entries(labels).map(([status, label]) => (
        <MenuItem key={status} value={status}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
}
