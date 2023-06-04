const express = require('express');
const app = express();
const pool = require("./dbPool.js");
const session = require('express-session');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const saltRounds = 10;
 
app.set("view engine", "ejs");
app.use(express.static("public"));

// Use for sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret_key!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// use for passing data using post method
app.use(express.urlencoded({extended:true}));

// ROUTES
// Render index default route to login page
app.get("/", async (req, res) => {
  if (req.session.authenticated) {
    let username = req.session.user;
    let sql = `SELECT *
            FROM fp_users
            WHERE username = ?`;
    let rows = await executeSQL(sql, [username]);
    let sql2 = `SELECT * FROM fp_users
            NATURAL JOIN fp_characters
            WHERE username = ?`;
    let rows2 = await executeSQL(sql2, [username]);
    res.render('user', {'userInfo':rows, 'characters':rows2});
  } else {
    res.render("login");
  }
});

// Route to the sign up view
app.get("/signup", (req, res) => {
  res.render("signup");
});


// Route for signup submission
app.post("/signup", async (req, res) => {

  // Get user input info
  let username = req.body.username;
  let password = req.body.pwd;
  let email = req.body.email;

  // hash the password
  let hashPass = await bcrypt.hash(password, saltRounds);

  // Insert new user and render user view
  let sql = `INSERT INTO fp_users
            (username, password, email)
            VALUES
            (?, ?, ?)`;
  let params = [username, hashPass, email];
  let rows = await executeSQL(sql, params);
  sql = `SELECT *
            FROM fp_users
            WHERE username = ?`;
  rows = await executeSQL(sql, [username]);
  req.session.authenticated = true;
  req.session.user = username; // CHECKING
  console.log(req.session.user);
  res.render('user', {'userInfo':rows});
});

// Route for login submission
app.post("/login", async (req, res) => {

  // Get user info input
  let username = req.body.username;
  let userPassword = req.body.pwd;
  let hashedPwd = "";

  let sql = `SELECT *
            FROM fp_users
            WHERE username = ?`;

  let sql2;
  let rows2;
  
  let data = await executeSQL(sql, [username]);

  // If username exists, find record and try to retrieve characters by that username
  if (data.length > 0) { // check if record found
    hashedPwd = data[0].password;
    sql2 = `SELECT * FROM fp_users
            NATURAL JOIN fp_characters
            WHERE username = '${username}'`;
    rows2 = await executeSQL(sql2);
  }
  
  let passwordMatch = await bcrypt.compare(userPassword, hashedPwd);

  if (passwordMatch) {
    req.session.authenticated = true;
    req.session.user = username; // CHECKING
    console.log(req.session.user);
    res.render('user', {'userInfo':data, 'characters':rows2});
  } else {
    res.render('login', {"error":"*Invalid credentials!*"});
  }
});

// Route for user view, acts as homepage when user logged in
app.get('/user', async (req, res) => {

    // If user logged in display characters associated with that userId
   console.log(req.session.user);
   if (req.session.authenticated) {
    let username = req.session.user;
    let sql = `SELECT *
            FROM fp_users
            WHERE username = ?`;
    let rows = await executeSQL(sql, [username]);
    let sql2 = `SELECT * FROM fp_users
            NATURAL JOIN fp_characters
            WHERE username = ?`;
    let rows2 = await executeSQL(sql2, [username]);
  
    res.render('user', {'userInfo':rows, 'characters':rows2});
  } else {
    res.redirect("/");
  }
});

// Lougout of session and destroy session, redirect to login
app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  req.session.destroy();
  res.redirect('/');
});

// Route to edit page for a pre-existing character
app.get('/char/edit', async function(req, res)  {

  if (req.session.authenticated) {
    let charId = req.query.charId;

    let sql =  `SELECT * FROM fp_characters WHERE charId = ${charId}`;
    let character = await executeSQL(sql);

    sql = `SELECT * FROM fp_classes`;
    let charClass = await executeSQL(sql);

    sql = `SELECT * FROM fp_races`;
    let race = await executeSQL(sql);
    res.render("editChar", {"character": character, "charClass": charClass, "race": race});
  
  } else {
    res.render("login");
  }
    
});

