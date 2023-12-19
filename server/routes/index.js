const Router = require('express');
const mainRouter = require('./mainRouter');
const router = new Router();


router.use('/money',mainRouter);


module.exports = router;