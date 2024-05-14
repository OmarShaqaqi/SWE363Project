import pg from "pg" ; 

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "habitTracker",
  password: "1010",
  port: 5432,

})