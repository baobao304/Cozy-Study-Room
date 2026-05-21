import { useEffect, useState } from "react";

function StudyTimerCard({ className = "" }) {
  const initialMinutes = 60;
  // Timer state — default values used if nothing is stored in localStorage.
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Load timer settings from localStorage when the component mounts.
  // We use a separate effect with an empty dependency array so it only runs once.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cozy_timer");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Validate and restore saved values if present
        if (parsed && typeof parsed === "object") {
          if (typeof parsed.minutes === "number") setMinutes(parsed.minutes);
          if (typeof parsed.seconds === "number") setSeconds(parsed.seconds);
          if (typeof parsed.isRunning === "boolean")
            setIsRunning(parsed.isRunning);
        }
      }
    } catch (err) {
      console.warn("Failed to load timer from localStorage:", err);
    } finally {
      setHydrated(true);
    }
    // Empty dependency array ensures this runs only once on mount.
  }, []);

  // Save timer settings to localStorage whenever any timer state changes,
  // but only after we've hydrated from storage to avoid overwriting saved
  // values with the initial defaults during the first render.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const toSave = { minutes, seconds, isRunning };
      localStorage.setItem("cozy_timer", JSON.stringify(toSave));
    } catch (err) {
      console.warn("Failed to save timer to localStorage:", err);
    }
  }, [minutes, seconds, isRunning, hydrated]);

  // When state changes, React re-renders this component so the timer display stays in sync.
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((currentSeconds) => {
        if (currentSeconds > 0) {
          return currentSeconds - 1;
        }

        if (minutes === 0) {
          // Timer has reached 00:00, stop it.
          setIsRunning(false);
          return 0;
        }

        setMinutes((currentMinutes) => {
          if (currentMinutes === 0) {
            setIsRunning(false);
            return 0;
          }

          return currentMinutes - 1; // Decrease minutes when seconds roll over from 00 to 59.
        });

        return 59;
      });
    }, 1000);

    // Cleanup stops the interval when the timer pauses, resets, or the component unmounts.
    return () => clearInterval(intervalId);
  }, [isRunning]);

  function handleStart() {
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  }

  return (
    <section className={`study-card study-timer-card ${className}`.trim()}>
      <div className="card-label">Study Timer</div>
      <h2>Deep focus block</h2>
      <p className="card-copy">Settle in and protect this study window.</p>

      <div className="timer-display" aria-label="Timer display">
        <span>{String(minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>

      <div className="timer-controls" aria-label="Timer controls">
        <button type="button" onClick={handleStart}>
          Start
        </button>
        <button type="button" onClick={handlePause}>
          Pause
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  );
}

export { StudyTimerCard };