// Route to post/submit character edit
app.post('/char/edit', async function(req,res) {
  if (req.session.authenticated) {
    let charId = req.body.charId;
    let classId = req.body.class;
    let raceId = req.body.race;
    let charName = req.body.charName;
    let level = req.body.level;
    let background = req.body.background;
    let alignment = req.body.alignment;
    let deity = req.body.deity;
    let age = req.body.age;
    let height = req.body.height;
    let weight = req.body.weight;
    let gender = req.body.gender;
    let strength = req.body.strScore;
    let dexterity = req.body.dexScore;
    let constitution = req.body.conScore;
    let intelligence = req.body.intScore;
    let wisdom = req.body.wisScore;
    let charisma = req.body.chaScore;

    let sql = `UPDATE fp_characters
            SET classId = ?, 
                raceId= ?, 
                charName = ?,
                level= ?, 
                background= ?, 
                alignment= ?, 
                deity= ?, 
                age= ?, 
                height= ?, 
                weight= ?, 
                gender= ?, 
                strength= ?, 
                dexterity= ?,
                constitution= ?,
                intelligence= ?,
                wisdom= ?,
                charisma= ?
                WHERE charId =  ?`;


    let params = [
        classId,
        raceId,
        charName,
        level,
        background,
        alignment,
        deity,
        age,
        height,
        weight,
        gender,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        charId
    ];

    await executeSQL(sql,params);

    sql =  `SELECT * FROM fp_characters WHERE charId = ${charId}`;
    let character = await executeSQL(sql);

    sql = `SELECT * FROM fp_classes`;
    let charClass = await executeSQL(sql);

    sql = `SELECT * FROM fp_races`;
    let race = await executeSQL(sql);

    res.render("editChar", {"message": "Character Updated!", "character": character, "charClass": charClass, "race": race});
  
  } else {
    res.render("login");
  }
    
});

// Route to new character creation page
app.get('/char/new', async (req, res) => {

  if (req.session.authenticated) {
    
    let userId = req.query.userId;
    let sql = `SELECT * FROM fp_classes`;
    let charClass = await executeSQL(sql);
    let sql2 = `SELECT * FROM fp_races`;
    let rows2 = await executeSQL(sql2);
    res.render("newChar", {"userId":userId, "charClass":charClass, "race":rows2});
  
  } else {
    res.render("login");
  }  
});

