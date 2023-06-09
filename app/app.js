import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoute.js';
import productsRoute from '../routes/productsRoute.js';
import categoriesRoute from '../routes/categoriesRoute.js';
import brandsRoute from '../routes/brandsRoute.js';
import colorsRoute from '../routes/colorsRoute.js';
import reviewsRoute from '../routes/reviewsRoute.js';
import ordersRoute from '../routes/ordersRoute.js';
import couponsRouter from '../routes/couponsRouter.js';
import {
	globalErrorHandler,
	notFound,
} from '../middlewares/globalErrorHandler.js';

dbConnect();

const app = express();

// pass incoming data
app.use(express.json());

// routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productsRoute);
app.use('/api/v1/categories/', categoriesRoute);
app.use('/api/v1/brands/', brandsRoute);
app.use('/api/v1/colors/', colorsRoute);
app.use('/api/v1/reviews/', reviewsRoute);
app.use('/api/v1/orders/', ordersRoute);
app.use('/api/v1/coupons/', couponsRouter);

// error middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;
