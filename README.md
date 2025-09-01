Task List Web Application
A modern, interactive, and professional task management web application built as part of a job application process. The application allows users to create, edit, delete, and manage tasks with filtering and sorting capabilities. It is designed with a clean, responsive UI and robust backend, adhering to the specified requirements.
Features

Task Management:
Create tasks with attributes: Creation Date, Entity Name, Task Type, Task Time, Contact Person, Note (optional), and Status (open/closed, defaults to open).
Edit existing tasks via a modal form.
Delete tasks with confirmation.
Toggle task status between open and closed.


Filtering and Sorting:
Filter tasks by Entity Name, Task Type, Status, Creation Date, and Contact Person (Team Member).
Live filtering for text inputs (debounced for performance).
Sort tasks by any column (Creation Date, Entity Name, Task Type, Task Time, Contact Person) in ascending or descending order.


User Interface:
Responsive design using Bootstrap 5 with custom CSS for a polished, professional look.
Icons (Bootstrap Icons) for buttons, headers, and status indicators (e.g., check for open, x for closed).
Tooltips for better UX on buttons and filters.
Loading spinner during API calls.
Fade-in animations for task rows.
Client-side form validation with error feedback.
Clear Filters button to reset filters.


Backend:
RESTful API with Flask and SQLAlchemy, using SQLite for simplicity.
Supports all CRUD operations and filtering/sorting via query parameters.



Tech Stack

Backend: Python 3.10+, Flask, Flask-SQLAlchemy (SQLite database)
Frontend: HTML, CSS, JavaScript, Bootstrap 5 (via CDN), Bootstrap Icons (via CDN), Moment.js (via CDN)
Deployment: Render (free tier)

Prerequisites

Python 3.6+ (tested with 3.10)
Git
A code editor (e.g., VSCode)
Optional: Render account for deployment

Setup Instructions

Clone the Repository:
git clone https://github.com/yourusername/task-list-app.git
cd task-list-app


Create a Virtual Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies:
pip install -r requirements.txt


Run the Application:
python app.py

Open http://127.0.0.1:5000 in your browser.


Usage

Create a Task: Click the "Create Task" button to open a modal. Fill in the required fields (Entity Name, Task Type, Task Time, Contact Person) and optional Note. Click "Save".
Edit a Task: Click the pencil icon in the Actions column to edit a task in the modal.
Delete a Task: Click the trash icon and confirm deletion.
Toggle Status: Click the toggle icon (Open/Close) to change task status.
Filter Tasks: Use the filter inputs (Entity Name, Task Type, Status, Date, Contact Person). Text inputs filter live; others apply on change or "Apply Filters" click.
Sort Tasks: Click table headers to sort by that column (toggles between ascending/descending).
Clear Filters: Click the "Clear" button to reset all filters.

Deployment on Render

Push to GitHub:Ensure your repository is up-to-date:
git add .
git commit -m "Deploy-ready commit"
git push origin main


Set Up Render:

Sign up at render.com.
Create a new Web Service and connect your GitHub repository.
Configure:
Runtime: Python
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
Instance Type: Free


Deploy. Access the app via the provided Render URL (e.g., https://task-list-app.onrender.com).



Project Structure
task-list-app/
├── app.py                  # Flask application
├── models.py               # SQLAlchemy model for Task
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/styles.css      # Custom CSS
│   └── js/scripts.js       # JavaScript for interactivity
├── templates/
│   └── index.html          # Main HTML template
└── tasks.db                # SQLite database (generated on first run)

Notes

The application uses SQLite for simplicity, suitable for demo purposes. For production, consider a managed database like PostgreSQL.
The UI is optimized for both desktop and mobile devices.
The app avoids external dependencies beyond CDNs for Bootstrap, Bootstrap Icons, and Moment.js to minimize setup complexity.

License
MIT License - feel free to use and modify as needed.