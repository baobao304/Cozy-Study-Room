import { useEffect, useRef, useState } from "react";

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

      <ul className="task-list">
        {tasks.map((task) => (
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
