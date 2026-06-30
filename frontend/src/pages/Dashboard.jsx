import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await api.post("/tasks/", { title: newTaskTitle });
      setNewTaskTitle("");
      await fetchTasks();
    } catch (err) {
      console.error("Create task failed", err);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
      await fetchTasks();
    } catch (err) {
      console.error("Toggle task failed", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete task failed", err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {user?.email}</h2>
        <button onClick={logout} style={{ padding: "8px 12px" }}>
          Logout
        </button>
      </header>

      <section style={{ marginTop: 20 }}>
        <form onSubmit={handleCreateTask} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New task title"
            style={{ flex: 1, padding: 8 }}
          />
          <button type="submit" style={{ padding: "8px 12px" }}>
            Add
          </button>
        </form>

        <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="checkbox"
                  checked={!!task.is_completed}
                  onChange={() => handleToggleTask(task)}
                />
                <span style={{ textDecoration: task.is_completed ? "line-through" : "none" }}>{task.title}</span>
              </div>
              <div>
                <button onClick={() => handleDeleteTask(task.id)} style={{ padding: "6px 10px" }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
