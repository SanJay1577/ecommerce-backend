import express from "express";
import cors from 'cors'
import { mongoConnect } from "./db.js";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"; 
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { categoryRouter } from "./routes/category.js";
import { productRouter } from "./routes/product.js";
import { orderRouter } from "./routes/order.js";
import { paymentRouter } from "./routes/payment.js";



//environmental configuration 
dotenv.config(); 

//Database Connection
mongoConnect(); 

//server intialization 
const app = express(); 
const PORT = process.env.PORT; 

//middleware 


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet({crossOriginResourcePolicy: false}));

//for acces control errors this middile ware is used.
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//authentication route
app.use("/",authRouter);
app.use("/",userRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", orderRouter);
app.use("/",paymentRouter ); 
//Server Connections 

app.listen(PORT, ()=>console.log(`Server hosted in localhost:${PORT}`)); 

