import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrdersRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

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

app.use(deleteOrderRouter);
app.use(indexOrdersRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

//@ts-ignore
app.use(errorHandler);

export { app };