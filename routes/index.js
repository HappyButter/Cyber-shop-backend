import usersRouter from './users.js';
import addressesRouter from './addresses.js'
import orderStatusRouter from './orderStatus.js';

const mountRouter = app => {
    app.use('/users', usersRouter);
    app.use('/addresses', addressesRouter);
    app.use('/order/status', orderStatusRouter)
}

export default mountRouter;