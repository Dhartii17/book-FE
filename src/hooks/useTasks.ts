import { useCallback, useEffect, useState } from "react";
import * as taskApi from "../api/task.api";
import { errorMessage } from "../api/client";
import { useSocket } from "./useSocket";
import type {
  CreateTaskInput,
  Task,
  TaskListQuery,
  TaskStatus,
  TaskStatusCounts,
  UpdateTaskInput,
} from "../types";

const EMPTY_COUNTS: TaskStatusCounts = {
  all: 0,
  todo: 0,
  "in-progress": 0,
  done: 0,
};

const DEFAULT_QUERY: TaskListQuery = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  order: "desc",
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState<TaskListQuery>(DEFAULT_QUERY);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const load = useCallback(async (nextQuery: TaskListQuery) => {
    setLoading(true);
    setError(null);

    try {
      const result = await taskApi.fetchTasks(nextQuery);

      setTasks(result.data);
      setCounts(result.counts);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError(errorMessage(err, "Could not load tasks"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(query);
  }, [load, query]);

  const updateQuery = useCallback(
    (patch: Partial<TaskListQuery>) => {
      setQuery((previous) => ({
        ...previous,
        ...patch,
      }));
    },
    []
  );

  const reload = useCallback(() => load(query), [load, query]);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      await taskApi.createTask(input);
      await reload();
    },
    [reload]
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput) => {
      const updated = await taskApi.updateTask(id, input);
      setTasks((current) =>
        current.map((task) =>
          task.id === id ? updated : task
        )
      );
    },
    []
  );

  const updateStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      const previous = tasks.find((task) => task.id === id)?.status;

      setTasks((current) =>
        current.map((task) =>
          task.id === id ? { ...task, status } : task
        )
      );

      try {
        const updated = await taskApi.updateTaskStatus(id, status);

        setTasks((current) =>
          current.map((task) =>
            task.id === id ? updated : task
          )
        );
      } catch (err) {
        if (previous) {
          setTasks((current) =>
            current.map((task) =>
              task.id === id
                ? { ...task, status: previous }
                : task
            )
          );
        }
        throw err;
      }
    },
    [tasks]
  );

  const reassign = useCallback(
    async (id: string, assignedTo: string) => {
      await taskApi.assignTask(id, assignedTo);
      await reload();
    },
    [reload]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await taskApi.deleteTask(id);
      await reload();
    },
    [reload]
  );

  useEffect(() => {
    if (!socket) return;

    const refresh = () => {
      void load(query);
    };

    const onUpdated = ({
      taskId,
      status,
    }: {
      taskId: string;
      status: TaskStatus;
    }) => {
      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    };

    socket.on("task:assigned", refresh);
    socket.on("task:reassigned", refresh);
    socket.on("task:deleted", refresh);
    socket.on("task:updated", onUpdated);

    return () => {
      socket.off("task:assigned", refresh);
      socket.off("task:reassigned", refresh);
      socket.off("task:deleted", refresh);
      socket.off("task:updated", onUpdated);
    };
  }, [socket, query, load]);

  return {
    tasks,
    query,
    counts,
    total,
    totalPages,
    loading,
    error,
    updateQuery,
    reload,
    createTask,
    updateTask,
    updateStatus,
    reassign,
    deleteTask,
  };
}
