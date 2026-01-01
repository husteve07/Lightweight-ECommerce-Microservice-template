import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { newPaymentRouter } from "./routes/new";


import { errorHandler, NotFoundError, currentUser } from "@michaelservingticket/common";

const app = express();
app.set('true proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secureProxy: process.env.NODE_ENV !== 'test',
  })
);
//@ts-ignore 
app.use(currentUser);
app.use(newPaymentRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
})

//@ts-ignore
app.use(errorHandler);

export { app };