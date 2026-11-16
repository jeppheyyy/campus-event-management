
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function AttendanceManagement({ events, token }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // LOAD STUDENTS REGISTERED FOR THE SELECTED EVENT
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedEventId || !token) {
        setRegistrations([]);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/attendance/events/${selectedEventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load attendance records."
          );
        }

        setRegistrations(data.registrations || []);
      } catch (error) {
        alert(error.message);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedEventId, token]);

  // UPDATE ATTENDANCE STATUS
  const handleAttendanceChange = async (registrationId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/attendance/${registrationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attendanceStatus: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update attendance."
        );
      }

      setRegistrations((previous) =>
        previous.map((registration) =>
          registration._id === registrationId
            ? {
                ...registration,
                attendanceStatus: data.registration.attendanceStatus,
              }
            : registration
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const presentCount = registrations.filter(
    (registration) => registration.attendanceStatus === "Present"
  ).length;

  const absentCount = registrations.filter(
    (registration) => registration.attendanceStatus === "Absent"
  ).length;

  const notMarkedCount = registrations.filter(
    (registration) => registration.attendanceStatus === "Not Marked"
  ).length;

  return (
    <section className="admin-events-section attendance-section">
      <h2>Attendance Management</h2>
      <p>View registered students and manage their attendance.</p>

      <div className="admin-form-group attendance-event-select">
        <label>Select Event</label>

        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {events.length === 0 && (
            <option value="">No events available</option>
          )}

          {events.map((event) => (
            <option
              key={event._id || event.id}
              value={event._id || event.id}
            >
              {event.title}
            </option>
          ))}
        </select>
      </div>


      {loading ? (
        <p>Loading attendance records...</p>
      ) : !selectedEventId ? (
        <p>Please create an event first.</p>
      ) : (
        <>
          <div className="attendance-summary">
            <div className="stat-card">
              <p>Total Registered</p>
              <h2>{registrations.length}</h2>
            </div>

            <div className="stat-card">
              <p>Present</p>
              <h2>{presentCount}</h2>
            </div>

            <div className="stat-card">
              <p>Absent</p>
              <h2>{absentCount}</h2>
            </div>

            <div className="stat-card">
              <p>Not Marked</p>
              <h2>{notMarkedCount}</h2>
            </div>
          </div>

          {registrations.length === 0 ? (
            <p>No students have registered for this event yet.</p>
          ) : (
            <div className="attendance-table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>

                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration._id}>
                      <td>
                        {registration.student?.name || "Unknown Student"}
                      </td>

                      <td>
                        {registration.student?.email || "No email"}
                      </td>

                      <td>
                        <select
                          value={registration.attendanceStatus}
                          onChange={(e) =>
                            handleAttendanceChange(
                              registration._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Not Marked">Not Marked</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AttendanceManagement;
