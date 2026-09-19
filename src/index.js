const app = require("./app.js");

const port = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Add it to Get-Youtube-Subscribers/.env");
  process.exit(1);
}

app.listen(port, () => console.log(`App listening on port ${port}!`));
