import carRouter from "./routes/carRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRoutes.js";
import { cloudinaryConnect } from "./clodinary/cloudinaryConnect.js";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests


dbConnection();
cloudinaryConnect();
app.use(errorMiddleware);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/car", carRouter);


app.get("/",(req,res) => {
    res.send("Hello world! ");
})



export default app;