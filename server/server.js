const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const graqlHTTP = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

mongoose.connect("mongodb://localhost:27017/mmdpgraphql");
mongoose.connection.once("open", () => {
	console.log("db is connected");
});

app.use(cors());
app.get("/", function(req, res) {
	res.send({ message: "welcome yo ourasdnaskjdnas" });
});

app.use("/graphql", graqlHTTP({ schema, graphiql: true }));
app.listen(5000, () => {
	console.log("server is listening on port 5k");
});
