var express = require("express"),
    cors = require("cors"),
    mongoose = require("mongoose");

const indexRoutes = require("./routes/index.route");

// Create global app object
const app = express();

// Normal express config defaults
app.use(cors());
app.use(require("morgan")("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Set up database
mongoose.set("useNewUrlParser", true);
mongoose.connect(process.env.MONGODB_URI).then(
    ( _ ) => {

        console.log("Database has been connected !");
    },
    ( err ) => console.log(err)
);

// Set up global routes
app.use(indexRoutes)

// app.use(( err, req, res, next ) => {
//     if (!err) {
//         return next();
//     }
//     console.log("ok")
//     res.status(500);
//     res.send('500: Internal server error');
// });

// process.on('uncaughtException', ( error ) => {
//     errorHandler.handleError(error);
//     if (!errorHandler.isTrustedError(error)) {
//         process.exit(1);
//     }
// });

module.exports = app;
