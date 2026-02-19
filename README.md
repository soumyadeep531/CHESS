# Real-Time Multiplayer Chess Game

A modern, real-time multiplayer chess application built with Node.js, Express, and Socket.io. This project allows users to play chess against each other in real-time, featuring a responsive UI and secure authentication.

## 🚀 Features

-   **Real-Time Gameplay**: seamless multiplayer experience using Socket.io.
-   **User Authentication**: Secure login and signup functionality.
-   **Responsive Design**: Built with TailwindCSS for a mobile-friendly interface.
-   **Spectator Mode**: Watch live games (if implemented).
-   **Security**: Implements Helmet for headers, Rate Limiting, and CORS protection.
-   **Performance**: Uses compression for faster load times.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (with Mongoose)
-   **Real-Time Communication**: Socket.io
-   **Frontend**: EJS (Templating), HTML5, CSS3, TailwindCSS
-   **Authentication**: detailed session management with `express-session` and `bcryptjs`
-   **Tools**: Nodemon (dev), Dotenv

## 📂 Project Structure

```bash
chess-game/
├── config/             # Database configuration
├── middleware/         # Custom middleware (rate limiters, auth checks)
├── models/             # Mongoose models (User, Game)
├── public/             # Static assets (JS, CSS, Images)
├── routes/             # Application routes
├── views/              # EJS templates
├── server.js           # Entry point
└── .env                # Environment variables
```

## ⚙️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (Local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/soumyadeep531/CHESS.git
cd chess-game
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

### 4. Run the Application

**Development Mode (with Nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 5. Access the App

Open your browser and visit: `http://localhost:3000`

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.
