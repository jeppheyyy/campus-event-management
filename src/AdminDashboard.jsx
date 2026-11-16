import { useState } from "react";
import AttendanceManagement from "./AttendanceManagement";

const API_URL = "http://localhost:5000/api";

function AdminDashboard({ events, setEvents, token }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !date || !time || !location || !description) {
    alert("Please complete all fields.");
    return;
  }

  const eventData = {
    title,
    category,
    date,
    time,
    location,
    description,
  };

  try {
    const response = await fetch(
      editingId
        ? `${API_URL}/events/${editingId}`
        : `${API_URL}/events`,
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save event.");
    }

    // Reload events from MongoDB
    const eventsResponse = await fetch(`${API_URL}/events`);
    const eventsData = await eventsResponse.json();

    if (!eventsResponse.ok) {
      throw new Error("Event saved, but failed to refresh the event list.");
    }

    setEvents(
      (eventsData.events || []).map((event) => ({
        ...event,
        id: event._id || event.id,
      }))
    );

    alert(editingId ? "Event updated successfully!" : "Event added successfully!");

    setEditingId(null);
    setTitle("");
    setCategory("Technology");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");

  } catch (error) {
    alert(error.message);
  }
};

  const handleEdit = (event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setCategory(event.category);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setDescription(event.description);
  };

const handleDelete = async (eventId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this event?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete event.");
    }

    setEvents(events.filter((event) => event.id !== eventId));

    alert("Event deleted successfully!");

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="admin-dashboard">
      <div className="browse-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage campus events and monitor event activities.</p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Events</p>
          <h2>{events.length}</h2>
          <small>Events in the system</small>
        </div>

        <div className="stat-card">
          <p>Event Categories</p>
          <h2>{new Set(events.map((event) => event.category)).size}</h2>
          <small>Available categories</small>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>{editingId !== null ? "Edit Event" : "Add New Event"}</h2>

        
<form className="admin-event-form" onSubmit={handleSubmit}>
  <div className="admin-form-grid">
    <div className="admin-form-group">
      <label>Event Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter event title"
      />
    </div>

    <div className="admin-form-group">
      <label>Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Technology</option>
        <option>Seminar</option>
        <option>Sports</option>
        <option>Social</option>
        <option>Academic</option>
      </select>
    </div>

    <div className="admin-form-group">
      <label>Date</label>
      <input
        type="text"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Example: December 15, 2026"
      />
    </div>

    <div className="admin-form-group">
      <label>Time</label>
      <input
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Example: 8:00 AM - 5:00 PM"
      />
    </div>

    <div className="admin-form-group full-width">
      <label>Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter event location"
      />
    </div>

    <div className="admin-form-group full-width">
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter event description"
      />
    </div>
  </div>

  <div className="admin-form-actions">
    <button type="submit">
      {editingId !== null ? "Update Event" : "+ Add Event"}
    </button>

    {editingId !== null && (
      <button
        type="button"
        className="cancel-edit-btn"
        onClick={() => {
          setEditingId(null);
          setTitle("");
          setCategory("Technology");
          setDate("");
          setTime("");
          setLocation("");
          setDescription("");
        }}
      >
        Cancel Editing
      </button>
    )}
  </div>
</form>

      </section>

            <section className="admin-events-section">
        <h2>Manage Events</h2>

        {events.map((event) => (
          <div className="admin-event-item" key={event.id}>
            <div>
              <h3>{event.title}</h3>
              <p>{event.category} | {event.date}</p>
              <small>{event.location}</small>
            </div>

            <div className="admin-event-actions">
              <button onClick={() => handleEdit(event)}>Edit</button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>

      <AttendanceManagement
        events={events}
        token={token}
      />
    </div>
  );
}

export default AdminDashboard;
