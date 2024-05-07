const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null
const initilizerServeAndDatabase = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initilizerServeAndDatabase()

//GET API
app.get("/players/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY
      player_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});
module.exports = app

// post means create the row

app.post("/players/" ,async (request , response)=>{
  const cricketDetails = {
  "playerName": "Vishal",
  "jerseyNumber": 17,
  "role": "Bowler"
}
 const {
  playerName,
  jerseyNumber,
  role
 } = cricketDetails

 const addCricketDetails = `
 INSET INTO 
 cricket_team (playerName , jerseyNumber,role)
 VALUES
 (
    ${playerName},
    ${jerseyNumber},
    ${role}
 )
 `
 const resultDetails =  await db.run(addCricketDetails)
 response.send("Player Added to Team")
})
//get single API
app.get("/players/:playerId" , (request , response)=>{
  const {playerId} = request.params;
  const databaseQeary = `
       SELECT 
       *
       FROM 
       cricket_team
       WHERE player_id = ${playerId}
  ` 
 const result =  await db.get(databaseQeary)
  response.send(result)
})

//update means put API
app.put("/players/:playerId/" , (request , response)=>{
  const dataFromBody = {
  "playerName": "Maneesh",
  "jerseyNumber": 54,
  "role": "All-rounder"
}
const {playerId} = request.params;
const {playerName,
       jerseyNumber,
       role
} = dataFromBody

const playersQueary = `
UPDATE
cricket_team
SET
playerName = ${playerName},
jerseyNumber = ${jerseyNumber}
role = ${role}
`
const updateResult = await db.run(playersQueary)
response.send("Player Details Update")
})

// delete from database
app.delete("/players/:playerId" , (request , response)=>{
  const {playerId} = request.params
  const deleteFromDatabase = `
  DELETE FROM cricket_team
  WHERE player_id = ${playerId}
  `
  const deleteResult = await db.run(deleteFromDatabase)
  response.send("Player Removed")
})