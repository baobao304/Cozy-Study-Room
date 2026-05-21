function Sidebar() {
  return (
    <nav className="cozy-sidebar" aria-label="Sidebar">
      <ul>
        <li className="logo">☕</li>
        <li>
          <button>Home</button>
        </li>
        <li>
          <button>Tasks</button>
        </li>
        <li>
          <button>Sessions</button>
        </li>
        <li>
          <button>Statistics</button>
        </li>
        <li>
          <button>Ambience</button>
        </li>
       
      </ul>
    </nav>
  );
}

export { Sidebar };
