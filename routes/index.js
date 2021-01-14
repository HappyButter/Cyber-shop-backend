import usersRouter from './users.js';
import addressesRouter from './addresses.js'
import orderStatusRouter from './orderStatus.js';
import productsRouter from './products.js';
import authReducer from './auth.js';

const mountRouter = app => {
    app.use('/users', usersRouter);
    app.use('/addresses', addressesRouter);
    app.use('/order/status', orderStatusRouter);
    app.use('/products', productsRouter);
    app.use('/auth', authReducer);
}

export default mountRouter;