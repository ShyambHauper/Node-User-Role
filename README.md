User-Role Management API

This project is a Node.js Express application for managing users and roles, including CRUD operations, user access checks, and bulk updates. It uses MongoDB as the database and JWT for authentication.

# Project Setup

1. Clone the Repository
   https://github.com/ShyambHauper/Node-User-Role.git
   cd Node-User-Role

2. Install Dependencies
   npm install

3. Environment Variables
   Create a .env file in the root directory with the following content:

PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your_jwt_secret_key

# API Endpoints

User Endpoints

1. Get Users
   URL: /api/v1/users/
   Method: GET
   Auth Required: Yes
   Description: Fetch all users with role details.

2. Update Many Users (Same Data)
   URL: /api/v1/users/update-many-same
   Method: PATCH
   Auth Required: Yes

3. Update Many Users (Different Data)
   URL: /api/v1/users/update-many-different
   Method: PATCH
   Auth Required: Yes

4. Check User Access
   URL: /api/v1/users/check-access
   Method: POST
   Auth Required: Yes

5. Update User
   URL: /api/v1/users/:id
   Method: PUT
   Auth Required: Yes

6. Delete User
   URL: /api/v1/users/:id
   Method: DELETE
   Auth Required: Yes

7. Singup User
   URL: /api/v1/auth/signup
   Method: POST
   Auth Required: No

8. Login User
   URL: /api/v1/auth/login
   Method: POST
   Auth Required: No

# Role Endpoints

1. Create Role
   URL: /api/v1/roles
   Method: POST
   Auth Required: Yes

2. Get All Roles
   URL: /api/v1/roles
   Method: GET
   Auth Required: Yes

3. Update Role
   URL: /api/v1/roles/:id
   Method: PATCH
   Auth Required: Yes

4. Delete Role
   URL: /api/v1/roles/:id
   Method: DELETE
   Auth Required: Yes

5. Update Access Modules
   URL: /api/v1/roles/modules/:id
   Method: PATCH
   Auth Required: Yes

Validation Rules
Each endpoint has associated validation middleware to ensure the correctness of the data. The validation rules are defined in middlewares/validation.js.

# Running the Project

# Start the Server

bash
Copy code
npm start
The server will run on http://localhost:5000.

# Testing the API

Use tools like Postman or curl to test the API endpoints. Ensure you include the JWT token in the Authorization header for authenticated routes.
