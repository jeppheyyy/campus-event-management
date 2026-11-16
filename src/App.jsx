
import { useState } from "react";
import "./App.css";
import BrowseEvents from "./BrowseEvents";
import MyRegistrations from "./MyRegistrations";
import AdminDashboard from "./AdminDashboard";

const API_URL = "http://localhost:5000/api";

// FORMAT EVENT DATE
const formatEventDate = (date) => {
  const eventDate = new Date(date);

  if (Number.isNaN(eventDate.getTime())) {
    return "Date unavailable";
  }

  return eventDate.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // COUNT UPCOMING EVENTS
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);

    return (
      !Number.isNaN(eventDate.getTime()) &&
      eventDate >= today
    );
  }).length;

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // LOAD EVENTS FROM MONGODB
      const eventsResponse = await fetch(`${API_URL}/events`);
      const eventsData = await eventsResponse.json();

      if (!eventsResponse.ok) {
        throw new Error(
          eventsData.message || "Failed to load events."
        );
      }

      const loadedEvents = (eventsData.events || []).map((event) => ({
        ...event,
        id: event._id || event.id,
      }));

      setEvents(loadedEvents);

      // LOAD STUDENT REGISTRATIONS
      if (data.user.role === "student") {
        const registrationsResponse = await fetch(
          `${API_URL}/registrations/my`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const registrationsData = await registrationsResponse.json();

        if (!registrationsResponse.ok) {
          throw new Error(
            registrationsData.message ||
              "Failed to load registrations."
          );
        }

        const eventIds = (registrationsData.registrations || [])
          .filter((registration) => registration.event)
          .map((registration) => registration.event._id);

        setRegisteredEvents(eventIds);
      } else {
        setRegisteredEvents([]);
      }

      // SAVE LOGIN INFORMATION
      setToken(data.token);
      setUser(data.user);
      setCurrentPage("dashboard");
      setIsLoggedIn(true);

      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setToken("");
    setUser(null);
    setEvents([]);
    setRegisteredEvents([]);
    setCurrentPage("dashboard");
  };

  // LOGIN PAGE
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

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="footer-text">
            © 2026 Campus Events. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
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
            className={
              currentPage === "registrations" ? "active" : ""
            }
            onClick={() => setCurrentPage("registrations")}
          >
            <span>▤</span> My Registrations
          </a>

          {user?.role === "admin" && (
            <a
              href="#admin"
              className={currentPage === "admin" ? "active" : ""}
              onClick={() => setCurrentPage("admin")}
            >
              <span>⚙</span> Admin Dashboard
            </a>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button onClick={handleLogout}>
            ↪ Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      {currentPage === "events" ? (
        <main className="dashboard-main">
          <BrowseEvents
            events={events}
            registeredEvents={registeredEvents}
            setRegisteredEvents={setRegisteredEvents}
            token={token}
          />
        </main>
      ) : currentPage === "registrations" ? (
        <main className="dashboard-main">
          <MyRegistrations
            events={events}
            registeredEvents={registeredEvents}
            setRegisteredEvents={setRegisteredEvents}
            token={token}
          />
        </main>
      ) : currentPage === "admin" ? (
        <main className="dashboard-main">
          <AdminDashboard
            events={events}
            setEvents={setEvents}
            token={token}
          />
        </main>
      ) : (

        /* STUDENT DASHBOARD */

        <main className="dashboard-main">

          {/* HEADER */}
          <header className="dashboard-header">
            <div>
              <h1>Student Dashboard</h1>
              <p>
                Welcome back! Here's what's happening on campus.
              </p>
            </div>

            <div className="student-profile">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || "S"}
              </div>

              <div>
                <strong>{user?.name || "Student"}</strong>
                <small>
                  {user?.role === "admin"
                    ? "Admin Account"
                    : "Student Account"}
                </small>
              </div>
            </div>
          </header>

          {/* WELCOME SECTION */}
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

          {/* STATISTICS */}
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
              <h2>{registeredEvents.length}</h2>
              <small>Events you joined</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">◷</div>
              <p>Upcoming Events</p>
              <h2>{upcomingEvents}</h2>
              <small>Events coming soon</small>
            </div>

          </section>

          {/* UPCOMING CAMPUS EVENTS */}
          <section className="events-section" id="events">

            <div className="section-header">
              <div>
                <h2>Upcoming Campus Events</h2>
                <p>Check out the latest university activities.</p>
              </div>

              <a
                href="#events"
                onClick={() => setCurrentPage("events")}
              >
                View All Events →
              </a>
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

                    <p>📅 {formatEventDate(event.date)}</p>
                    <p>📍 {event.location}</p>

                    <div className="event-footer">
                      <span className="event-status">
                        {event.status}
                      </span>

                      <button
                        onClick={() => setCurrentPage("events")}
                      >
                        View Event
                      </button>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </section>

          {/* FOOTER */}
          <footer className="dashboard-footer">
            © 2026 Campus Events | Student Portal
          </footer>

        </main>
      )}
    </div>
  );
}

export default App;
