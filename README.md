# AnimeCrush
AnimeCrush is a full-stack web application that allows users to explore, save, and manage their favorite anime characters. The app uses Google OAuth for user authentication and provides a set of RESTful APIs for CRUD operations on anime data. PostgreSQL is used as the database, handling the persistence of users' favorite characters and other related data.

Features
User Authentication: Google OAuth for secure user login.

Anime Character Management: Users can add, view, update, and remove their favorite anime characters.

REST API: Implements a robust RESTful API for CRUD operations.

PostgreSQL Integration: Data persistence using PostgreSQL as the relational database.

Responsive Design: User interface built for both desktop and mobile devices.

Tech Stack
Frontend: React.js

Backend: Node.js, Express.js

Database: PostgreSQL

Authentication: Google OAuth 2.0

API: REST API using Express.js

Installation and Setup
1. Clone the repository:
bash
Copy
Edit
git clone https://github.com/NileshMundotia/AnimeCrush.git
cd AnimeCrush
2. Install dependencies:
Install backend dependencies:

bash
Copy
Edit
npm install
Navigate to the client directory and install frontend dependencies:

bash
Copy
Edit
cd client
npm install
3. Environment Variables:
Create a .env file in the root directory with your environment variables for PostgreSQL, Google OAuth, and other configurations.

Example .env file:

bash
Copy
Edit
# PostgreSQL Database Connection
PGHOST=localhost
PGUSER=your_db_user
PGDATABASE=animecrush_db
PGPASSWORD=your_db_password
PGPORT=5432

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=5000
Note: Ensure the .env file is not committed to version control as it contains sensitive information.

4. Setup PostgreSQL Database:
Before running the app, ensure PostgreSQL is installed and running on your machine. Create the required database and tables.

Create a database in PostgreSQL:

bash
Copy
Edit
createdb animecrush_db
Run the SQL scripts or migrations to set up your tables.

5. Running the Application:
Start the backend server:

bash
Copy
Edit
npm start
Start the frontend React app:

bash
Copy
Edit
cd client
npm start
Now, the app should be running on http://localhost:3000.

API Endpoints
The backend exposes a set of RESTful API endpoints to interact with the PostgreSQL database.

Authentication (Google OAuth)
POST /auth/google - Handle user login via Google OAuth.

Anime Character API:
GET /api/anime - Get a list of all anime characters saved by the user.

POST /api/anime - Add a new anime character to the user's favorites.

PUT /api/anime/:id - Update details of a specific anime character.

DELETE /api/anime/:id - Remove an anime character from the user's favorites.

User API:
GET /api/users - Fetch details about the authenticated user.

Contributing
Contributions are welcome! Feel free to submit pull requests, report bugs, or suggest new features by opening issues on the GitHub repository.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Acknowledgements
Google OAuth for user authentication.

PostgreSQL for robust database management.

The open-source community for tools and libraries used in this project.

