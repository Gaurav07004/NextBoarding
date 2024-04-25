require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router/auth_router.js");
const connectDB = require("./utils/UserDatabase.js");
const cors = require("cors");

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ limit: '1gb', extended: true }));

app.use("/api/auth", router);

const PORT = 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    });
});
