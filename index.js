import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

 

const db= new pg.Client({
	user: "postgres",
	password: "yourpassword",
	host: "localhost",
  database: "database name",
  port: 5432
});
db.connect();


app.get("/", async (req, res) => {
	const result = await db.query("SELECT * from items order by id asc");
	console.log(result.rows);
	let items = result.rows;
	res.render("index.ejs", {
		listTitle: "Today",
		listItems: items,
	});
	console.log(items);
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("insert into items (title) values ($1)", [item]);
  
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const edit_id= req.body.updatedItemId;
const edit_title = req.body.updatedItemTitle;
   db.query("UPDATE items SET title = $1 WHERE id = $2;", [
			edit_title,
			edit_id
		]);
   res.redirect("/");

});

app.post("/delete", (req, res) => {
   const dl = req.body.deleteItemId;
  
  
db.query("delete from items where id = $1", [dl]);
  
		res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
