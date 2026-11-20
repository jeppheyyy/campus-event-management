# Campus Event Registration and Attendance Management System

## About the Project

The Campus Event Registration and Attendance Management System is a web-based application that helps students and administrators manage campus events more easily.

Instead of manually handling event registrations and attendance records, this system provides one platform where students can browse events, register for activities, and check their attendance. Administrators can also create and manage events and monitor student participation.

This project was developed as part of our academic learning to apply our knowledge of web development, database management, and programming.

## Main Features

### For Students

* Create a student account and log in.
* View available campus events.
* Search and filter events by category.
* Register for events they want to attend.
* View their registered events.
* Cancel registrations when allowed.
* Check their attendance status.

### For Administrators

* Log in using an administrator account.
* Add new campus events.
* Update event information.
* Delete events.
* View students who registered for an event.
* Manage student attendance.
* Mark students as Present or Absent.

## Technologies Used

We used the following technologies to develop the system:

**Frontend**

* React.js
* Vite
* JavaScript
* HTML
* CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Authentication and Security**

* JSON Web Token (JWT)
* bcryptjs for password hashing

**Development Tools**

* Visual Studio Code
* Git and GitHub
* MongoDB

## Project Structure

```text
campus-event-management/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── BrowseEvents.jsx
│   ├── MyRegistrations.jsx
│   ├── StudentRegister.jsx
│   └── ...
│
├── index.html
├── package.json
└── README.md
```

## How to Install and Run the Project

Follow these steps if you want to run the project on your computer.

### 1\. Clone the Repository

Open your terminal and enter:

```bash
git clone https://github.com/jeppheyyy/campus-event-management.git
```

### 2\. Open the Project Folder

```bash
cd campus-event-management
```

### 3\. Install Frontend Dependencies

```bash
npm install
```

### 4\. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5\. Set Up the Environment Variables

Inside the backend folder, create a file named `.env` and add the following:

```env
PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/campus\_event\_management

JWT\_SECRET=your\_own\_secure\_secret

FRONTEND\_URL=http://localhost:5173

```

Make sure MongoDB is installed and running on your computer.

**Reminder:** Do not upload your actual `.env` file to GitHub because it contains private configuration information.

## How to Run the System

You need to open two separate terminals to run the frontend and backend.

### Start the Backend

In the first terminal:

```bash
cd backend
npm run dev
```

The backend will run at:

`http://localhost:5000`

### Start the Frontend

In the second terminal, go back to the main project folder and run:

```bash
npm run dev
```

After that, open the local address displayed in your terminal. Usually, it is:

`http://localhost:5173`

## Database Information

This project uses MongoDB to store the information needed by the system, such as:

* Student and administrator accounts
* Campus events
* Student registrations
* Attendance records

The database name is `campus\\\_event\\\_management`.

## GitHub Repository

You can view the source code of this project here:

https://github.com/jeppheyyy/campus-event-management

## Project Goal

The main goal of this project is to make campus event registration and attendance monitoring easier and more organized. It also helps us improve our skills in building a full-stack web application using React, Node.js, Express, and MongoDB.
