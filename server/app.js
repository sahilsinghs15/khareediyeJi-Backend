import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/errormiddleware.js";

//to load the .dotenv file
configDotenv();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
// app.use("/" , (_req , res)=>{
//     res.send("Pong");
// })

app.use("/api/v1/user" ,userRoutes );

//return 404 for other routes
app.use("*" , (_req, res)=>{
    res.send("This Page does not exist , 404");
});

//Custom Error Handling
app.use(errorMiddleware);

export default app;
