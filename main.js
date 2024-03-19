import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/", async (req, res) => {
    try {
        const search  = req.body.search;
        const resp = await db.query(`SELECT * FROM harsh WHERE search = $1`, [search]);
        console.log(resp.rows);
        if (resp.rows.length > 0) {
            res.status(200).send(resp.rows);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});