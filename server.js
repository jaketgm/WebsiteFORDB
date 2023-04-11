/********************************************************
* Sets up a simple web server utilizing Express.js and
* an SQLLite database UNBDB.db. The server listens on the
* port defined to be 5000, and serves static files from
* the public directory. I.e. in this case, the files in
* the project. Several routes are defined to handle HTTP 
* POST requests that perform varias SQL statments 
* corresponding to what action event listener is 
* triggered.
*
* @author Jake Brockbank
* @version One
*******************************************************/
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const { data } = require("jquery");

const openPort = 5000;

const app = express();

// Serve static files in the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Parses incoming request bodies in a middleware before our handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/******************************************************************************
* Method: Post (For /getTableDB): Retrieves all rows from a specified table,
* and returns the data as JSON to the client.
*
* Input: request, response
*
* Output: Data as JSON sent to client.
*
******************************************************************************/
app.post("/getTableDB", (req, res) => {
    // Garners the name of the table from the request body
    const theTableName = req.body.theTableName;

    // Opens the database connection
    const database = new sqlite3.Database("UNBDB.db", (err) => {
        if (err) {
            console.error(err.message);
            return res
                .status(500)
                .send("Error in the servers internal component");
        }
        console.log("Successful connection to database.");
    });

    // Retreive data from table
    database.all(`SELECT * FROM ${theTableName}`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res
                .status(500)
                .send("Error in the servers internal component");
        }
        res.send(rows);
        // Close ongoing connection to database
        database.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log("Database connection closed");
        });
    });
});

/******************************************************************************
* Method: Post (For /insertIntoTable): Inserts a new row into a specified table
* with the provided column names and values.
*
* Input: request, response
*
* Output: New row JSON sent to client.
*
******************************************************************************/
app.post("/insertIntoTable", (req, res) => {
    const theTableName = req.body.theTableName;
    const columns = req.body.columns;
    const values = req.body.values;

    const database = new sqlite3.Database("UNBDB.db", (err) => {
        if (err) {
            console.error(err.message);
            return res
                .status(500)
                .send("Error in the server's internal component");
        }
        console.log("Successful connection to database.");
    });

    database.run(
        `INSERT INTO ${theTableName} (${columns}) VALUES (${values})`,
        [],
        function (err) {
            if (err) {
                console.error(err.message);
                return res
                    .status(500)
                    .send("Error in the server's internal component");
            }
            res.send("Rows inserted successfully!");
            database.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log("Database connection closed");
            });
        }
    );
});

/******************************************************************************
* Method: Post (For /deleteFromTable): Deletes a row from a specified table
* based on a provided WHERE clause.
*
* Input: request, response
*
* Output: Deleted row JSON info.
*
******************************************************************************/
app.post("/deleteFromTable", (req, res) => {
    // Garners the name of the table and the WHERE clause from the request body
    const tableName = req.body.tableName;
    const whereClause = req.body.whereClause;

    // Opens the database connection
    const database = new sqlite3.Database("UNBDB.db", (err) => {
        if (err) {
            console.error(err.message);
            return res
                .status(500)
                .send("Error in the servers internal component");
        }
        console.log("Successful connection to database.");
    });

    // Delete the specified row from the table
    database.run(
        `DELETE FROM ${tableName} WHERE ${whereClause}`,
        function (err) {
            if (err) {
                console.error(err.message);
                return res
                    .status(500)
                    .send("Error in the servers internal component");
            }
            // Send a success message back to the client
            res.send("Row deleted successfully.");
        }
    );

    // Close the database connection
    database.close();
});

/******************************************************************************
* Method: Post (For /modifyTable): Modifies a row in a specified table based
* on a provided SET clause and WHERE clause.
*
* Input: request, response
*
* Output: Modified row JSON info.
*
******************************************************************************/
app.post("/modifyTable", (req, res) => {
    const { tableName, setClause, whereClause } = req.body;
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;

    // Opens the database connection
    const db = new sqlite3.Database("UNBDB.db", (err) => {
        if (err) {
            console.error(err.message);
            return res
                .status(500)
                .send("Error in the server's internal component");
        }
        console.log("Successful connection to database.");
    });

    db.run(query, (err) => {
        if (err) {
            console.log(err.message);
            res.status(500).send("Error modifying row in table.");
        } else {
            res.send("Row modified successfully.");
        }
    });

    // Closes the database connection after the query has been executed
    db.close();
});

// Serves the index.html file and index.js file when the root path is requested
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/index.js", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.js"));
});

// Starts the server
app.listen(openPort, () => {
    console.log(`Server started at http://localhost:${openPort}`);
});