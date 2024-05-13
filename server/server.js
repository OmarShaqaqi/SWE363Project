import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg" ; 
import bcrypt from "bcrypt"



// defining the database 
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "habitTracker",
  password: "1010",
  port: 5432,
})
db.connect()
const app = express();
const port = 4000;


app.use(bodyParser.urlencoded({extended:true})); 
app.use(cors()) //making  sure that only good url are using the server



app.post("/adduser",(req,res)=>{
    const {username,password} = req.body;
    const insertQuery = `INSERT INTO users(username, password) VALUES ($1, $2)`;
    const values = [username, password];


    db.query(insertQuery,values,(err,result) =>{

        if(err){
            console.log("Something went wrong: " + err.stack);
            res.status(500).send("Error inserting user");
        }
        else {
            console.log("User inserted successfully");
            res.status(200).send("User received");
        }

    });
    console.log(req.body);
    console.log("End")

});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    // Instead of checking password directly, just retrieve the hash from the database
    const query = `SELECT password FROM users WHERE username = $1`;
    const values = [username];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            // No user found with that username
            res.status(404).send("User not found");
        } else {
            // User found, now compare the hashed password
            const storedHash = result.rows[0].password;
            const passwordMatch = await bcrypt.compare(password, storedHash);
            if (passwordMatch) {
                // Passwords match
                res.status(200).send("User exist");
            } else {
                // Passwords do not match
                res.status(401).send("Invalid credentials");
            }
        }
    } catch (err) {
        console.error("Something went wrong:", err.stack);
        res.status(500).send("Something went wrong in the DB");
    }
});



app.post("/goals",(req,res) =>{
    console.log(req.body);
    console.log("YOu are in /goals")
    const {username} = req.body;

    const insertQuery = `SELECT goal FROM goals WHERE username=$1`;
    const values = [username];

    db.query(insertQuery,values,(err,result) => {

        if(err) {
            res.send("something went wrong in the database")
            console.log("something wrong")
        }
        else{
            res.send(result.rows);
            console.log(result.rows);
            console.log("All good");
        }
    })


});

app.post("/deletegoal",async (req,res)=>{

    try{
        console.log("you are in delete goals");
        console.log(req.body)
        console.log(typeof(req.body.goals));
    const { username, goals } = req.body;

    const goalsJSON = JSON.parse(goals);



    await  db.query("DELETE FROM goals WHERE username = $1", [username]);

    for (const goal of goalsJSON) {
        await db.query("INSERT INTO goals (username, goal) VALUES ($1, $2)", [username, goal.goal]);
        console.log(goal);
        console.log(username);
      }
      console.log("all goals are saved!!")
    res.status(200).send("Questions updated successfully");
    }
    catch(err){

    await db.query("ROLLBACK");
    console.error("Error updating questions:", err);
    res.status(500).send("Error updating questions");

    }
    

})


app.post("/insertgoal", async (req,res)=> {

    try{

        const goal = (req.body["goal"]);
        const username = req.body["username"];

        await db.query("INSERT INTO goals (username, goal) VALUES ($1, $2)", [username, goal]);

        console.log("The goal is saved!!")
        res.status(200).send("Questions updated successfully");
    

    }
    catch(err) {

        console.error("Error updating questions:", err);
        res.status(500).send("Error updating questions");

    }



});


app.post("/habits",(req,res) =>{
    console.log("you are in habits");
    console.log(req.body);
    const {username} = req.body;

    const insertQuery = `SELECT * FROM habits WHERE username=$1 ORDER BY id ASC`;
    const values = [username];

    db.query(insertQuery,values,(err,result) => {

        if(err) {
            res.send("something went wrong in the database")
            console.log("something wrong")
        }
        else{
            res.send(result.rows);
            console.log(result.rows);
            console.log("All good");
        }
    })


}); 

app.post('/inserthabit', async (req, res) => {
    const { habit, username, days } = req.body;
  
    try {
      const queryText = `
        INSERT INTO habits(username, habit, sun, mon, tue, wed, thu, fri, sat)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `;
      const queryParams = [
        username, 
        habit, 
        days[0], days[1], days[2], days[3], days[4], days[5], days[6]
      ];
      await db.query(queryText, queryParams);
      res.send('Habit inserted successfully');
    } catch (error) {
      console.error('Error inserting habit:', error);
      res.status(500).send('Error inserting habit');
    }
  });
  


  app.delete('/deletehabit/:id', (req, res) => {
    const { id } = req.params;
    console.log("This is the ID"); 
    console.log(id)
    // Logic to delete the habit from the database
    db.query('DELETE FROM habits WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.error("Error deleting habit from database:", error);
            res.status(500).send("Failed to delete habit");
        } else {
            res.send("Habit deleted successfully");
        }
    });
    console.log(`${id} is delted from the db`);
});


