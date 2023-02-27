"use strict"
const express = require('express');
const uuidv4 = require('uuid').v4;
const app = express();
const PORT = 3000;
let words = require("./words");
const guessAttemp = {};
const record = {};
// initialize the objects to store words we need 
const sessions = {};
const compare = require('./compare');

function wordList(temp){
  return temp.map(element => 
    `<li>
        ${element}
    </li>`).join('\n');

}

const LoginForm = 
    `<!DOCTYPE html>
    <html lang="US-en">
    <head>
        <title>Game Login</title>
        <script defer src="login.js"></script> 
        <link rel="stylesheet" href="/login.css">   
    </head>
    <body>
        <h1>Word Guess Game Login</h1>
        <div class="send">
            <p class="error"></p>
            <form class="login" action="/login"  method="POST">
                <label>
                    <span>Username:</span>
                        <input name = "username" class="username">
                </label>
                <button type="submit">Log in</button>
            </form>
        </div>
    </body>
    </html>`;


const cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    const sid = req.cookies.sid;
    const username = sessions[sid]?.username;
    if(!sid){
        res.send(`${LoginForm}`)
    }
    else{
        console.log(record[username].answer);
        console.log(record[username].words);
        res.send(` 
        <!DOCTYPE html>
        <html lang="US-en">
        <head>
            <title>Home page</title>  
            <link rel="stylesheet" href="/homepage.css">   
        </head>
        <body>
            <h1>Word Guess Game</h1>
            <p>Available words that the secret would be:</p>
            <span><ul class="wordList">${wordList(record[username].temp)}</ul></span>
            <span>Hi ${username}: You have made ${guessAttemp[username]} valid attemps</span>
            <span>Previous Record:<ul> ${record[username].words?wordList(record[username].words):""}<ul></span>
            <span><strong> ${guessAttemp[username]==0?(record[username].valid?"":"You just made a invalid guess, please guess again!"):(record[username].valid?("You most recent guess is "+record[username].words[record[username].words.length-1]+",Matched Characters are "+compare(record[username].words[record[username].words.length-1],record[username].answer) ):"You just made a invalid guess, please guess again!")}</strong></span>
            <form class="new-game" action="/new-game"  method="get">
                <button type="submit">New Game</button>
            </form>
            ${record[username].success? `<p>Congrats! You just make it </p>`:`
            <form action="/guess" method = "POST" class = "guess">
                <label>
                    <input name="guess" class ="guess">
                </label>
                <button type="submit">Make a Guess</button>
            </form>
            <form action="/logout" method = "POST" class = "logout">
                <button type="submit">Log out </button>
            </form>
            `}
        </body>
        </html>`
    )

    }
});

app.post('/guess',(req,res)=>{

    const sid = req.cookies.sid;
    if(!sid){
        res.send(
            `<!DOCTYPE html>
            <html lang="US-en">
            <head>
                <title>Game Login</title>
                <script defer src="login.js"></script>
                <link rel="stylesheet" href="/login.css">     
            </head>
            <body>
                <div class="send">
                <p><strong>Lost Credential, Please Login in</strong></p>
                    <form class="login" action="/login"  method="POST">
                        <label>
                            <span>Username:</span>
                                <input name = "username" class="username">
                        </label>
                            <button type="submit">Log in</button>
                    </form>
                </div>
            </body>
            </html>`
        )
    }
    else{
    const username = sessions[sid]?.username;
    const guess = req.body.guess?.trim();
    console.log(guess);
    if(guess!=="dog"&&guess&&/^[A-Za-z0-9]*$/.test(guess)&&words.indexOf(guess.toLowerCase())>-1){
        const match = compare(guess,record[username].answer);
        record[username].words.push(guess.toLowerCase());
        guessAttemp[username]++;
        record[username].valid = true;
        const index =record[username].temp.indexOf(guess.toLowerCase());
        if(index>-1){
        record[username].temp.splice(index,1);
        }       
        if(match==guess.length){
            record[username].success = true;
        }
    }
    else{
        record[username].valid = false;
    }
        res.redirect("/");

}    
});

app.post('/login',(req,res)=>{
    const username = req.body.username?.trim();
    const sid = uuidv4();
    sessions[sid] = { username };
    res.cookie('sid',sid);
    if(!guessAttemp[username]){
        res.redirect('/new-game')
    }
    else{
    res.redirect('/');
    }
});
app.post('/logout',(req,res)=>{
    const sid = req.cookies.sid;
    if(sid){
        delete(sessions[sid]);
    }
    res.clearCookie('sid');
    res.redirect('/');
});

app.get('/new-game',(req,res)=>{
    const sid = req.cookies.sid;
    const username = sessions[sid]?.username;
    if(!sid||!sid in sessions){
    res.send(
    `<!DOCTYPE html>
    <html lang="US-en">
    <head>
        <title>Game Login</title>
        <script defer src="login.js"></script> 
        <link rel="stylesheet" href="/login.css">    
    </head>
    <body>
        <div class="send">
            <p><strong>Lost Credential, Please Login in</strong></p>
            <form class="login" action="/login"  method="POST">
                <label>
                    <span>Username:</span>
                        <input name = "username" class="username">
                </label>
                    <button type="submit">Log in</button>
            </form>
        </div>
    </body>
    </html>
    `)}
    else{
    record[username] = {}; 
    record[username].words = [];
    let index = Math.floor(Math.random() * words.length);
    record[username].answer = words[index];
    guessAttemp[username] = 0;
    record[username].success = false;
    record[username].valid = true;
    record[username].temp = [...words];
    res.redirect("/")
    }
    
});

app.listen(PORT,()=>{
 
    console.log('Listening on the http://localhost:3000');
});
