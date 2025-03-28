# AnimeCrush
AnimeCrush
AnimeCrush is a web application that allows users to explore anime characters, mark them as their favorite, and maintain a personalized list. The app uses Google Authentication for secure login and provides users with the ability to create and manage their anime crushes. It leverages a full-stack setup with React on the frontend and Node.js/Express on the backend, with MongoDB as the database.

Features
User Authentication: Secure login using Google OAuth.

Anime List Management: Add, view, and remove anime characters from your favorites list.

Responsive UI: Optimized for both desktop and mobile devices.

CRUD Operations: Create, read, update, and delete favorite anime characters.

API Integration: Fetches data dynamically using external APIs.

Tech Stack
Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: Google OAuth 2.0

Version Control: Git & GitHub

Installation and Setup
To get the application running on your local machine, follow these steps:

1. Clone the repository:
bash
Copy
Edit
git clone https://github.com/NileshMundotia/AnimeCrush.git
cd AnimeCrush
2. Install dependencies:
Navigate to the root directory and install the backend dependencies:

bash
Copy
Edit
npm install
Navigate to the client directory and install the frontend dependencies:

bash
Copy
Edit
cd client
npm install
3. Environment Variables:
Create a .env file in the root directory. This file will hold your environment variables such as your Google OAuth credentials and MongoDB connection string.

Example .env file:

bash
Copy
Edit
# MongoDB
MONGO_URI=your_mongo_db_connection_string

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=5000
Note: The .env file is excluded from version control as it contains sensitive information. Make sure not to commit it to GitHub.

4. Running the Application:
Start the backend server:

bash
Copy
Edit
npm start
Start the frontend server:

bash
Copy
Edit
cd client
npm start
The application should now be running locally at http://localhost:3000.

Usage
Once the app is running, you can:

Login using your Google account.

Browse anime characters and add your favorites to the list.

Manage your list, including adding new characters, editing entries, or removing them.

Contributing
Feel free to open issues or submit pull requests if you'd like to contribute to the project. Contributions are welcome and appreciated!

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Acknowledgements
Google OAuth for authentication.

MongoDB for database management.

All contributors and the open-source community for inspiration and support.
