const express = require('express');
const apiRouter = express.Router();

// Each endpoint is handled in its own router. These routers are required in here and mounted in the apiRouter.
const minionsRouter = require('./routes/minions');
const ideasRouter = require('./routes/ideas');
const meetingsRouter = require('./routes/meetings');

// '/api/minions' route
apiRouter.use('/minions', minionsRouter);
// '/api/ideas' route
apiRouter.use('/ideas', ideasRouter);
// '/api/meetings' route
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;