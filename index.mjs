import express from "express";
const app = express();
const PORT = 9000;
import file from "./data.json" assert { type: "json" };



// const postman = require('postman');
app.set('view engine','ejs')

app.use(express.json());
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send(file);
});

app.get("/info", (req, res) => {
  // res.send("coucou")
  res.render('info', {data: file});
});

for (let i = 1; i <= file.length; i++){
app.get(`/recipe${i}`, (req,res)=> {
    res.send(file[i-1])
}) 
}


app.listen(PORT, () => console.log("Server live on http://localhost:" + PORT));
