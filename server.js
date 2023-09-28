const express = require("express");
const http = require("http")
const app = express();
const server = http.createServer(app)
//console.log(server)
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })

  socket.on(
    "callUser",
    (data) => {
      io.to(data.userToCall).emit("callUser",
        {
          signal: data.signalData,
          from: data.from,
          name: data.name
        })
    }
  )

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
})
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

require("dotenv").config();
const morgan = require('morgan');
//const fetch = require("node-fetch");

const dbConfig = require("./config/dbConfig");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");
const path = require("path");

const fileUpload = require('express-fileupload')
app.use(fileUpload(
  {
    useTempFiles: true,
    // tempFileDir: '/tmp/',
    // createParentPath: true,
  }
));
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(5001, () => console.log("server is running on port 5001"))
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));