import dotenv from "dotenv";
import express from "express";
import connnectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import aiRoute from "./routes/ai.route.js";
import userRoute from "./routes/user.route.js";
import workspaceRoute from "./routes/workspace.route.js"
import cors from "cors"

dotenv.config({
    path: "./.env"
})

const app = express();
const port = process.env.PORT || 5000;

//cors
const allowedOrigins = ["http://localhost:8000", "http://localhost:5173"];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow credentials
};

app.use(cors(corsOptions));

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/workspace", workspaceRoute);


connnectDB();

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
