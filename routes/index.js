import usersRouter from './users.js';
import addressesRouter from './addresses.js'
import ordersRouter from './orders.js';
import productsRouter from './products.js';
import authRouter from './auth.js';
import promosRouter from './promos.js';
import commentsRouter from './comments.js';

const mountRouter = app => {
    app.use('/auth', authRouter);
    app.use('/addresses', addressesRouter);
    app.use('/users', usersRouter);
    app.use('/orders', ordersRouter);   // todo
    app.use('/products', productsRouter);
    app.use('/promos', promosRouter);
    app.use('/comments', commentsRouter);
}

export default mountRouter;