/* =================================== Router to handle all '/api/ideas' routes =================================== */

/* -------------------- Requirements -------------------- */
const express = require('express');
const ideasRouter = express.Router();
const {
    addToDatabase,
    deleteFromDatabasebyId,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase
} = require('../db');
const checkMillionDollarIdea = require('../checkMillionDollarIdea');

/* --------------------- Validation --------------------- */
ideasRouter.param('ideaId', (request, response, next, id) => {
    // getFromDatabaseById() uses array.find() to check if the provided ID matches an idea's id in the database. If it is successful it will return an 'idea' object, otherwise it will return 'undefined'.

    // If the idea exists in the database, add it to the request object and pass control to the next middleware in the stack. Otherwise respond with a 404 status code (Idea not found).
    const idea = getFromDatabaseById('ideas', id);
    if (idea) {
        request.idea = idea;
        next();
    } else {
        response.status(404).send('Idea not found');
    }
});

/* -------------------- GET Requests -------------------- */
// GET an array of all ideas:
ideasRouter.get('/', (request, response, next) => {
    const allIdeas = getAllFromDatabase('ideas');
    response.status(200).send(allIdeas);
});

// GET a single idea by ID:
ideasRouter.get('/:ideaId', (request, response, next) => {
    // Idea ID validation occurs in the .param() method above.
    response.status(200).send(request.idea);
});

/* -------------------- POST Requests ------------------- */
// POST a new idea object to the database:
// Check if new idea is a valid million dollar idea before adding to database by calling the checkMillionDollarIdea middleware.
ideasRouter.post('/', checkMillionDollarIdea, (request, response, next) => {
    // addToDatabase() will accept a new idea object to be added to the database. It will perform validation on the idea object and throw an appropriate error if any of the properties are missing/invalid. It returns the idea object that was added.
    // The request body contains the new idea object's key-value pairs.
    const newIdea = addToDatabase('ideas', request.body);
    response.status(201).send(newIdea);
});

/* -------------------- PUT Requests -------------------- */
// Update a single idea by ID:
// Check if idea being updated is still a valid million dollar idea.
ideasRouter.put('/:ideaId', checkMillionDollarIdea, (request, response, next) => {
    // Idea id validation is performed in the .param() method above.
    // updateInstanceInDatabase() will update an idea object in the database based on the ID of a provided idea object. It will perform validation on the idea object and will return the updated idea object if successful and 'null' if not.
    // The request body will contain the key-value pairs to be used to update the idea object.
    const updatedIdea = updateInstanceInDatabase('ideas', request.body);
    response.status(200).send(updatedIdea);
});

/* -------------------- DELETE Requests ----------------- */
// DELETE a single idea by ID:
ideasRouter.delete('/:ideaId', (request, response, next) => {
    // deleteFromDatabaseById() will delete an idea object from the database based on the idea ID provided. It will only delete the idea object from the database if the IDs match. It will return 'true' upon a successful deletion, and 'false' if not.
    // The idea ID is a property of the request parameters object.
    // If the deletion is successful the response should have a status of 204 (no content), otherwise a status of 500 (internal server error) indicating the deletion was unsuccessful.
    // The response should not send anything back.
    const deleted = deleteFromDatabasebyId('ideas', request.params.ideaId);
    if (deleted) {
        response.status(204);
    } else {
        response.status(500);
    }
    response.send();
});

module.exports = ideasRouter;