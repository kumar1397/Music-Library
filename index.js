const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;

// Use CORS middleware
app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());

// Connect to the database
const dbConnect = require("./config/database");
dbConnect();

// Parse URL-encoded data
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const auth = require("./routes/auth");
const user = require("./routes/user");
const album = require("./routes/album");
const artist = require("./routes/artist");
const track = require("./routes/track");
const favorite = require("./routes/favorite");


// Import and mount routes
app.use("/", auth);
app.use("/users", user);
app.use("/artists", artist);
app.use("/albums", album);
app.use("/tracks", track);
app.use("/favorites",favorite)

// Start the Express server
app.listen(PORT, () => {
  console.log(`Express server started at port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});
