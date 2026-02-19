const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");
const connectDB = require("./config/database");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const limiter = require("./middleware/limiter");
require("dotenv").config();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const gameRouter = require("./routes/game");
const User = require("./models/user");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Connect to MongoDB
connectDB();

// Security & Optimization Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "https:"],
        },
    },
}));
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS
app.use(limiter); // Apply rate limiting

// Setup EJS engine and Layouts

// Setup EJS engine and Layouts
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layout"); // active layout file in views/layout.ejs
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); // For form handling

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_chess_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Global variables middleware
app.use(async (req, res, next) => {
    res.locals.user = null;
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            res.locals.user = user;
        } catch (err) {
            console.error(err);
        }
    }
    next();
});

// Routes
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", gameRouter);
// Mount auth routes at root level for /login, /signup

// 404 Handler
app.use((req, res, next) => {
    res.status(404).render('index', { title: '404 Not Found', body: '<h1>Page Not Found</h1>' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Socket.io connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

