
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";
const isPastEvent = (date) => {
  if (!date) return false;

  const eventDate = new Date(date);
  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return eventDate < today;
};

function MyRegistrations({ setRegisteredEvents, token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD STUDENT REGISTRATIONS FROM MONGODB
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(
          `${API_URL}/registrations/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load registrations."
          );
        }

        setRegistrations(data.registrations || []);

        // Update the registered event IDs in App.jsx
        const eventIds = (data.registrations || [])
          .filter((registration) => registration.event)
          .map((registration) => registration.event._id);

        setRegisteredEvents(eventIds);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [token, setRegisteredEvents]);

  // CANCEL REGISTRATION
  const handleCancel = async (registrationId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `${API_URL}/registrations/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel registration."
        );
      }

      // Remove the cancelled registration from the page
      const cancelledRegistration = registrations.find(
        (registration) => registration._id === registrationId
      );

      setRegistrations((previous) =>
        previous.filter(
          (registration) => registration._id !== registrationId
        )
      );

      if (cancelledRegistration?.event) {
        const cancelledEventId = cancelledRegistration.event._id;

        setRegisteredEvents((previous) =>
          previous.filter((id) => id !== cancelledEventId)
        );
      }

      alert("Registration cancelled successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="my-registrations">
        <h2>Loading your registrations...</h2>
      </div>
    );
  }

  // GET EVENT DETAILS FROM REGISTRATION RECORDS
	const myEvents = registrations
  	.filter((registration) => registration.event)
  	.map((registration) => ({
    	...registration.event,
    	registrationId: registration._id,
    	attendanceStatus: registration.attendanceStatus,
    	registrationDate: registration.registeredAt,
  	}));

  return (
    <div className="my-registrations">
      <div className="browse-header">
        <div>
          <h1>My Registrations</h1>
          <p>
            View and manage the campus events you have registered for.
          </p>
        </div>

        <div className="browse-count">
          {myEvents.length} Registered Events
        </div>
      </div>

      {myEvents.length === 0 ? (
        <div className="no-events">
          <h3>No registrations yet</h3>
          <p>
            You haven't registered for any campus events.
            Visit Browse Events to find an activity.
          </p>
        </div>
      ) : (
        <div className="browse-grid">
          {myEvents.map((event) => (
            <div className="browse-card" key={event.registrationId}>
              <div className="browse-banner">
                <span>{event.category}</span>
                <div>🎓</div>
              </div>

              <div className="browse-card-content">
                <h3>{event.title}</h3>

                <p>{event.description}</p>

                
<div className="registration-status">

  <div className="status-row">
    <strong>Attendance</strong>

    <span
      className={`status-badge ${
        event.attendanceStatus === "Present"
          ? "status-present"
          : event.attendanceStatus === "Absent"
            ? "status-absent"
            : "status-not-marked"
      }`}
    >
      {event.attendanceStatus || "Not Marked"}
    </span>
  </div>

  <div className="status-row">
    <strong>Event Status</strong>

    <span
      className={`status-badge ${
        isPastEvent(event.date)
          ? "status-passed"
          : event.status === "Closed"
            ? "status-closed"
            : event.status === "Completed"
              ? "status-completed"
              : "status-open"
      }`}
    >
      {isPastEvent(event.date)
        ? "Event Passed"
        : event.status || "Open"}
    </span>
  </div>

</div>


                <div className="browse-info">
                  <span>
                    📅{" "}
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Date unavailable"}
                  </span>
                  <span>🕒 {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>

            {!isPastEvent(event.date) && (
              <button
                className="registered-button"
                onClick={() =>
                  handleCancel(event.registrationId)
                }
              >
                Cancel Registration
              </button>
            )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;
