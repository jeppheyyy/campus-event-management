import { useState } from "react";

function BrowseEvents({ registeredEvents, setRegisteredEvents }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const events = [
    {
      id: 1,
      title: "IT Week 2026",
      category: "Technology",
      date: "November 15, 2026",
      time: "8:00 AM - 5:00 PM",
      location: "University Auditorium",
      description: "A week of technology activities, competitions, and learning.",
    },
    {
      id: 2,
      title: "Campus Leadership Seminar",
      category: "Seminar",
      date: "November 20, 2026",
      time: "9:00 AM - 12:00 PM",
      location: "Conference Hall",
      description: "Develop your leadership and communication skills.",
    },
    {
      id: 3,
      title: "University Sports Festival",
      category: "Sports",
      date: "November 25, 2026",
      time: "7:00 AM - 5:00 PM",
      location: "University Gymnasium",
      description: "Join exciting sports competitions and activities.",
    },
    {
      id: 4,
      title: "Web Development Workshop",
      category: "Technology",
      date: "December 2, 2026",
      time: "1:00 PM - 4:00 PM",
      location: "Computer Laboratory",
      description: "Learn the fundamentals of modern web development.",
    },
    {
      id: 5,
      title: "Student Organization Fair",
      category: "Social",
      date: "December 5, 2026",
      time: "8:00 AM - 3:00 PM",
      location: "University Grounds",
      description: "Discover student organizations and campus communities.",
    },
    {
      id: 6,
      title: "Research Presentation",
      category: "Academic",
      date: "December 10, 2026",
      time: "9:00 AM - 3:00 PM",
      location: "University Auditorium",
      description: "Explore research projects presented by students.",
    },
  ];

  const categories = [
    "All",
    "Technology",
    "Seminar",
    "Sports",
    "Social",
    "Academic",
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleRegistration = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(
        registeredEvents.filter((id) => id !== eventId)
      );
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  return (
    <div className="browse-events">

      {/* PAGE HEADER */}
      <div className="browse-header">
        <div>
          <h1>Browse Campus Events</h1>
          <p>
            Discover upcoming activities and register for events
            happening on campus.
          </p>
        </div>

        <div className="browse-count">
          {events.length} Available Events
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="event-controls">

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

      </div>

      {/* EVENT RESULTS */}
      <div className="browse-results">
        <h2>Available Events</h2>
        <p>{filteredEvents.length} event(s) found</p>
      </div>

      <div className="browse-grid">

        {filteredEvents.map((event) => (
          <div className="browse-card" key={event.id}>

            <div className="browse-banner">
              <span>{event.category}</span>
              <div>🎓</div>
            </div>

            <div className="browse-card-content">

              <h3>{event.title}</h3>

              <p>{event.description}</p>

              <div className="browse-info">
                <span>📅 {event.date}</span>
                <span>🕒 {event.time}</span>
                <span>📍 {event.location}</span>
              </div>

              <button
                className={
                  registeredEvents.includes(event.id)
                    ? "registered-button"
                    : "register-button"
                }
                onClick={() => handleRegistration(event.id)}
              >
                {registeredEvents.includes(event.id)
                  ? "✓ Registered"
                  : "Register Now"}
              </button>

            </div>

          </div>
        ))}

      </div>

      {filteredEvents.length === 0 && (
        <div className="no-events">
          <h3>No events found</h3>
          <p>Try another search or select a different category.</p>
        </div>
      )}

    </div>
  );
}

export default BrowseEvents;