app.patch('/updatehabit/:id', async (req, res) => {
    const { id } = req.params;  // The ID of the habit
    const { day, newValue } = req.body;  // 'day' should be the name of the column ('sun', 'mon', etc.)
    const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const validDay = validDays[day]

    console.log("id is here" + id)
    console.log(day)
    console.log(newValue);

    try {
        const updateQuery = `
            UPDATE habits
            SET ${validDay} = $1
            WHERE id = $2;
        `;
        const values = [newValue, id];

        const result = await db.query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Habit not found');
        }
    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/user/:username', async (req, res) => {
    const { username } = req.params;  // Extract username from URL

    try {
        console.log("inside username");
        console.log(username)
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            console.log(result.rows);
            res.json(result.rows[0]);  // Send user data if found
        } else {
            res.status(404).send('User not found');  // Send 404 if no user is found
        }
    } catch (error) {
        console.error('Failed to retrieve user data:', error);
        res.status(500).send('Internal Server Error');  // Send server error status
    }
});

app.put('/api/user/update', async (req, res) => {
    const { username, name, job } = req.body;
    console.log("user update")
    console.log(req.body);

    try {
        const updateQuery = `
            UPDATE users
            SET name = $1, job = $2
            WHERE username = $3
            RETURNING *; 
        `;
        const result = await db.query(updateQuery, [name, job, username]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);  // Send back the updated user data
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Failed to update user:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/api/user/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const saltRounds = 10; //hash complexity
    console.log("user password")
    console.log(req.body);

    try {
        // Retrieve the current password hash from the database
        const userQuery = await db.query('SELECT password FROM users WHERE username = $1', [username]);
        if (userQuery.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        const currentPasswordHash = userQuery.rows[0].password;

        // Compare old password with the hash stored in the database
        const passwordMatch = await bcrypt.compare(oldPassword, currentPasswordHash);
        if (!passwordMatch) {
            return res.status(403).send('Old password is incorrect');
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password in the database
        await db.query('UPDATE users SET password = $1 WHERE username = $2', [newPasswordHash, username]);
        res.send('Password updated successfully');
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Failed to update password');
    }
});


app.post('/api/register', async (req, res) => {
    console.log("YOur are in register");
    const { username, password, name, job } = req.body;
    const saltRounds = 10;
    console.log(req.body);

    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Here, you would insert the user into your database
        // Example:
        const result = await db.query('INSERT INTO users (username, password, name, job) VALUES ($1, $2, $3, $4)', [username, hashedPassword, name, job]);

        console.log('User registered:', username);  // For demonstration, log to the console
        res.status(201).json({ message: "User successfully registered!" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Failed to register user due to internal error." });
    }
});


app.post('/api/friends/add', async (req, res) => {
    const { user_id, friend_id } = req.body;
    console.log("adding friend");
    console.log(req.body);
    try {
        const result = await db.query(
            'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [user_id, friend_id]
        );
        if (result.rowCount > 0) {
            res.status(201).send('Friend added successfully.');
        } else {
            res.status(409).send('Friendship already exists.');
        }
    } catch (error) {
        res.status(500).send('Failed to add friend due to server error.');
        console.error('Failed to add friend:', error);
    }
});

app.post('/api/friends/get', async (req, res) => {
    const { user_id } = req.body;
    console.log("Getting firnds")
    console.log(req.body);
    try {
        const result = await db.query(
            'SELECT friend_id FROM friends WHERE user_id=$1 ',
            [user_id]
        );
        if (result.rowCount > 0) {
            console.log(result.rows)
            res.status(201).send(JSON.stringify(result.rows));
        } else {
            res.status(409).send('Friendship already exists.');
        }
    } catch (error) {
        res.status(500).send('Failed to add friend due to server error.');
        console.error('Failed to add friend:', error);
    }
});

app.delete('/api/friends/delete', async (req, res) => {
    const { user_id, friend_id } = req.body;
    try {
        const result = await db.query(
            'DELETE FROM friends WHERE user_id = $1 AND friend_id = $2',
            [user_id, friend_id]
        );
        if (result.rowCount > 0) {
            res.send('Friend deleted successfully.');
        } else {
            res.status(404).send('Friendship not found.');
        }
    } catch (error) {
        res.status(500).send('Failed to delete friend due to server error.');
        console.error('Failed to delete friend:', error);
    }
});



app.post("/habits/stat",(req,res)=>{
    console.log("inside stat")
    const {username} = req.body;


    const insertQuery = `SELECT sun,mon,tue,wed,thu,fri,sat FROM habits WHERE username=$1 ORDER BY id ASC`;
    const values = [username];

    db.query(insertQuery,values,(err,result) => {

        if(err) {
            res.send("something went wrong in the database")
            console.log("something wrong")
        }
        else{
            res.send(result.rows);
            console.log(result.rows);
            console.log("All good");
        }
    })

});


app.listen(port,()=>{
    console.log(`Server running on port localhost:${port}`)
});