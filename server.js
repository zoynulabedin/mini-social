/**
 * express server
 */
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import { mongoDBConnection } from "./config/db.js";
import { localsMiddleware } from "./middlewares/localsMiddleware.js";
import userRoute from "./routes/userRoute.js";
import color from "colors"

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
app.use(
	session({
		secret: process.env.JWT_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(localsMiddleware);
app.use(cookieParser());
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

