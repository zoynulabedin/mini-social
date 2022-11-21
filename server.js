/**
 * express server
 */

import dotenv from "dotenv";
import express from "express";

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
