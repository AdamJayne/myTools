const { v4: uuid } = require('uuid');

// Temporary lists before adding database
let currentTodos = {
  backlog: {
    current: [],
    completed: []
  },
  active: {
    current: [],
    completed: []
  },
  crucial: {
    current: [],
    completed: []
  }
};

module.exports = (fastify, options, done) => {
  /*
    3 columns: Backlog, Active, Crucial
    Items: Title, Description, Notes, Checklist (complted, title)

    CRUD:
    Create new items in a specific column
    Ability to move items between columns
    Ability to modify an item's details
  */

  fastify.get('/mine', async (request, reply) => {
    // Needed: The user
    return currentTodos;
  });

  // Create a new item Route
  fastify.post('/new', async (request, reply) => {
    // Needed: The user, The column, The title
    try {
      const { title, column } = request.body;
      const newItem = {
        id: uuid(),
        title,
        complete: false
      }
      currentTodos[column].current.push(newItem);
      return {
        message: "Created new post",
        id: newItem.id
      }
    } catch (e) {
      reply.code(500).send({
        message: "Failed to create new post"
      });
    }
  });

  // Move Item Route
  fastify.put('/move', async (request, reply) => {
    // Needed: The item's ID, The source column, The destination column, The position

    // Process: Remove and capture item from source column, place it in the destination column at the position
    try {
      const { sourceColumn, destinationColumn, id, position } = request.body;
      let theItem = currentTodos[sourceColumn].current.splice(currentTodos[sourceColumn].current.findIndex(item => item.id === id), 1)[0];
      currentTodos[destinationColumn].current.splice(position, 0, theItem);
      return {
        message: `Moved item( ${ id } ) from ${ sourceColumn } to ${ destinationColumn } at position ${ position }`
      }
    } catch (e) {
      reply.code(500).send({
        message: "Failed to move item"
      });
    }
  });

  // Modify item in column Route
  fastify.put('/edit', async (request, reply) => {
    // Needed: The item's ID, the current column, the new data
    try {
      const { id, column, data } = request.body;
      let position = currentTodos[column].current.findIndex(item => item.id === id);
      let item = {
        id,
        ...data
      }
      currentTodos[column].current[position] = item;
      return {
        message: `Item ( ${ id } ) has been modified`
      }
    } catch (e) {
      reply.code(500).send({
        message: "Failed to edit item"
      });
    }
  });

  fastify.put('/complete', async (request, reply) => {
    // Needed: The item's ID, the current column
    try {
      const { id, column } = request.body;
      let position = currentTodos[column].current.findIndex(item => item.id === id);
      currentTodos[column].current[position].complete = true;
      return {
        message: `Item ( ${ id } ) has been completed`
      }
    } catch (e) {
      reply.code(500).send({
        message: "Failed to complete item"
      });
    }
  });

  done();
}