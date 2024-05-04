const app = require("./app");
const config = require("./Config");

const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
