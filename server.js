var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const RecipesRouter = require("./routers/recipes/recipes");
const SERVICE = require("./services/index");
const { testingLog } = require("./middlewares/testing/testing");
const app = express();

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 
app.use("/recipes", testingLog, RecipesRouter);

const startServer = async () => {
    try {
        if (!process.env.PORT)
            throw new Error('PORT is undefined');
        await connectDB();
        await SERVICE.Recipe.fetchAll();
        await app.listen(process.env.PORT);
        return `Express server is listening ${process.env.PORT}`
    } catch (error) {
        throw error;
    }
};

startServer()
    .then(value => {
        console.log(value);
    })
    .catch(error => {
        console.error(error);
    });
