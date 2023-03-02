const express  = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

//Set up a nodeserver that returns an object when you visit localhost:4000/api
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello World",
    })
})
//LISTEN ON port
app.listen(PORT, () => {
    console.log (`server listening on ${PORT}`)
})