/**
 * express server
 */
import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import {mongoDBConnection}  from "./config/db.js";
import colors from "colors";
import userRoute from "./routes/userRoute.js";

/**
 * Load environment variables from .env file
 */

dotenv.config();
const PORT = process.env.PORT || 3000;

/**
 * Express initialization
 */

const app = express();

/**
 * express static folder
 */

app.use(express.static("public"));

/**
 * express middleware
 */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * ejs view engine
 */
app.set("view engine", "ejs");
app.set("layout", "layouts/app");
app.use(expressEjsLayouts);

/**
 * user route
 */

app.use("/", userRoute);

/**
 * Server listening
 */

app.listen(PORT, () => {
	mongoDBConnection();
	console.log(`Server running on port ${PORT}`.bgGreen.black.bold);
});
