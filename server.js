const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        message: "This is the SoftwareCo interview task.",
        liveURL: "https://node-user-role-fzahu0411-shyambhalodias-projects.vercel.app/",
        gitURL: "https://github.com/ShyambHauper/Node-User-Role.git",
        postmanCollection: "",
    });
});


// Connect to DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/roles', require('./routes/roleRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
