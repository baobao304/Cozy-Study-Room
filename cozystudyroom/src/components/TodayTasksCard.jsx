import { useEffect, useRef, useState, useMemo } from "react";

function TodayTasksCard() {
  // Default tasks used when there is no saved data.
  const defaultTasks = [
    { id: 1, text: "Review class notes", done: false },
    { id: 2, text: "Finish one reading block", done: false },
    { id: 3, text: "Organize tomorrow's materials", done: false },
  ];

  // Lazy initializer reads from localStorage during the initial render.
  // This avoids calling setState inside an effect which can cause the
  // cascading render warning in React's dev mode.
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("cozy_tasks");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn("Failed to parse saved tasks from localStorage:", err);
    }
    return defaultTasks;
  });

  const [input, setInput] = useState("");

  // Compute nextId based on the initialized tasks so we don't reuse IDs.
  const nextId = useRef(
    tasks.reduce(
      (m, t) => (t && typeof t.id === "number" && t.id > m ? t.id : m),
      0,
    ) + 1,
  );

  // Persist tasks to localStorage whenever `tasks` changes.
  // This effect only writes to storage and does not call setState, so it
  // won't trigger the cascading render warning.
  useEffect(() => {
    try {
      localStorage.setItem("cozy_tasks", JSON.stringify(tasks));
    } catch (err) {
      console.warn("Failed to save tasks to localStorage:", err);
    }
  }, [tasks]);

  // UI filter state: 'all' | 'completed' | 'active'
  const [filter, setFilter] = useState("all");

  // Memoize the filtered list so we only recompute when `tasks` or `filter` change.
  // useMemo runs during render, and re-runs the function only when dependencies change.
  // This helps avoid expensive recalculations on every render when they aren't needed.
  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.done);
    if (filter === "active") return tasks.filter((t) => !t.done);
    return tasks;
  }, [tasks, filter]);

  // Compute statistics (total, completed, percentage) and memoize the result.
  // This keeps the calculations cheap — they run only when `tasks` changes.
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [tasks]);

  // Controlled input: value comes from `input` state, onChange updates it.
  // This makes the input a controlled component and keeps the UI in sync with state.
  function handleInputChange(e) {
    setInput(e.target.value);
  }

  // Add a new task immutably by creating a new array using spread syntax
  function handleAddTask(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTask = { id: nextId.current++, text, done: false };

    // Immutable update: do not modify `tasks` directly — create a new array instead
    setTasks((prev) => [...prev, newTask]);
    setInput("");
  }

  // Toggle completed state for a task by mapping to a new array
  function handleToggle(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  // Delete a task by filtering it out (also an immutable update)
  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <section className="study-card">
      <div className="card-label">Today's Tasks</div>
      <h2>Today's queue</h2>
      <p className="card-copy">Three focused steps to keep momentum gentle.</p>

      <form onSubmit={handleAddTask} aria-label="Add task form">
        <input
          type="text"
          placeholder="Add a task"
          value={input}
          onChange={handleInputChange}
          aria-label="New task"
        />
        <button type="submit">Add task</button>
      </form>

      <div
        className="task-controls"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }} aria-label="Filter tasks">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: filter === "all" ? "var(--glass)" : "transparent",
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            aria-pressed={filter === "active"}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: filter === "active" ? "var(--glass)" : "transparent",
            }}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            aria-pressed={filter === "completed"}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background:
                filter === "completed" ? "var(--glass)" : "transparent",
            }}
          >
            Completed
          </button>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right", fontSize: 13 }}>
          <div>
            <strong>Total:</strong> {stats.total}
          </div>
          <div>
            <strong>Done:</strong> {stats.completed}
          </div>
          <div>
            <strong>Completion:</strong> {stats.percent}%
          </div>
        </div>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(task.id)}
              />
              <span
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                  marginLeft: 8,
                }}
              >
                {task.text}
              </span>
            </label>
            <button
              type="button"
              onClick={() => handleDelete(task.id)}
              style={{ marginLeft: 12 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { TodayTasksCard };
