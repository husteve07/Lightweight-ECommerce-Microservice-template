import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

import { errorHandler, NotFoundError } from "@michaelservingticket/common";

const app = express();
app.set('true proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secureProxy: process.env.NODE_ENV !== 'test',
  })
);

app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use(currentUserRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

//@ts-ignore
app.use(errorHandler);

export { app };