/* ============================== Router to handle all '/api/minions' routes ============================== */

/* -------------------- Requirements -------------------- */
const express = require('express');
const minionsRouter = express.Router();
// Helper functions for interacting with 'database'
const {
    addToDatabase,
    deleteFromDatabasebyId,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase
} = require('../db');

/* --------------------- Validation --------------------- */
// Minion ID validation:
minionsRouter.param('minionId', (request, response, next, id) => {
    // getFromDatabaseById uses array.find() to check if the provided id matches a minion's id in the database. If it is successful it will return a minion object, otherwise it will return 'undefined'.
    
    // If minion object retrieval was successful:
        // Add minion object to request object as a property and invoke the next middleware in the stack.
    // Otherwise send back a 404 (minion not found)

    const minion = getFromDatabaseById('minions', id);
    if (minion) {
        request.minion = minion;
        next();
    } else {
        response.status(404).send('Minion not found');
    }
});

// BONUS: Work ID validation:
minionsRouter.param('workId', (request, response, next, id) => {
    // Validation logic for work ID is identical to validation for minion ID above.
    const work = getFromDatabaseById('work', id);
    if (work) {
        request.work = work;
        next();
    } else {
        response.status(404).send('Work not found');
    }
});

/* -------------------- GET Requests -------------------- */
// GET an array of all minions:
minionsRouter.get('/', (request, response, next) => {
    const allMinions = getAllFromDatabase('minions');
    response.status(200).send(allMinions);
});

// GET a single minion by ID:
minionsRouter.get('/:minionId', (request, response, next) => {
    // Validation is handled based on the 'minionId' param above, with the correct minion object available as a property of the request object.
    response.status(200).send(request.minion);
});

// BONUS: GET an array of all work for the specified minion:
minionsRouter.get('/:minionId/work', (request, response, next) => {
    const minionId = request.minion.id;
    
    // Retrieve all work objects from the database.
    const allWork = getAllFromDatabase('work');
    // Filter all work objects by specified minion ID
    const minionWork = allWork.filter(work => work.minionId === minionId);

    response.status(200).send(minionWork);
});

/* -------------------- POST Requests ------------------- */
// POST a new minion to the array of all minions:
minionsRouter.post('/', (request, response, next) => {
    // addToDatabase() will accept the database model, and a minion object. It will check the validity of the minion object and throw an appropriate error if any of the minion's properties are invalid/missing. It returns the minion object that was added.
    // The request body will contain the minion object key-value pairs.

    const newMinion = addToDatabase('minions', request.body);
    response.status(201).send(newMinion);
});

// BONUS: POST a new work object for a specific minion:
minionsRouter.post('/:minionId/work', (request, response, next) => {
    const minionId = request.minion.id;
    // Request body will contain key-value pairs for the work object to be added.
    const workToBeAdded = request.body;

    // Add minion ID to the work object: link work object to specific minion.
    workToBeAdded.minionId = minionId;

    // addToDatabase() will validate the work object to ensure all properties are present/valid, then will add it to the work array and will return the work object that was added.
    const newWork = addToDatabase('work', workToBeAdded);
    response.status(201).send(newWork);
});

/* -------------------- PUT Requests -------------------- */
// Update a single minion by ID:
minionsRouter.put('/:minionId', (request, response, next) => {
    // Minion ID validation is handled in the .param() method above.
    // updateInstanceInDatabase will update a minion object in the database based on the ID of the minion object provided. It will validate the provided minion object and will return the updated minion object if successful, and 'null' if not.
    // The request body will contain the minion object key-value pairs to replace the ones in the database.

    const updatedMinion = updateInstanceInDatabase('minions', request.body);
    response.status(200).send(updatedMinion);
});

// BONUS: Update a single work by ID:
minionsRouter.put('/:minionId/work/:workId', (request, response, next) => {
    // Work ID and minion ID validation is performed in .param() method above.
    // Validate to ensure the correct minion ID is being updated -- User is not trying to change ID of minion.
    // If the minion ID in the request param object does not match the minion ID in the request body, respond with user error.
    // Otherwise, call updateInstanceInDatabase() and store the returned updated work object. Respond with appropriate status code and updated work object.
    const minionId = request.minion.id;
    if (minionId !== request.body.minionId) {
        response.status(400).send();
    } else {
        const updatedWork = updateInstanceInDatabase('work', request.body);
        response.status(200).send(updatedWork);
    }
});

/* -------------------- DELETE Requests ----------------- */
// DELETE a single minion by ID:
minionsRouter.delete('/:minionId', (request, response, next) => {
    // deleteFromDatabaseById() will delete a minion object from the database based on the minion ID provided. It will only delete minion object from the database if the IDs match. It will return 'true' upon a successful deletion, and 'false' if not.
    // The minion object that corresponds to the minion ID is stored as a property of the request object (validation occurs within .param() method above).
    // If the deletion is successful the response should have a status of 204 (no content), otherwise a status of 500 (internal server error) indicating the deletion was unsuccessful.
    // The response should not send anything back.
    const minionId = request.minion.id;
    const deleted = deleteFromDatabasebyId('minions', minionId);
    if (deleted) {
        response.status(204);
    } else {
        response.status(500);
    }
    response.send();
});

// BONUS: DELETE a single work by ID:
minionsRouter.delete('/:minionId/work/:workId', (request, response, next) => {
    // Delete logic is identical to deleting single minion by ID above.
    // Validation of work id occurs in .param() method above.
    const workId = request.work.id;
    const deleted = deleteFromDatabasebyId('work', workId);
    if (deleted) {
        response.status(204);
    } else {
        response.status(500);
    }
    response.send();
});

module.exports = minionsRouter;