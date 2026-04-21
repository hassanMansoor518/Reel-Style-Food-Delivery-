require('dotenv').config()
const app = require("./app");
const connectDB = require("./db/db");
connectDB();
const Port = process.env.PORT
app.get("/", (req, res) => {
  res.send("home page");
});


app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}`);
});
