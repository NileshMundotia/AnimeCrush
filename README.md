# AnimeCrush
AnimeCrush is a web application that allows users to search for and explore their favorite anime titles using the Jikan API. Users can register and log in to the site either via local authentication or Google OAuth2. Additionally, users can view detailed information about each anime and watch trailers or videos related to the anime titles.

Table of Contents
Features

Installation

Environment Variables

API Usage

Views and Routes

Technologies Used

License

Features
User Registration and Authentication:

Users can register an account using their email and password.

Local login using Passport.js and bcrypt for password hashing.

Google OAuth2 login using Passport.js.

Anime Search:

Search for anime using the Jikan API.

View details about the anime including title, synopsis, and related videos.

Secure Sessions:

Sessions are managed using express-session and stored securely.

Responsive UI:

Clean and minimal design for easy navigation.

Logout Functionality:

Users can log out of their accounts securely.

Installation
Clone this repository to your local machine:

bash
Copy
Edit
git clone https://github.com/your-username/AnimeCrush.git
Navigate to the project directory:

bash
Copy
Edit
cd AnimeCrush
Install the dependencies:

bash
Copy
Edit
npm install
Set up a PostgreSQL database and create a users table with email and password fields.

Set up your environment variables by creating a .env file in the root directory:

bash
Copy
Edit
touch .env
Add the following keys to the .env file and replace the values with your own:

pgsql
Copy
Edit
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_HOST=localhost
PG_DATABASE=animecrush
PG_PORT=5432
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
NODE_ENV=development
Run the application:

bash
Copy
Edit
npm start
The server will start at http://localhost:3000.

Environment Variables
The project requires the following environment variables to be set:

PG_USER: PostgreSQL username

PG_PASSWORD: PostgreSQL password

PG_HOST: PostgreSQL host (usually localhost)

PG_DATABASE: The name of the PostgreSQL database

PG_PORT: The port number of PostgreSQL (usually 5432)

GOOGLE_CLIENT_ID: Your Google OAuth2 client ID

GOOGLE_CLIENT_SECRET: Your Google OAuth2 client secret

SESSION_SECRET: A secret key for session encryption

NODE_ENV: The environment mode (development or production)

API Usage
AnimeCrush uses the Jikan API to fetch data about anime. The API allows searching for anime based on a query, and returns details like title, synopsis, and more.

Example API call for anime search:

bash
Copy
Edit
GET https://api.jikan.moe/v4/anime?q=<search_query>&limit=15
Views and Routes
/: The homepage.

/login: Displays the login page.

/register: Displays the registration page.

/logout: Logs the user out and redirects them to the homepage.

/anime: Displays the anime search page.

/video_playback: Displays the video playback page for selected anime trailers.

/auth/google: Google OAuth2 login route.

/auth/google/secrets: Google OAuth2 callback route.

Technologies Used
Backend:

Node.js

Express.js

PostgreSQL (pg module for database connection)

Passport.js for authentication (local and Google OAuth2)

Bcrypt for password hashing

Jikan API for anime data

Frontend:

EJS for templating

CSS for styling

Axios for API requests

Morgan for logging HTTP requests

License
This project is licensed under the MIT License.
