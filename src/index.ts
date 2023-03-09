import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import converterRouter from "./routes/converter.routes";

const app = express();

// set up middlewares
app.use(cors());
app.use(fileUpload());

// uncomment this line to serve static files from the processed folder
// app.use(express.static("processed"));

app.use("/converter", converterRouter);


// serve html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
