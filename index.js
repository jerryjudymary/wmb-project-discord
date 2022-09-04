const express = require("express");
const bodyParser = require("body-parser");
const { connection } = require("./db-config.js");
const { addRole } = require("./bot.js");
const request = require('request');
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.sendFile("index.html", { root: "." });
});

app.post("/api/auth", async (req, res) => {
  const userId = req.body.userId;
  const userName = req.body.userName;
  const walletAddress = req.body.address;

  connection.promise().query(
    `SELECT wallet_address FROM user_info WHERE user_id = '${userId}'`,
  )
    .then(results => {
      if (results[0].length) {
        return res.json({ code: 400, errorMessage: '이미 인증된 회원입니다.' });
      };

      try {
        addRole(userId);

        connection.query(
          `INSERT INTO user_info (user_id, user_name, wallet_address) VALUES ('${userId}', '${userName}', '${walletAddress}')`,
          function(err, results, fields) {
            if (err) throw err;
          }
        );

        return res.json({ code: 200 });

      } catch(err) {
        return res.json({ err });
      };
    });
});

// 디스코드 서버에서 유저 정보 가져오기

app.post("/api/user", async (req, res) => {
  const code = req.body.code;
  const url = "https://discord.com/api/oauth2/token";
  const REDIRECT_URL = `http://localhost:${process.env.PORT}`;
  
  request.post({url: url, form: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    scope: "identify",
  }}, function(err, httpResponse, body) {
    console.log(body)
    return res.json(
      body
    );
  })
});


app.listen(process.env.PORT, () =>
  console.log(`App listening at http://localhost:${process.env.PORT}`)
);