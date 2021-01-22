import usersRouter from './users.js';
import addressesRouter from './addresses.js'
import ordersRouter from './orders.js';
import productsRouter from './products.js';
import authRouter from './auth.js';
import promosRouter from './promos.js';
import commentsRouter from './comments.js';
import categoryRouter from './category.js';
import productsServiceRouter from './productsService.js'

const mountRouter = app => {
    app.use('/auth', authRouter);
    app.use('/addresses', addressesRouter);
    app.use('/users', usersRouter);
    app.use('/orders', ordersRouter); 
    app.use('/products', productsRouter);
    app.use('/promos', promosRouter);
    app.use('/comments', commentsRouter);
    app.use('/category', categoryRouter);
    app.use('/service', productsServiceRouter);
}

export default mountRouter;