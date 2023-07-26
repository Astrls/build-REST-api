import express from "express";
const app = express();
const PORT = 9000;
import file from "./data.json" assert { type: "json" };

app.set('view engine','ejs')
app.use(express.json());
app.use(express.static("public"));

//GET request response giving the entire JSON array for all recipes
app.get("/", (req, res) => {
  res.send(file);
});

//GET request response giving available endpoints
app.get("/info", (req, res) => {
  res.render('info', {data: file});
});

//GET request responses giving the JSON object for each recipe
for (let i = 1; i <= file.length; i++){
app.get(`/recipe${i}`, (req,res)=> {
    res.send(file[i-1])
}) 
}


app.listen(PORT, () => console.log("Server live on http://localhost:" + PORT));
