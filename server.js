let express = require("express");

let PORT = 3001;
let app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

let data = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

let date = new Date();

app.get("/", (req, res) => {
	res.render("index.ejs", { data: data });
});

app.get("/api/persons", (req, res) => {
	res.send(data);
});

app.get("/info", (req, res) => {
	res.send(`<p>${`PhoneBook have data of ${data.length}`}</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
	for (let i = 0; i < data.length; i++) {
		if (data[i].id == req.params.id) {
			res.status(200).send(data[i]);
			return;
		}
	}
});

app.delete("/api/delete/:id", (req, res) => {
	for (let i = 0; i < data.length; i++) {
		if (data[i].id == req.params.id) {
			data.splice(i, 1);
			res.send(data);
			return;
		}
	}
	res.status(400).json({
		error: `No Entries found of id ${req.params.id}`,
	});
});

app.post("/api/persons", (req, res) => {
	console.log(req.body);
	const body = req.body;

	for (let i = 0; i < data.length; i++) {
		if (data[i].name == body.name) {
			return res.status(403).json({
				error: "name must be unique",
			});
		}
	}
	if (!body.name && !body.number) {
		return res.status(400).json({
			error: "content missing",
		});
	}

	const generateId = () => Math.round(Math.random() * 100000);
	const entry = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	data.push(entry);
	res.json(data);
});

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