// Route to submit new character to database
app.post('/char/new', async function(req, res)  {

  if (req.session.authenticated) {
    let userId = req.body.userId;
    let classId = req.body.class;
    let raceId = req.body.race;
    let charName = req.body.charName;
    let level = req.body.level;
    let background = req.body.background;
    let alignment = req.body.alignment;
    let deity = req.body.deity;
    let age = req.body.age;
    let height = req.body.height;
    let weight = req.body.weight;
    let gender = req.body.gender;
    let strength = req.body.strScore;
    let dexterity = req.body.dexScore;
    let constitution = req.body.conScore;
    let intelligence = req.body.intScore;
    let wisdom = req.body.wisScore;
    let charisma = req.body.chaScore;

    let sql = `INSERT INTO fp_characters
             (userId, classId, raceId, charName, level, background, alignment, deity, age, height, weight, 
             gender, strength, dexterity, constitution, intelligence, wisdom, charisma)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    let params = [
        userId,
        classId,
        raceId,
        charName,
        level,
        background,
        alignment,
        deity,
        age,
        height,
        weight,
        gender,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma
    ];

    let rows = executeSQL(sql, params);

    sql = `SELECT * FROM fp_users
        WHERE userId = '${userId}'`;
    rows = await executeSQL(sql);

    let sql2 = `SELECT * FROM fp_users
            NATURAL JOIN fp_characters
            WHERE userId = '${userId}'`;
    let rows2 = await executeSQL(sql2);
  
    res.render("user", {"userInfo":rows, "characters":rows2});
  
  } else {
    res.render("login");
  } 
});

// Route to view a characters sheet
app.get('/char/view', async function(req, res){

  if (req.session.authenticated) {
    let ID = req.query.charId;
    let sql =  `SELECT * 
              FROM fp_characters
              JOIN fp_races ON fp_characters.raceId=fp_races.raceId
              JOIN fp_classes ON fp_characters.classId=fp_classes.classId
              WHERE fp_characters.charId = ${ID}`;

    let rows = await executeSQL(sql);
    res.render("viewChar", {"characters":rows});
  
  } else {
    res.render("login");
  }
  
});

// Route to delete a character
app.get('/char/delete', async (req, res) =>  {

  if (req.session.authenticated) {
    let charId = req.query.charId;
    let sql = `DELETE FROM fp_characters WHERE charId = ?`;
    let rows = await executeSQL(sql, [charId]);
    res.redirect('/user');
  
  } else {
    res.render("login");
  }
  
});

// Route to the about view which renders class and race info
app.get('/about', async (req, res) => {
  if (req.session.authenticated) {
    let sql = `SELECT *
            FROM fp_races`;
    let rows = await executeSQL(sql);

    let sql2 = `SELECT *
              FROM fp_classes`;
    let rows2 = await executeSQL(sql2);

    let url = "https://api.unsplash.com/photos/random/?client_id=NaHQkRc1u-2unbvqvBaGjvr_TUBBLKD9ZGoAppa7-Dc&featured=true&query=dnd";
    let response = await fetch(url);
    let data = await response.json();
    let image = data.urls.small;

    res.render('about', {"races":rows, "fp_classes": rows2, "dndPic":image});
  
  } else {
    res.render("login");
  } 
});

// Route to edit race attributes page
app.get('/race/edit', async (req, res) => {

  if (req.session.authenticated) {
let raceId = req.query.raceId;
  let sql = `SELECT *
              FROM fp_races 
              WHERE raceId = ?`;
  let rows = await executeSQL(sql, [raceId]);

  res.render('editRace', {'raceInfo':rows});
  
  } else {
    res.render("login");
  }
});

// Sumbit the edits to race attributes (pre-existing data)
app.post('/race/edit', async (req, res) => {

  if (req.session.authenticated) {
  let raceId = req.body.raceId;
  let strength = req.body.strength;
  let dexterity = req.body.dexterity;
  let constitution = req.body.constitution;
  let intelligence = req.body.intelligence;
  let wisdom = req.body.wisdom;
  let charisma = req.body.charisma;

  let sql = `UPDATE fp_races 
            SET race_strength = ?, 
            race_dexterity = ?,
            race_constitution = ?,
            race_intelligence = ?,
            race_wisdom = ?, 
            race_charisma = ?
            WHERE raceId = ?`;

  let params = [strength, dexterity, constitution, intelligence, wisdom, charisma, raceId];

  // check for zeros and change to null if needed
  for (let i = 0; i < params.length; i++) {
    if (params[i] == '0' || params[i] == '') {
      params[i] = null;
    }
  }

  let rows = await executeSQL(sql, params);
  
  let sql2 = `SELECT *
              FROM fp_races 
              WHERE raceId = ?`;
  let rows2 = await executeSQL(sql2, [raceId]);

  res.render('editRace', {'raceInfo':rows2, 'message':'Race Updated!'});
  
  } else {
    res.render("login");
  }
  
}); 

// Local API to get list of usernames
app.get('/api/usernames', async (req, res) => {
  let sql = `SELECT username
            FROM fp_users`;
  let rows = await executeSQL(sql);
  res.send(rows);
});

// Test route
app.get("/dbTest", async (req, res) => {
 let sql = "SELECT CURDATE()";
 let rows = await executeSQL(sql);
 res.send(rows);
});//dbTest
 
//functions
async function executeSQL(sql, params){
 return new Promise (function (resolve, reject) {
   pool.query(sql, params, function (err, rows, fields) {
     if (err) throw err;
     resolve(rows);
   });
 });
}
 
//start server
app.listen(3000, () => {
 console.log("Express server running...");
});
