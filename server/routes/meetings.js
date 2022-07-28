/* ============================== Router to handle all '/api/meetings' routes ============================== */

/* -------------------- Requirements -------------------- */
const express = require('express');
const meetingsRouter = express.Router();
const {
    addToDatabase,
    createMeeting,
    deleteAllFromDatabase,
    getAllFromDatabase
} = require('../db');

/* -------------------- GET Requests -------------------- */
// GET an array of all meetings:
meetingsRouter.get('/', (request, response, next) => {
    const allMeetings = getAllFromDatabase('meetings');
    response.status(200).send(allMeetings);
});

/* -------------------- POST Requests ------------------- */
// POST a new meeting object to the database:
meetingsRouter.post('/', (request, response, next) => {
    // addToDatabase() will accept a new meeting object to be added to the database. It will perform validation on the meeting object and throw an appropriate error if any of the properties are missing/invalid. It returns the meeting object that was added.
    // createMeeting() will create and return a new meeting object.
    const newMeeting = addToDatabase('meetings', createMeeting());
    response.status(201).send(newMeeting);
});

/* -------------------- DELETE Requests ------------------- */
// DELETE all meeting objects from the database:
meetingsRouter.delete('/', (request, response, next) => {
    deleteAllFromDatabase('meetings');
    response.status(204).send();
});

module.exports = meetingsRouter;