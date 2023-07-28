import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();
const app = express();
const PORT = 9000;
import file from "./data.json" assert { type: "json" };
import userList from "./users.json" assert { type: "json" };

// Set up
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

// const users = [];

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

//GET request response giving available endpoints
app.get("/info", (req, res) => {
  res.render("info", { data: file });
});

app.post("/users", async (req, res) => {
  try {
    const hashedPw = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPw };
    userList.push(user);
    res.status(201);
    res.send();
  } catch {
    res.status(500);
    res.send("can't create user");
  }
});

app.post("/users/login", async (req, res) => {
  const user = userList.find((user) => user.name === req.body.name);
  if (user == null) {
    res.status(400);
    res.send("cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken }).send("login succesful");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500);
    res.send();
  }
});

app.get("/users", authToken, (req, res) => {
  res.json(userList);
});

// app.post('/users/login', (req,res)=> {
//   const username = req.body.username
//   const user = {name: username}
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//   res.json({accessToken: accessToken})
// })



//GET request response giving the entire JSON array for all recipes
app.get("/:api_key", authToken, (req, res) => {
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
