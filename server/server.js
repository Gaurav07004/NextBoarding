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

app.use(cors (corsOptions));

app.use(express.json());

app.use("/api/auth", router);

const PORT = 5000;
connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("server is on");
    });
});