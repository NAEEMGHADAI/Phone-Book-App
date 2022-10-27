let express = require("express");
let app = express();

let cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let PORT = 3001;

let db,
	dbConnectionStr = process.env.DB_STRING,
	dbName = "phone-book-entry";

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log(`Connected to ${dbName} Database`);
		db = client.db(dbName);
	}
);

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
	db.collection("phone-book-entry")
		.find()
		.toArray()
		.then((data) => {
			res.render("index.ejs", { data: data });
		})
		.catch((error) => console.error(error));
});

app.delete("/api/delete", async (req, res) => {
	const body = req.body;
	console.log(body);

	let record = await db
		.collection("phone-book-entry")
		.findOne({ number: body.number });

	if (!record) {
		return res.status(400).json({
			error: `No Entries found`,
		});
	}

	db.collection("phone-book-entry")
		.deleteOne({ number: body.number })
		.then((result) => {
			console.log(`Deletion Successful`);
			return res.json({ message: "Delete Successful" });
		});
});

app.post("/api/persons", async (req, res) => {
	console.log(req.body);
	const body = req.body;

	if (!body.name && !body.number) {
		return res.status(400).json({
			error: "content missing",
		});
	}

	let record = await db
		.collection("phone-book-entry")
		.findOne({ number: body.number });

	if (record) {
		return res.status(422).json({ error: "Entry Already exists" });
	}

	const entry = {
		name: body.name,
		number: body.number,
	};

	db.collection("phone-book-entry")
		.insertOne(entry)
		.then((result) => {
			console.log("Phone Book Entry Added");
			res.redirect("/");
		})
		.catch((error) => console.error(error));
});

app.put("/api/presons-update", async (req, res) => {
	let body = req.body;
	console.log(body);
	if (body.name.length === 0) {
		res.status(400).json({
			error: `Please Enter the name`,
		});
	}
	if (!body.name && !body.number) {
		return res.status(400).json({
			error: "content missing",
		});
	}

	// let record = await db
	// 	.collection("phone-book-entry")
	// 	.findOne({ number: body.number });

	// if (!record) {
	// 	return res.status(400).json({
	// 		error: `No Entries found`,
	// 	});
	// }

	db.collection("phone-book-entry")
		.updateOne(
			{
				number: body.number,
			},
			{
				$set: {
					name: body.name,
					number: body.number,
				},
			},
			{
				sort: { _id: -1 },
				upsert: true,
			}
		)
		.then((result) => {
			console.log("Update Done");
			res.json("Update Done");
		})
		.catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

//Homework Questions
// app.get("/api/persons", (req, res) => {
// 	res.send(data);
// });

// app.get("/info", (req, res) => {
// 	res.send(`<p>${`PhoneBook have data of ${data.length}`}</p><p>${date}</p>`);
// });

// app.get("/api/persons/:id", (req, res) => {
// 	for (let i = 0; i < data.length; i++) {
// 		if (data[i].id == req.params.id) {
// 			res.status(200).send(data[i]);
// 			return;
// 		}
// 	}
// });
