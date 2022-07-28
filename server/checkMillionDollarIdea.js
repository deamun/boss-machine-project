/* ===== Custom Middleware to ensure that any new or updated ideas are still worth at least one million dollars ===== */
const checkMillionDollarIdea = (request, response, next) => {
    // Request body will contain the idea object. Extract the number of weeks and weekly revenue properties.
    const { numWeeks, weeklyRevenue } = request.body;

    const totalValue = Number(numWeeks) * Number(weeklyRevenue);

    // Validate information given to function:
    // If number of weeks or weekly revenue are missing, or the ideas total value is not a number, or if the ideas value is less than one million, respond with a 400 status code (Bad Request) indicating client error, and an empty response object. 
    // Otherwise, pass control to the next middleware in the stack.

    if (!numWeeks || !weeklyRevenue || isNaN(totalValue) || totalValue < 1000000) {
        response.status(400).send();
    } else {
        next();
    }
};

module.exports = checkMillionDollarIdea;
