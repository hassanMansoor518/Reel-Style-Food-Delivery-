require('dotenv').config();
const app = require("./app");


const Port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("FoodItem Backend");
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(Port, () => {
    console.log(`Server running at http://localhost:${Port}`);
  });
}

module.exports = app;