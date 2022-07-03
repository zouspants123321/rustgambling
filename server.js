const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const SteamID = require("steamid");
let sid = new SteamID();
const SteamTotp = require("steam-totp");
const SteamBot = require("./bots");
const sendMail = require("./mail");

//npm run dev
const bot = new SteamBot({
  accountName: "", // username
  password: "", //password
  twoFactorCode: SteamTotp.generateAuthCode("xxxxxxxxxxxxxxxxxxxxxxxxxxx"), // account code
});

const PORT = 3037 || process.env.PORT;
const app = express();
const server = http.Server(app);
const io = socket(server);
const hbs = handlebars.create();

app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static("public"));

const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

//mysql
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
  charset: "utf8mb4",
});

//Steam login handlers
passport.serializeUser((user, done) => {
  done(null, user._json);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3037/auth/steam/return",
      realm: "http://localhost:3037/",
      apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // api from steam
    },
    (identifier, profile, done) => {
      return done(null, profile);
    }
  )
);

app.use(
  session({
    secret: "some secret string",
    name: "U_SESSION",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
var steamid;
app.use("public", express.static(path.join(__dirname, "css")));
app.use("public", express.static(path.join(__dirname, "js")));
app.use("public", express.static(path.join(__dirname, "img")));

const steaminventory = require("get-steam-inventory");
const { emit } = require("process");
const res = require("express/lib/response");
const { Console } = require("console");
const { resolve } = require("path");
const { getSystemErrorMap } = require("util");
const { get, json } = require("express/lib/response");
const exp = require("constants");

let emojiis = [
  "‍💰 💲 🔥 😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👋 🤚 🖐 ✋ 🖖 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦵 🦿 🦶 👣 👂 🦻 👃 🧠 🦷 🦴 👀 👁 👅 👄 💋 🩸 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐻‍❄️ 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪱 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🦣 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐈‍ 🐓 🦃 🦚 🦜 🦢 🦩 🕊 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🐿 🦔 🐾 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🐚 🪨 🌾 💐 🌷 🌹 🥀 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔 🌙 🌎 🌍 🌏 🪐 💫 ⭐️ 🌟 ✨ ⚡️ ☄️ 💥 🔥 🌪 🌈 ☀️ 🌤 ⛅️ 🌥 ☁️ 🌦 🌧 ⛈ 🌩 🌨 ❄️ ☃️ ⛄️ 🌬 💨 💧 💦 ☔️ ☂️ 🌊 🌫 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ☮️ ✝️ ☪️ 🕉 ☸️ ✡️ 🔯 🕎 ☯️ ☦️ 🛐 ⛎ ♈️ ♉️ ♊️ ♋️ ♌️ ♍️ ♎️ ♏️ ♐️ ♑️ ♒️ ♓️ 🆔 ⚛️ 🉑 ☢️ ☣️ 📴 📳 🈶 🈚️ 🈸 🈺 🈷️ ✴️ 🆚 💮 🉐 ㊙️ ㊗️ 🈴 🈵 🈹 🈲 🅰️ 🅱️ 🆎 🆑 🅾️ 🆘 ❌ ⭕️ 🛑 ⛔️ 📛 🚫 💯 💢 ♨️ 🚷 🚯 🚳 🚱 🔞 📵 🚭 ❗️ ❕ ❓ ❔ ‼️ ⁉️ 🔅 🔆 〽️ ⚠️ 🚸 🔱 ⚜️ 🔰 ♻️ ✅ 🈯️ 💹 ❇️ ✳️ ❎",
];

let emojiisCount = [];

emojiis = emojiis.toString().split(" ");
for (let i = 0; i < emojiis.length; i++) {
  emojiisCount.push(emojiis[i]);
}

app.get("/", (req, res) => {
  if (req.user) {
    res.render("main", {
      user: req.user,
      emojiis: emojiisCount,
    });
  } else {
    res.render("main", {
      user: req.user,
      emojiis: emojiisCount,
    });
    //res.redirect("/auth/steam");
  }
});

app.get(
  /^\/auth\/steam(\/return)?$/,
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

setInterval(() => {
  io.emit("itemsDeposited", totalAmount, totalDollar, timeLeft, itemJsonString);

  if (startTimer && timeLeft > 0) {
    if ((totalAmount >= 60 && !stopWhileAnim) || timeLeft <= 0) {
      console.log("the skin total is over 60 get the animation and reset");
      startTimer = false;
      stopWhileAnim = true;
      getAnim();
    }
    timeLeft--;
  } else if (startTimer && timeLeft <= 0) {
    console.log("time is 0, get the animation and reset");
    startTimer = false;
    stopWhileAnim = true;
    getAnim();
  }
}, 1000);

function updateInventory(steamid) {
  let sqll = `SELECT *FROM users WHERE steam64id=${steamid}`;
  db.query(sqll, (err, results) => {
    let canTrade = true;
    if (results[0].tradeURL == "NULL") {
      canTrade = false;
    }
    io.to(results[0].socketID).emit("enableModal", canTrade);
  });

  let sql = "SELECT * FROM market";
  let query = db.query(sql, (err, results) => {
    var itemPrice;
    item = [];
    steaminventory
      .getinventory(252490, steamid, "2")
      .then((data) => {
        for (i = 0; i < data.raw.descriptions.length; i++) {
          if (data.raw.descriptions[i].tradable == 1) {
            for (k = 0; k < results.length; k++) {
              if (results[k].itemName == data.raw.descriptions[i].name) {
                itemPrice = results[k].itemPrice;
              }
            }

            for (j = 0; j < data.raw.assets.length; j++) {
              if (
                data.raw.descriptions[i].classid ==
                  data.raw.assets[j].classid &&
                data.raw.assets[j].amount == 1
              ) {
                item.push({
                  name: data.raw.descriptions[i].name,
                  assetid: data.raw.assets[j].assetid,
                  img: data.raw.descriptions[i].icon_url,
                  price: itemPrice,
                });
              }
            }
          }
        }
        let sql = `SELECT *FROM users WHERE steam64id=${steamid}`;
        db.query(sql, (err, results) => {
          //send back the items and display them
          let canTrade = true;
          if (results[0].tradeURL == "NULL") {
            canTrade = false;
          }
          io.to(results[0].socketID).emit(
            "updateInventory",
            item,
            steamid,
            canTrade
          );
        });
      })
      .catch((err) => console.log(err));
  });
}

//add listener for new connection
io.on("connection", (socket) => {
  socket.on("updateInventory", (data) => {
    updateInventory(data.steam64);
  });

  socket.on("getURL", (data) => {
    {
      let query = `UPDATE users SET tradeURL = "${data.url}" WHERE steam64id = "${data.steam64}";`;
      db.query(query, function (errr, getUser) {});
    }
  });

  socket.on("getEmail", (data) => {
    const { text, subject, email } = data;
    //check if it's right format.. before sending...

    sendMail(email, subject, text);
  });

  socket.on("getRound", (roundID) => {
    //get all the information about the round
    let query = 'SELECT *FROM `history` WHERE id="' + roundID + '"';
    db.query(query, function (errr, winner) {
      let query = 'SELECT * FROM `fullHistory` WHERE id="' + roundID + '"';
      db.query(query, function (errr, history) {
        socket.emit("getRoundInformation", winner, history);
      });
    });
  });

  socket.on("getMyProfile", (steam64ID) => {
    let participations = 0;
    let deposited = 0;
    let totalWon = 0;
    let profit = 0;
    let url = "";
    let avatar = "";

    //get information
    let query = "select *FROM users WHERE steam64id=" + steam64ID;
    db.query(query, (err, user) => {
      url = user[0].tradeURL;
      avatar = user[0].avatarBig;
      query =
        "SELECT MIN(id) AS id FROM fullHistory WHERE steamId=" +
        steam64ID +
        " GROUP BY id";
      db.query(query, (err, fullHistory) => {
        participations = fullHistory.length;
        query = "SELECT *FROM history WHERE steamid64=" + steam64ID;
        db.query(query, (err, history) => {
          for (let i = 0; i < history.length; i++) {
            totalWon += parseFloat(history[i].won);
          }
          query = "SELECT *FROM fullHistory WHERE steamId=" + steam64ID;
          db.query(query, (err, fullHistory) => {
            for (let i = 0; i < fullHistory.length; i++) {
              deposited += parseFloat(fullHistory[i].price);
            }
            deposited = deposited.toFixed(2);
            totalWon = totalWon.toFixed(2);
            profit = (totalWon - deposited).toFixed(2);

            socket.emit(
              "getProfileBack",
              avatar,
              totalWon,
              deposited,
              url,
              profit,
              participations
            );
          });
        });
      });
    });
  });

  socket.on("getMyHistory", (steam64ID) => {
    //get last 100 history send back
    let query = `SELECT MIN(id) AS id FROM fullhistory WHERE steamId="${steam64ID}" GROUP BY ID LIMIT 100`;
    db.query(query, (err, fullHistory) => {
      for (let i = 0; i < fullHistory.length; i++) {
        let query = `SELECT *FROM history WHERE id=${fullHistory[i].id}`;
        db.query(query, (err, history) => {
          socket.emit(
            "sendBackHistory",
            history[0].id,
            history[0].name,
            history[0].won,
            history[0].chance,
            history[0].image
          );
        });
      }
    });
  });

  //Check for items that has been deposited.
  socket.on("deposit", (data) => {
    let userDeposited = new SteamID(data.steam64);

    if (userDeposited.isValid && data.assetid.length > 0) {
      var itemArray = data.assetid;
      query = "SELECT *FROM users WHERE steam64id=" + data.steam64;
      db.query(query, (err, user) => {
        bot.sendDepositTrade(
          data.steam64,
          itemArray,
          user[0].tradeURL,
          (err, success, tradeOffer) => {
            if (err && !success) {
              socket.emit("failureTrade", {
                message: "We could not process your request at this time.",
              });
            } else {
              socket.emit("successTrade", tradeOffer);
            }
          }
        );
      });
    }
  });
});

let totalAmount = 0;
let totalDollar = 0;
let itemsJson = [];
let itemJsonString = [];
let itemWinnings = [];
let itemWinningsName = [];
let itemPrice;
let startTimer = false;
let stopWhileAnim = false;
const timeLeftConst = 120;
let timeLeft = timeLeftConst;
let depositedWhenAnim = [];

bot.manager.on("sentOfferChanged", function (offer, oldState) {
  if (offer.message != "congratulations you won a jackpot on rustfunpot.com!") {
    let sid2 = new SteamID(`[U:1:${offer.partner.accountid.toString()}]`);
    var steam64 = sid2.getSteamID64();
    let itemAmount = 0;

    depositedItems(offer, steam64, itemAmount);
  }
});

function depositedItems(offer, steam64, itemAmount) {
  if (offer.state == 3 && stopWhileAnim == false && timeLeft >= 5) {
    offer.getReceivedItems(function (err, items) {
      if (err) {
        console.log("Couldn't get received items: " + err);
      } else {
        var names = items.map(function (item) {
          itemAmount += item.amount;
        });
        if (itemAmount > 0) {
          startTimer = true;

          let query = 'SELECT * FROM `users` WHERE steam64id="' + steam64 + '"';
          db.query(query, function (errr, getUser, fieldss) {
            //go through all the items get price and insert to mysql
            for (let i = 0; i < itemAmount; i++) {
              let query = 'SELECT * FROM `market` WHERE itemName="';
              query += `${items[i].name}`;
              query += '"';
              db.query(query, function (err, result, fields) {
                if (err) throw err;
                itemPrice = result[0].itemPrice;

                totalDollar += itemPrice;
                query = `INSERT INTO currentpot (steamId, username, item, price, itemImage, userImage) VALUES (?, ?, ?, ?, ?, ?);`;
                db.query(
                  query,
                  [
                    steam64,
                    getUser[0].name,
                    items[i].name,
                    itemPrice,
                    items[i].icon_url,
                    getUser[0].avatarBig,
                  ],
                  (err, rows) => {
                    if (err) throw err;
                  }
                );
                let lowercase = getUser[0].name.toLowerCase();
                console.log(lowercase);
                if (lowercase.includes("rustfunpot.com")) {
                  itemsJson.push(
                    `<div class="middle-current-items-pot"><div><img style="width: 64px; height=64px; margin-left: 30px" src="${getUser[0].avatarBig}"/></div><p> <span style="color: orange;"> ${getUser[0].name} </span> deposited: ${items[i].name} - $${itemPrice}</p><div><img style="width: 64px; height=64px; margin-right: 30px" src="https://community.cloudflare.steamstatic.com/economy/image/${items[i].icon_url}"/></div></div>`
                  );
                } else {
                  itemsJson.push(
                    `<div class="middle-current-items-pot"><div><img style="width: 64px; height=64px; margin-left: 30px" src="${getUser[0].avatarBig}"/></div><p>${getUser[0].name} deposited: ${items[i].name} - $${itemPrice}</p><div><img style="width: 64px; height=64px; margin-right: 30px" src="https://community.cloudflare.steamstatic.com/economy/image/${items[i].icon_url}"/></div></div>`
                  );
                }

                itemWinnings.push(items[i].assetid);
                itemWinningsName.push({
                  price: itemPrice,
                  steam64,
                  assetid: items[i].assetid,
                });
                itemJsonString = itemsJson[i] + "\n" + itemJsonString;
              });
            }
            refreshAllPlayerLiveJackpotStats();
            totalAmount += itemAmount;
          });
          io.emit(
            "itemsDeposited",
            totalAmount,
            totalDollar,
            timeLeft,
            itemJsonString
          );
          playDepositSound();
          itemsJson = [];
        }
      }
    });
  } else if (offer.state == 3) {
    console.log("Queued to the next jackpot");
    depositedWhenAnim.push(offer);
  } else {
    console.log("Other state than accepted.");
  }
}

// Runs when a new user connects
io.on("connection", (socket) => {
  getMessages(socket);
  getJackpotHistory(socket);
  getWinnerOfTheDay(socket);
  updateMessageSent(socket);
  updateNewUser(socket);
});

//Show the win-animation
function getAnim() {
  let arr = [];
  let winner = [];
  let string = "";
  let totalTickets = 0;
  let totalTicketsLive = 0;
  let foundWinner = false;
  let loopMe = 1;
  let winningTicket = 0;
  let winnerChance = 0;
  let winner64 = "";

  let query = "select * from currentpot";
  db.query(query, (err, results) => {
    for (let i = 0; i < results.length; i++) {
      totalTickets += parseFloat(results[i].price);
    }
    totalTickets *= 1000;
    randomNum = Math.floor(Math.random() * totalTickets + 1);

    let query = "select * from currentpot";
    db.query(query, (err, results) => {
      for (let i = 0; i < results.length; i++) {
        totalTicketsLive += parseFloat(results[i].price) * 1000;

        if (totalTicketsLive >= randomNum && !foundWinner) {
          winningTicket = randomNum / totalTickets;
          winner64 = results[i].steamId;
          loopMe = Math.round(((results[i].price * 1000) / totalTickets) * 100);
          for (let j = 0; j < loopMe; j++) {
            if (!foundWinner) {
              winner.push(
                `<li class='winnerr'><img src='${results[i].userImage}' /></li>`
              );
              foundWinner = true;
            } else {
              arr.push(
                `<li class='selector'><img src='${results[i].userImage}' /></li>`
              );
            }
          }
        } else {
          loopMe = Math.round(((results[i].price * 1000) / totalTickets) * 100);
          for (let j = 0; j < loopMe; j++) {
            arr.push(
              `<li class='selector'><img src='${results[i].userImage}' /></li>`
            );
          }
        }
      }
      //shuffle the image array
      let list = arr.sort(() => Math.random() - 0.5);
      list.push(winner[0]);

      for (let i = 0; i < arr.length; i++) {
        string += list[i];
        +"\n";
      }
      playAnimSound();
      io.emit("getAnim", string);

      //@TODO in history get like a special id per round (ROUND-ID) so if an offer isnt sent it can be manually. etc etc
      let query = 'SELECT * FROM currentpot WHERE steamId="' + winner64 + '"';
      db.query(query, (err, getWinner) => {
        for (let k = 0; k < getWinner.length; k++) {
          winnerChance += parseFloat(getWinner[k].price);
        }
        winnerChance = (winnerChance * 100000) / totalTickets;
        query = `INSERT INTO history (name, image, won, chance, ticket, steamId64) VALUES (?, ?, ?, ?, ?, ?);`;
        db.query(
          query,
          [
            getWinner[0].username,
            getWinner[0].userImage,
            totalDollar.toFixed(2),
            winnerChance.toFixed(2),
            winningTicket.toFixed(6),
            getWinner[0].steamId,
          ],
          (err, rows) => {
            if (err) throw err;
          }
        );
      });
      query = "SELECT * FROM history ORDER BY id DESC LIMIT 1";
      db.query(query, (err, history) => {
        query = "SELECT * FROM currentpot";
        db.query(query, (err, saveRound) => {
          saveRoundId = history[0].id + 1;
          for (let m = 0; m < saveRound.length; m++) {
            query = `INSERT INTO fullHistory (steamId, username, item, price, itemImage, userImage, id) VALUES (?, ?, ?, ?, ?, ?, ?);`;
            db.query(
              query,
              [
                saveRound[m].steamId,
                saveRound[m].username,
                saveRound[m].item,
                saveRound[m].price,
                saveRound[m].itemImage,
                saveRound[m].userImage,
                history[0].id + 1,
              ],
              (err, rows) => {
                if (err) throw err;
              }
            );
          }
          takeComissions(history[0].id + 1, winner64, totalTickets);
        });
      });

      query = "SELECT *FROM users WHERE steam64id=" + winner64;
      db.query(query, (err, user) => {
        setTimeout(() => {
          bot.sendWinnings(
            winner64,
            itemWinnings,
            user[0].tradeURL,
            (err, success, tradeOffer) => {
              // TODO: Handle these events on the website
              if (err && !success) {
                io.emit("failureWon", {
                  message: "We could not process your request at this time.",
                });
              } else {
                io.to(user[0].socketID).emit("successWon", tradeOffer);
              }
            }
          );
          resetJackpot();
        }, 11500);
      });
    });
  });
}

function takeComissions(saveRoundId, winner64, totalTickets) {
  let totalDollarInPot = totalTickets / 1000;
  let minCommision = 0;
  let itemsPriceCount = 0;
  let maxCommision = 0;

  console.log(
    "Pot is taking " +
      minCommision +
      "-" +
      maxCommision.toFixed(1) +
      "$ in comissions"
  );

  query =
    "SELECT *FROM fullHistory WHERE steamId=" +
    winner64 +
    " AND id = " +
    saveRoundId;
  db.query(query, (err, getName) => {
    let lowercase = getName[0].username.toLowerCase();

    if (lowercase.includes("rustfunpot.com")) {
      maxCommision = 0.05 * totalDollarInPot;
    } else {
      maxCommision = 0.1 * totalDollarInPot;
    }

    query = "SELECT *FROM fullHistory WHERE id=" + saveRoundId;
    console.log(maxCommision);
    db.query(query, (err, fullHistory) => {
      for (let i = 0; i < itemWinningsName.length; i++) {
        if (itemsPriceCount + itemWinningsName[i].price < maxCommision) {
          if (fullHistory[i].steamId != winner64) {
            removeItemOnce(itemWinnings, itemWinningsName[i].assetid);
            itemsPriceCount += itemWinningsName[i].price;
          }
        }
      }
    });
  });
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function refreshAllPlayerLiveJackpotStats() {
  query = `SELECT *FROM users`;
  db.query(query, function (errr, getSocket, fieldss) {
    for (let i = 0; i < getSocket.length; i++) {
      getPlayerLiveJackpotStats(getSocket[i].steam64id, getSocket[i].socketID);
    }
  });
}
function getPlayerLiveJackpotStats(steam64, socketID) {
  /**
   * ["This function will update the "Chance, Item value, Amount of items in the current pot to the user."]
   * @steam64id Steam 64 of the user that is getting the update.
   * @socketID  the web browser that will be updated.
   */
  let userItems = 0;
  let userChance = 0;
  let userValue = 0;

  query = `SELECT *FROM currentpot WHERE steamId=${steam64};`;
  db.query(query, function (errr, getUser, fieldss) {
    userItems = getUser.length;
    if (userItems > 0) {
      for (let i = 0; i < getUser.length; i++) {
        userValue += parseFloat(getUser[i].price);
      }

      userChance = (userValue / totalDollar) * 100;

      io.to(socketID).emit(
        "getPlayerJackpotInfo",
        userValue.toFixed(2),
        userChance.toFixed(2),
        userItems
      );
    } else {
      io.to(socketID).emit("getPlayerJackpotInfo", 0, 0, 0);
    }
  });
}

function resetJackpot() {
  /**
   * ["Reset the current jackpot and update information"]
   */
  stopWhileAnim = false;
  startTimer = false;

  //(updates every second so this will be reseted 1 sec after the pot ended)
  //Reset time to 60
  timeLeft = timeLeftConst;

  //Reset total dollar in the pot to 0
  totalDollar = 0;

  //Reset total items in the pot 0
  totalAmount = 0;

  //Reset items that has been deposited (this is not the item names this is the whole element)
  itemJsonString = [];

  //Reset the winning items
  itemWinnings = [];
  itemWinningsName = [];

  //Update the 5 latest jackpot rounds
  query = "SELECT * FROM `history` ORDER BY id DESC LIMIT 5";
  db.query(query, (err, results) => {
    io.emit("getJackpotHistory", results);
  });

  //Update the "winner of the day"
  query = "select * FROM `history` WHERE date > now() - interval 24 hour;";
  db.query(query, (err, results) => {
    let winnerOfToday = results[0];
    for (let i = 0; i < results.length; i++) {
      if (results[i].chance < winnerOfToday.chance) {
        winnerOfToday = results[i];
      }
    }
    io.emit("getWinnerOfDay", winnerOfToday);
  });

  //Empty everything in "currentpot"
  query = "TRUNCATE currentpot";
  db.query(query, (err, results) => {});

  //Reset players stats in the current pot
  io.emit("getPlayerJackpotInfo", 0, 0, 0);
  if (depositedWhenAnim.length > 0) {
    setTimeout(() => {
      let itemAmount = 0;
      let depositedLength = depositedWhenAnim.length;

      for (let i = 0; i < depositedLength; i++) {
        const offer = depositedWhenAnim.pop();
        let sid2 = new SteamID(`[U:1:${offer.partner.accountid.toString()}]`);
        var steam64 = sid2.getSteamID64();
        console.log("Deposit the qued items to the current pot.");
        depositedItems(offer, steam64, itemAmount);
      }
    }, 2500);
  }
}

function getMessages(socket) {
  //Get the first 30 chat messages
  let query =
    "select * from ( select * from `chat` order by `date` desc limit 30 ) t order by `date` asc";
  db.query(query, (err, results) => {
    //Send the 30 latest messages to the specific client
    socket.emit("getMessageFirst", results);
  });
}

function getJackpotHistory(socket) {
  let query = "SELECT * FROM `history` ORDER BY id DESC LIMIT 5";
  db.query(query, (err, results) => {
    //Send the 5 latest jackpot-history to the specific client
    socket.emit("getJackpotHistory", results);
  });
}

function getWinnerOfTheDay(socket) {
  query = "select * FROM `history` WHERE date > now() - interval 24 hour;";
  db.query(query, (err, results) => {
    //Send the 5 latest jackpot-history to the specific client
    if (results[0] != null) {
      let winnerOfToday = results[0];
      for (let i = 0; i < results.length; i++) {
        if (results[i].chance < winnerOfToday.chance) {
          winnerOfToday = results[i];
        }
      }
      socket.emit("getWinnerOfDay", winnerOfToday);
    }
  });
}

function updateMessageSent(socket) {
  // Listen for a message from a specific client
  socket.on("chatMessage", (msg, user, avatar, steam64id) => {
    let userDeposited = new SteamID(steam64id);
    if (userDeposited.isValid()) {
      // Send that message to all clients
      io.emit("message", msg, user, avatar, steam64id);

      //Insert that message to the database
      let query = `INSERT INTO chat (name, image, message, steamid) VALUES (?, ?, ?, ?);`;
      db.query(query, [user, avatar, msg, steam64id], (err, rows) => {
        if (err) throw err;
      });
    }
  });
}

function updateNewUser(socket) {
  socket.on("newConnection", (data) => {
    let newConnected = new SteamID(data.steam64);
    if (newConnected.isValid()) {
      query = `SELECT *FROM users WHERE steam64id="${data.steam64}";`;
      db.query(query, (err, results) => {
        //USER EXIST UPDATE IT
        if (results.length > 0) {
          query = `UPDATE users SET name = "${data.personaname}" WHERE steam64id = "${data.steam64}";`;
          db.query(query, (err, results) => {});
          query = `UPDATE users SET socketID = "${socket.id}" WHERE steam64id = "${data.steam64}";`;
          db.query(query, (err, results) => {});
        }
        //USER DOES NOT EXIST ADD THEM
        else {
          query = `INSERT INTO users VALUES ("${data.steam64}","${data.personaname}","${data.avatar}", "${data.avatarBig}", "${socket.id}", "NULL");`;
          db.query(query, (err, results) => {});
        }
      });
      getPlayerLiveJackpotStats(data.steam64, socket.id);
    }
  });
}

function playAnimSound() {
  io.emit("playAudio");
}

function playDepositSound() {
  io.emit("playDepositAudio");
}

bot.manager.on("newOffer", (offer) => {
  console.log("offer detected");
  if (offer.partner.getSteamID64() === "76561198170412043") {
    offer.accept((err, status) => {
      if (err) {
        console.log(err);
      } else {
        console.log(status);
      }
    });
  } else {
    console.log("unknown sender");
    offer.decline((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("trade from stranger declined");
      }
    });
  }
});

//start the server
server.listen(PORT);
