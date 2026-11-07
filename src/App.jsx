import { useState } from "react";
import "./App.css";
import BrowseEvents from "./BrowseEvents";
import MyRegistrations from "./MyRegistrations";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  // Dashboard sample data
  const events = [
    {
      id: 1,
      title: "IT Week 2026",
      category: "Technology",
      date: "November 15, 2026",
      location: "University Auditorium",
      status: "Open",
    },
    {
      id: 2,
      title: "Campus Leadership Seminar",
      category: "Seminar",
      date: "November 20, 2026",
      location: "Conference Hall",
      status: "Open",
    },
    {
      id: 3,
      title: "Sports Festival",
      category: "Sports",
      date: "November 25, 2026",
      location: "University Gymnasium",
      status: "Open",
    },
  ];

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo">
            <h1>CE</h1>
          </div>

          <h2>Campus Events</h2>

          <p className="subtitle">
            Campus Event Registration and Attendance Management System
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit">Sign In</button>
          </form>

          <p className="footer-text">
            © 2026 Campus Events. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="small-logo">CE</div>
          <h2>Campus Events</h2>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="sidebar-nav">
  <a
    href="#dashboard"
    className={currentPage === "dashboard" ? "active" : ""}
    onClick={() => setCurrentPage("dashboard")}
  >
    <span>▦</span> Dashboard
  </a>

  <a
    href="#events"
    className={currentPage === "events" ? "active" : ""}
    onClick={() => setCurrentPage("events")}
  >
    <span>▣</span> Browse Events
  </a>

  <a
    href="#registrations"
    className={currentPage === "registrations" ? "active" : ""}
    onClick={() => setCurrentPage("registrations")}
  >
    <span>▤</span> My Registrations
  </a>
</nav>

        <div className="sidebar-bottom">
          <button onClick={handleLogout}>
            ↪ Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
{currentPage === "events" ? (
  <main className="dashboard-main">
    <BrowseEvents
      registeredEvents={registeredEvents}
      setRegisteredEvents={setRegisteredEvents}
    />
  </main>
) : (
  <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back! Here's what's happening on campus.</p>
          </div>

          <div className="student-profile">
            <div className="profile-avatar">S</div>
            <div>
              <strong>Student</strong>
              <small>Student Account</small>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div>
            <h2>Welcome to Campus Events!</h2>
            <p>
              Discover activities, join campus events, and stay connected
              with your university.
            </p>
          </div>

          <div className="welcome-icon">🎓</div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">▣</div>
            <p>Available Events</p>
            <h2>{events.length}</h2>
            <small>Events you can explore</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>My Registrations</p>
            <h2>2</h2>
            <small>Events you joined</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <p>Upcoming Events</p>
            <h2>2</h2>
            <small>Events coming soon</small>
          </div>

        </section>

        {/* Events Section */}
        <section className="events-section" id="events">

          <div className="section-header">
            <div>
              <h2>Upcoming Campus Events</h2>
              <p>Check out the latest university activities.</p>
            </div>

            <a href="#events">View All Events →</a>
          </div>

          <div className="event-grid">

            {events.map((event) => (
              <div className="event-card" key={event.id}>

                <div className="event-banner">
                  <span>{event.category}</span>
                  <div>🎓</div>
                </div>

                <div className="event-details">
                  <h3>{event.title}</h3>

                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>

                  <div className="event-footer">
                    <span className="event-status">
                      {event.status}
                    </span>

                    <button onClick={() =>
                      alert("Event registration will be added soon!")
                    }>
                      View Event
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        </section>

        <footer className="dashboard-footer">
          © 2026 Campus Events | Student Portal
        </footer>

      </main>
      )}
    </div>
  );
}

export default App;