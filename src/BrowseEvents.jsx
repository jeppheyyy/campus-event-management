
import { useState } from "react";

const API_URL = "http://localhost:5000/api";

// CHECK IF EVENT HAS ALREADY PASSED
const isPastEvent = (date) => {
  const eventDate = new Date(date);
  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return eventDate < today;
};

// FORMAT EVENT DATE
const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function BrowseEvents({
  events,
  registeredEvents,
  setRegisteredEvents,
  token,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Seminar",
    "Sports",
    "Social",
    "Academic",
  ];

  // SEARCH AND FILTER EVENTS
  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch = [
      event.title,
      event.description,
      event.category,
      event.location,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  // REGISTER FOR AN EVENT
  const handleRegistration = async (eventId) => {
    if (registeredEvents.includes(eventId)) {
      alert("You are already registered for this event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setRegisteredEvents((previous) => [...previous, eventId]);

      alert("Event registration successful!");
    } catch (error) {
      alert(error.message);
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

      {/* EVENT CARDS */}
      <div className="browse-grid">
        {filteredEvents.map((event) => {
          const alreadyRegistered = registeredEvents.includes(event.id);
          const eventPassed = isPastEvent(event.date);
          const registrationClosed = event.status !== "Open";

          return (
            <div className="browse-card" key={event.id}>

              {/* EVENT BANNER */}
              <div className="browse-banner">
                <span>{event.category}</span>

                <div className="browse-banner-icon">
                  {"\u{1F393}"}
                </div>

                {eventPassed && (
                  <span className="event-status">
                    Event Passed
                  </span>
                )}
              </div>

              {/* EVENT INFORMATION */}
              <div className="browse-card-content">
                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <div className="browse-info">
                  <span>
                    {"\u{1F4C5}"} {formatEventDate(event.date)}
                  </span>

                  <span>
                    {"\u{1F552}"} {event.time}
                  </span>

                  <span>
                    {"\u{1F4CD}"} {event.location}
                  </span>
                </div>

                {/* REGISTRATION BUTTON */}
                <button
                  className={
                    alreadyRegistered
                      ? "registered-button"
                      : "register-button"
                  }
                  onClick={() => handleRegistration(event.id)}
                  disabled={
                    alreadyRegistered ||
                    eventPassed ||
                    registrationClosed
                  }
                >
                  {alreadyRegistered
                    ? "Registered"
                    : eventPassed
                    ? "Event Passed"
                    : registrationClosed
                    ? "Registration Closed"
                    : "Register Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* NO EVENTS FOUND */}
      {filteredEvents.length === 0 && (
        <div className="no-events">
          <h3>No events found</h3>
          <p>
            Try another search or select a different category.
          </p>
        </div>
      )}
    </div>
  );
}

export default BrowseEvents;