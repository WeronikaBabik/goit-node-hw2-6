const app = require("./app");
const database = require("./database");

const server = async () => {
  try {
    await database.connect();
    console.log("Database connection successful.");
    app.listen(3000, async () => {
      console.log(`Server running. Use our API on port: 3000`);
    });
  } catch (e) {
    console.error(e.message);
  }
};
server();
