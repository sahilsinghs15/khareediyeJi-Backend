import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/errormiddleware.js";

//to load the .dotenv file
configDotenv();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const corsOptions = {
  origin: 'http://localhost:5173', // Specify the exact origin
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(cookieParser());

app.get("/" , (_req , res)=>{
    res.send("Pong");
})

app.use("/api/v1/user" ,userRoutes );

//return 404 for other routes
app.use("*" , (_req, res)=>{
    res.send("This Page does not exist , 404");
});

//Custom Error Handling
app.use(errorMiddleware);

export default app;
