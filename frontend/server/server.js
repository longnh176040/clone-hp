var http = require("http"),
  bodyParser = require("body-parser"),
  path = require("path");
http = require("http");
isProduction = false;

if (!isProduction) {
  require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
}

var app = require("./app");

if (!isProduction) {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

/// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// process.on('uncaughtException', function (err) {
//   console.log(err);
// })

const server = http.Server(app);

// Socket setup

const _socket = require("./socket");
const io = _socket.init(server);

io.on("connection", async (socket) => {
  socket.on("setSocketCredential", (userData) => {
    if (userData.role === "user") {
      _socket.addUser(userData);
      io.emit("user", userData);
    } else {
      _socket.addAdmin(userData);
    }
  });

  socket.on("disconnect", (reason) => {
    _socket.removeConnection(socket.id);
    // io.emit("user", socket.id);
  });
});

// finally, let's start our server...
server.listen(process.env.PORT || 3200, function () {
  // console.log("Listening on port " + server.address().port);
});
