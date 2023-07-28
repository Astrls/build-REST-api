import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 9000;
import file from "./data.json" assert { type: "json" };

// Set up
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

//Middleware to check api_key in request parameters against .env key
const authChecker = (req, res, next) => {
  if (process.env.APIKEY === req.params.api_key) {
    next();
  } else {
    res.send("please provide your valid API key as a parameter");
  }
};

//GET request response giving available endpoints
app.get("/info", (req, res) => {
  res.render("info", { data: file });
});

//GET request response giving the entire JSON array for all recipes
app.get("/:api_key", authChecker, (req, res) => {
  res.send(file);
});

//GET request responses giving the JSON object for each recipe
for (let i = 0; i < file.length; i++) {
  app.get(`/recipe${i + 1}/:api_key`, (req, res) => {
    res.send(file[i]);
  });
}

//serving app on localhost
app.listen(PORT, () => console.log("Server live on http://localhost:" + PORT));
