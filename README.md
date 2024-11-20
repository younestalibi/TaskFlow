# Laravel & Remix Task Management System

<div style="border: 1px solid #ddd; padding: 20px; border-radius: 5px; background: #f9f9f9;">
  <h2>Overview</h2>
  <p>
    This project is a <strong>Task Management System</strong> built using 
    <a href="https://laravel.com/">Laravel</a> for the backend and 
    <a href="https://remix.run/">Remix</a> for the frontend. It offers features like user authentication, 
    profile management, task lists, task sharing, and task status updates.
  </p>
</div>

## Features

<ul>
  <li>User registration and authentication (JWT-based)</li>
  <li>Profile management (update profile information, password update, delete account)</li>
  <li>Task management (CRUD operations for tasks and task lists)</li>
  <li>Task sharing and search for users</li>
</ul>

---

## Installation Without Docker

<pre style="background: #eef; padding: 10px; border-radius: 5px;">
# Clone the repository
git clone https://github.com/younestalibi/TaskFlow.git

# Navigate into the project directory
cd TaskFlow

# Install Node.js dependencies (node:21)
cd frontend
npm install
npm run dev

# Set environment variables
cp .env.example .env
uncomment VITE_BASE_URL=http://localhost:8000/api if you are not using docker

cd backend
# Install PHP dependencies (PHP:8.2)
composer install

# Set environment variables
cp .env.example .env
php artisan key:generate
php artisan jwt:secret 
php artisan migrate
php artisan serve
</pre>

---

## Installation With Docker

<pre style="background: #eef; padding: 10px; border-radius: 5px;">
# Clone the repository
git clone https://github.com/younestalibi/TaskFlow.git

# Navigate into the project directory
cd TaskFlow

# Build and start the Docker containers
docker-compose up --build 

# Generate APP KEY inside the Laravel container
docker exec -it backend php artisan key:generate

# Generate JWT secret inside the Laravel container
docker exec -it backend php artisan jwt:secret

# Run migrations inside the Laravel container
docker exec -it backend php artisan migrate

</pre>

> **Note:** Ensure Docker and Docker Compose are installed on your machine before proceeding. Containers for the Laravel backend, database, and Node.js will be set up automatically.

---

## Backend Routes

---

<div style="border-left: 4px solid #0056b3; padding-left: 15px; margin: 20px 0;">
  <h3>Authentication Endpoints</h3>
  <ul>
    <li><code>POST /logout</code>: User logout</li>
    <li><code>GET /me</code>: Retrieve user details</li>
    <li><code>POST /login</code>: User login</li>
    <li><code>PUT /profile/update</code>: update user information</li>
    <li><code>PUT /profile/update-password</code>: update user's password</li>
    <li><code>DELETE /profile/delete</code>: Delete user account</li>
  </ul>
</div>

---

<div style="border-left: 4px solid #0056b3; padding-left: 15px; margin: 20px 0;">
  <h3>Task List Endpoints</h3>
  <ul>
    <li><code>GET /tasklists</code>: Fetch all task lists</li>
    <li><code>POST /tasklists</code>: Create a new task list</li>
    <li><code>PUT /tasklists/{id}</code>: Update a task list</li>
    <li><code>DELETE /tasklists/{id}</code>: Delete a task list</li>
    <li><code>POST /tasklists/{id}/share</code>: Share a task list</li>
    <li><code>GET /tasklists/shared/get</code>: Fetch shared task lists</li>
  </ul>
</div>

---

<div style="border-left: 4px solid #0056b3; padding-left: 15px; margin: 20px 0;">
  <h3>Task Endpoints</h3>
  <ul>
    <li><code>POST /tasks</code>: Create a new task</li>
    <li><code>PUT /tasks/{id}</code>: Update a task</li>
    <li><code>PUT /tasks/{task}/update-status</code>: Update a task status</li>
    <li><code>DELETE /tasks/{id}</code>: Delete a task</li>
   
  </ul>
</div>

---

## Frontend

<p>The frontend is built using <strong>Remix</strong>. Key features:</p>
<ul>
  <li>Responsive design with Mantine UI</li>
  <li>Component-based architecture using Remix conventions</li>
  <li>API integration with the Laravel backend</li>
</ul>

---

<div style="text-align: center; font-size: 0.9em;">
  <p>&copy; 2024 Younes Talibi.</p>
</div>
