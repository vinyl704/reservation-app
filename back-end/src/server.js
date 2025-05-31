const app = require("./app");
const knex = require("./db/connection");
const { PORT = 5001 } = process.env;
const port = PORT

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(port, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${port}!`);
}
