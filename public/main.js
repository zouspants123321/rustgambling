function addItem(item, element) {
  if (!element.hasClass("itemSelected")) {
    element.addClass("itemSelected");
    items.push(item);
  } else {
    element.removeClass("itemSelected");
    removeItemOnce(items, item);
  }
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
/*SCROLL BAR*/
var objDiv = document.getElementById("parentDiv");
objDiv.scrollTop = objDiv.scrollHeight;

window.setInterval(function () {
  var elem = document.getElementById("parentDiv");
  elem.scrollTop = elem.scrollHeight;
}, 1000);

$(document).ready(function () {
  drawCircle(0);
});

/*DRAW THE CIRCLE JACKPOT THING*/
function drawCircle(itemCount, totalDollar, timeleft) {
  var perc = itemCount / 60;
  var percRadians = perc * (2 * Math.PI);

  var c = $("#items-canvas")[0];
  var ctx = c.getContext("2d");

  var cSize = c.width;

  /*
ctx.rect(0, 0, cSize, cSize);
ctx.fillStyle = 'white';
ctx.fill();
  */

  //Draw gray background circle
  ctx.beginPath();
  ctx.arc(cSize / 2, cSize / 2, cSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "#40454a";
  ctx.fill();

  //Draw part of circle taken up
  ctx.beginPath();
  ctx.moveTo(cSize / 2, cSize / 2);
  ctx.lineTo(cSize / 2, (cSize * 3) / 4);
  ctx.arc(
    cSize / 2,
    cSize / 2,
    cSize / 2,
    Math.PI / 2,
    Math.PI / 2 - percRadians,
    true
  );
  ctx.lineTo(cSize / 2, cSize / 2);
  ctx.fillStyle = "orange";
  ctx.fill();

  //Draw white circle in the middle
  ctx.beginPath();
  ctx.arc(cSize / 2, cSize / 2, (cSize * 3) / 8, 0, Math.PI * 2, true);
  ctx.fillStyle = "#3a3f44";
  ctx.fill();
  updateText(itemCount, totalDollar, timeleft);
}

function updateText(itemCount, totalDollar, timeleft) {
  var c = $("#items-canvas")[0];
  var ctx = c.getContext("2d");

  //TEXT INSIDE THE CANVAS
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white"; // a color name or by using rgb/rgba/hex values
  if ((itemCount || totalDollar || timeleft) != null) {
    ctx.fillText(itemCount + "/60", 125, 80); // text and position
    ctx.fillText("$" + totalDollar.toFixed(2), 125, 120); // text and position
    ctx.fillText(timeleft + "s", 125, 160); // text and position
  } else {
    ctx.fillText("0/60", 125, 80); // text and position
    ctx.fillText("$0.00", 125, 120); // text and position
    ctx.fillText("120s", 125, 160); // text and position
  }
}

var socket = io();
socket.on("connect", () => {
  socket.emit("newConnection", {
    steam64: steam64id,
    personaname: personaname,
    avatar: avatar,
    avatarBig: avatarBig,
  });
});

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const jackpotHistory = document.querySelector(".jackpot-History-Holder");
const winnerOfToday = document.querySelector(".winnerToday");
const userChanceLive = document.querySelector(".ChanceID");
const userValueLive = document.querySelector(".ValueID");
const userItemsLive = document.querySelector(".ItemsID");
let myAudio = document.getElementById("audio");
let skins = document.querySelector(".skins");
let update = document.querySelector(".update");
let getRoundHistory = document.getElementById("roundHistory");
let navModal = document.getElementById("navmodalcontent");
let navModalTitle = document.getElementById("navmodaltitle");
let tradeurll = "";
const myDepositAudio = document.getElementById("audioDeposit");
const winningSound = document.getElementById("winningSound");

let tradeurlll = "";
let tradebtnnn = "";

//Deposit selected items
function depositItems() {
  socket.emit("deposit", {
    assetid: items,
    steam64: steam64id,
  });
}

//Refresh inv
function refreshItems() {
  items.length = 0;
  socket.emit("updateInventory", {
    steam64: steam64id,
  });
}

socket.on("successTrade", (data) => {
  const accTrades = "https://steamcommunity.com/tradeoffer/" + data;
  Swal.fire({
    title: "<h2>Your trade offer has been sent!</h2>",
    icon: "success",
    html: "<p> This is the only trade that is legit. Please decline all other offers!</p>",
    showConfirmButton: false,
    allowOutsideClick: false,
    footer:
      "<a onClick='swal.close()' class='btn btn-success' target='_blank' href=" +
      accTrades +
      ">Trade offer</a>",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
});

socket.on("successWon", (data) => {
  playWinningSound();
  fireworks();
  const accTrades = "https://steamcommunity.com/tradeoffer/" + data;
  Swal.fire({
    title:
      "<h2 style='color: #007c0e;'>You just won the jackpot! congratulations!</h2>",
    showConfirmButton: false,
    allowOutsideClick: false,
    footer:
      "<a onClick='swal.close()' class='btn btn-success' target='_blank' href=" +
      accTrades +
      ">Trade offer</a>",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
});

socket.on("failureTrade", () => {
  Swal.fire({
    title: "<h2>Could not send trade offer!</h2>",
    icon: "error",
    html: "<p> Make sure you have a valid trade url in your profile! and that steam is up https://steamstat.us/. If it is neither of those please wait up to 10 minutes. If this still occurs, send a support ticket.</p>",
    confirmButtonText: "Ok",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
});

socket.on("failureWon", () => {
  Swal.fire({
    title: "<h2>Some error occured!</h2>",
    icon: "error",
    allowOutsideClick: false,
    html: "<p>Please submit a support ticket, an error have occured when sending the winnings!</p>",
    confirmButtonText: "Ok",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
});
socket.on("enableModal", (canTrade) => {
  if (canTrade) {
    $("#exampleModal").modal("show");
    $(".skins").html("");
  } else {
    $("#exampleModald").modal("show");
    $(".update").html("");
  }
});

socket.on("updateInventory", (data, steamid, canTrade) => {
  console.log(canTrade);
  if (canTrade) {
    for (let i = 0; i < data.length; i++) {
      const div = document.createElement("a");
      div.setAttribute("href", "#");
      //div.classList.add("history-info");
      div.innerHTML = `<a href="#">
      <div class="skin-box" onclick="addItem(this.getAttribute('data-assetid'), $(this))" data-assetid="${data[i].assetid}"data-steam64="${steamid}">
        <p>${data[i].name} </p>
        <img class="item-pic" src="https://community.cloudflare.steamstatic.com/economy/image/${data[i].img}"/>
        <p> $${data[i].price}</p>
      </div>
    </a>`;
      skins.appendChild(div);
    }
  } else {
    const div = document.createElement("div");
    //div.classList.add("history-info");
    div.innerHTML = `<h3>Save your trade URL</h3>
    <p>Please make sure the trade url is valid or we won't be able to send you trade offers. You can find your trade url <a href="https://steamcommunity.com/id/ZouSPantS/tradeoffers/privacy" target="_blank">here</a></p>
    <form class="form-group" onsubmit="return mySubmitFunction(event)">
      <input id="tradeurll" type="text" autocomplete="off" class="form-control" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=xxxxxxxxx&token=xxxxxxxx" style="width: 92%"></input>
      <button style="margin-top: 20px;" id="tradeBtnn" onClick="getURL();" class="btn btn-primary">Save</button>
    </form>`;
    update.appendChild(div);
    tradeurlll = document.getElementById("tradeurll");
    tradebtnnn = document.getElementById("tradeBtnn");
    getURL();
  }
});

//Chat timer
var startvalue = 8;
var timer = startvalue;

$(document).ready(function () {
  timer = 1;
});

function decreaseTimer() {
  timer--;
}

setInterval(decreaseTimer, 1000);

// Message from server
socket.on("message", (message, user, avatar, steam64id) => {
  outputMessage(message, user, avatar, steam64id);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Get the first 30 messages
socket.on("itemsDeposited", (totalAmount, totalDollar, timeleft, items) => {
  document.title = `$${totalDollar.toFixed(2)} | Jackpot | Rustfunpot.com`;
  drawCircle(totalAmount, totalDollar, timeleft);
  $("#allItemsHere").html(items);
});

socket.on("getAnim", (data) => {
  $("#roulet ul").html(data);
  $("#roulet ul").append(data);

  var dv = 0;
  //Show the pictures
  $("#roulet").toggle("fast", function () {
    //Wait just a litte to make sure all the pictures are loaded.
    setTimeout(function () {
      //Calculate the position of the winners picture
      var div = $(".wcont").width();
      dv = div / 2;

      var p = $(".winnerr").position();
      var w = $("#roulet ul").position();

      var e = p.left - w.left - dv; // -30
      var d = p.left - w.left - dv + 100;
      //Set a random position so the arrow is not aways on the center of the picture
      pos = (e + d) / 2;
      //var pos = randomIntFromInterval(e, d);

      //Adds last rounds picture again just in case the winners picture is the last one, so the animation doesnt end on an empty space
      $("#roulet ul").append(data);

      //Animate so the winner picture shows in the center of the page =D
      $("#roulet ul").animate(
        {
          marginLeft: "-" + pos + "px",
        },
        5000,
        "easeOutQuart",
        function () {
          setTimeout(function () {
            $("#roulet").toggle("slow", function () {
              $("#roulet ul").css("margin-left", "-8px").html("");
              $("#allItemsHere").html("");
            });
          }, 5000);
        }
      );
    }, 500);
  });
});

socket.on("playAudio", () => {
  myAudio.play();
});

socket.on("playDepositAudio", () => {
  myDepositAudio.play();
});

function playWinningSound() {
  winningSound.play();
}
//Get the first 30 messages
socket.on("getMessageFirst", (results) => {
  for (let i = 0; i < results.length; i++) {
    const div = document.createElement("div");
    div.classList.add("chat-input");
    let message = removeHTML(results[i].message);
    let name = removeHTML(results[i].name);
    div.innerHTML =
      `<a href="https://steamcommunity.com/profiles/` +
      results[i].steamid +
      `" target="_blank"> <p> <img src="${results[i].image}"class="chat-avatar"/> </a>${name}: ${message} </p>`;
    chatMessages.appendChild(div);
  }
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Get the winner of the today
socket.on("getWinnerOfDay", (results) => {
  $(".winnerToday").html("");
  const div = document.createElement("a");
  div.setAttribute("href", "#" + results.id + "");
  div.setAttribute("onclick", "getRound(" + results.id + ");");
  //div.classList.add("history-info");
  div.innerHTML = `
    <div class="left-content-largest-player">
     <img class="avatar-picture" src="${results.image}">
     <div>
     <p>${results.name}</p>
     <p>Won $${results.won} with a ${results.chance}% Chance</p>
     <p>Ticket: ${results.ticket}</p>
    </div>
    </div>
    `;
  winnerOfToday.appendChild(div);
});

//Get the 5 latest jackpot rounds
socket.on("getJackpotHistory", (results) => {
  $(".jackpot-History-Holder").html("");
  for (let i = 0; i < results.length; i++) {
    const div = document.createElement("a");
    //ha round-id sätt in, o sen typ få tbx den rundan me den unika idn! fixa fixa fixa fixa
    div.setAttribute("href", "#" + results[i].id + "");
    div.setAttribute("onclick", "getRound(" + results[i].id + ");");

    //div.classList.add("history-info");
    div.innerHTML = `<div class="left-content-jackpot-winners">
    <img class="avatar-picture" src="${results[i].image}">
    <div>
    <p> ${results[i].name} </p>
    <p> Won ${results[i].won}$ with a ${results[i].chance}% Chance </p>
    <p> Ticket: ${results[i].ticket} </p>
    </div>
    </div>
    </a> `;
    jackpotHistory.appendChild(div);
  }
});

socket.on(
  "getProfileBack",
  (avatar, totalWon, deposited, url, profit, participations) => {
    getProfile(avatar, totalWon, deposited, url, profit, participations);
  }
);

socket.on("sendBackHistory", (id, name, won, chance, avatar) => {
  getMyHistory(id, name, won, chance, avatar);
});

function getRound(RoundID) {
  $("#jackpotHistory").modal("show");

  socket.emit("getRound", RoundID);
}

function getNav(id) {
  $("#navmodalcontent").html("");
  $("#navmodaltitle").html("");
  $("#nav-modal").modal("show");
  switch (id) {
    case 0:
      getFAQ();
      break;
    case 1:
      getTOS();
      break;
    case 2:
      break;
    case 3:
      getSupport();
      break;
    case 4:
      socket.emit("getMyProfile", steam64id);
      break;
    case 5:
      socket.emit("getMyHistory", steam64id);
      const title = document.createElement("div");
      title.innerHTML = `<h3 class="modal-title" id="exampleModalLabel">LAST 100 BATTLES</h3>`;
      navModalTitle.appendChild(title);
      break;
  }
}

function getFAQ() {
  const title = document.createElement("div");
  title.innerHTML = `<h3 class="modal-title" id="exampleModalLabel">Freqently asked questions</h3>`;
  navModalTitle.appendChild(title);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
      What is Rustfunpot.com, and how does the jackpot work?
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      Rustfunpot is a 3rd party service using rust items with their inital value to take place in the jackpot. Jackpot is a game for as many players as possible.
      You deposit Rust skins into the pot and will recieve a certain percentage depending on how much was deposited. The more you deposit, the higher percentage you will obtain, 
      therefore giving you the higher chance to win.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        How do i enter the jackpot?
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      Click on the deposit button and choose as many skins as you'd like to deposit. 
      After this confirm the trade and open your mobile and accept the Steam confirmation via the Steam app.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      How do i setup my account to join the jackpot?
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      Click login in the top right hand corner of the screen, once logged in, 
      go to profile and follow the instruction on screen set your Steam trade link. (Note: Your Steam Inventory MUST be set to Public to play on our site)      </div>
    </div>
  </div>
</div>
<div class="accordion-item">
    <h2 class="accordion-header" id="headingFour">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
      Why is my inventory not loading?
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      Make sure that your Steam inventory is public. Make sure your Steam trade link is properly set. If you've just recieved new items, wait a couple of minutes then refresh the page, 
      If 10 minutes has surpassed and your inventory still won't load, please contact support using the buttons at the top of the page. Some items may not be displayed because our website dont accept them
      due to certain reasons.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingFive">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
      How to accept your winnings.
      </button>
    </h2>
    <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      After winning a Jackpot a module will appear a few seconds after with a link to your winnings. 
      Make sure to accept the trade offer in your Steam trade offers almost instantly to avoid any possible problems.
       Winning trade offers will last for a short amount of time before being canceled. if this happends to you you can contact support with 
       the gameid of the round you are having issues with.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingSix">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
      What are jackpot tickets?
      </button>
    </h2>
    <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      Jackpot is a ticket based game. Where if you deposit items within first into the pot you will then have low tickets. 
      If you deposit within last you will then have high tickets.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingSeven">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
      What are commission?
      </button>
    </h2>
    <div id="collapseSeven" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
        Commission is a certain percentage the the house will take. This percentage is normally 0-10% but if put "rustfunpot.com" in your steam name and relog from the website, 
        the site will only take 0-5%. This percentage is depending on the winning value and not on the overall pot. So if you deposit $100 and nobody deposits, the house will take 0% commision. 
        If you deposit $100 and another person deposit $100, the house will take a commision of 0-(5/10)% of the $100. so around 5-10€.
      </div>
    </div>
  </div>
  
  `;

  navModal.appendChild(div);
}

function getTOS() {
  const title = document.createElement("div");
  title.innerHTML = `<h3 class="modal-title" id="exampleModalLabel">Terms of service</h3>`;
  navModalTitle.appendChild(title);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
      Legal Notice
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      The terms and conditions set out below (the "Terms and Conditions") apply to and govern any services used by you ("You", the "user") 
      and marketed by us under the brand name "Rustfunpot" including any services provided through any website with a domain name ending "Rustfunpot.com"
       (the "Website"), and to any email and other correspondence between us relating to such a service.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
      Bet participation
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      By placing a bet on Rustfunpot.com you are 18 years of age or over, of sound mind and capable of taking responsibility for your own actions.
       Rustfunpot.com comes with no guarantees, expressed or implied, in connection with the service which is provided to you "as is" and we provide you with no warranty whatsoever
        regarding its quality, completeness or accuracy. As such, Rustfunpot.com cannot be held responsible in any event, direct, indirect or consequential with the use of the website. 
        Rustfunpot.com reserves the right to suspend and/or cancel any bet/wager at any time. When a platform is suspended, any bets entered will be on hold. Rustfunpot.com also reserves 
        the right to cease betting at any time without notice.
        We use this ruling to protect ourselves. So all we ask in return to avoid these problems is that you accept your winnings instantly and do not go AFK while playing on the website.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      Deposit, withdraw or lost items
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      If any loss occur during a bet caused by a software or network issue, you have 12 hours to make a claim by emailing us at "contact@rustfunpot.com" 
      or contacting our discord support, after which these items will be considered surrendered. We strongly encourage you to withdraw your winning as 
      soon as possible to avoid any issues. However the total value won will stay the same. Rustypot.com will have 0% comission. 
      </div>
    </div>
  </div>
</div>
<div class="accordion-item">
    <h2 class="accordion-header" id="headingFour">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
     Content
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      The content of the pages of this website is for your general information and use only. It is subject to change without notice. 
      This website contains material which is owned by us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. 
      Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingFive">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
      Affiliation
      </button>
    </h2>
    <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample" style="">
      <div class="accordion-body">
      Rustfunpot.com is not affiliated with Valve Corporation, Rust or any other trademarks of the Valve Corporation.
      </div>
    </div>
  </div>
  `;

  navModal.appendChild(div);
}

function getEmail() {
  const text = document.getElementById("emailText").value.trim();
  const email = document.getElementById("emailEmail").value.trim();
  const subject = document.getElementById("emailSubject").value.trim();

  const data = {
    text,
    subject,
    email,
  };
  if (text != "" && email != "" && subject != "") {
    socket.emit("getEmail", data);

    Swal.fire({
      title: "<h2>Email sent!</h2>",
      icon: "success",
      html: "<p> Please be patient, a response will take up to 48hours.</p>",
      confirmButtonText: "close",
      timer: 10000,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then(function () {
      $(".modal").modal("hide");
      document.getElementById("emailText").value = "";
      document.getElementById("emailEmail").value = "";
      document.getElementById("emailSubject").value = "";
    });
  }
}

function getSupport() {
  const title = document.createElement("div");
  title.innerHTML = `<h3 class="modal-title" id="exampleModalLabel">Support</h3>`;
  navModalTitle.appendChild(title);

  const div = document.createElement("div");
  div.innerHTML = `<form id="supportForm" onsubmit="return mySubmitFunction(event)"> 
  <fieldset>
    <div class="form-group">
      <label for="exampleInputEmail1" class="form-label mt-4">Email address</label>
      <input type="email" class="form-control" id="emailEmail" aria-describedby="emailHelp" placeholder="Enter your e-mail address">
    </div>

    <div class="form-group">
  <label class="col-form-label mt-4" for="inputDefault">Subject</label>
  <input type="text" class="form-control" placeholder="Subject" id="emailSubject">
</div>
    
    <div class="form-group">
      <label for="exampleTextarea" class="form-label mt-4">Describe the situation</label>
      <textarea id="emailText" placeholder="Example:\n Round #1 \n Steam64id: xxxxxxxxxxxxxxx \n Date: xxxx-xx-xx xx:xx \n trade url \n (Explain what the issue is)" class="form-control" id="exampleTextarea" rows="3" style="height: 185px;"></textarea>
      <small id="emailHelp" class="form-text text-muted">— The round of the game. <br></small>
      <small id="emailHelp" class="form-text text-muted">— Your steam 64 id. <br></small>
      <small id="emailHelp" class="form-text text-muted">— Date of the round. <br></small>
      <small id="emailHelp" class="form-text text-muted">— Trade url. <br></small>
      <small id="emailHelp" class="form-text text-muted">— (Enter as detailed as possible) <br></small>
    </div>
    
    <button style="margin-top: 20px;" type="submit" class="btn btn-primary" onClick="getEmail()">Submit</button>
  </fieldset>
</form>`;

  navModal.appendChild(div);
}

function getProfile(avatar, totalWon, deposited, url, profit, participations) {
  if (url == "NULL") {
    url =
      "https://steamcommunity.com/tradeoffer/new/?partner=xxxxxxxxx&token=xxxxxxxx";
  }
  const title = document.createElement("div");
  title.innerHTML = `<h3 class="modal-title" id="exampleModalLabel">Profile</h3>`;
  navModalTitle.appendChild(title);

  const div = document.createElement("div");
  div.innerHTML = `<div style="margin-bottom: 30px" class="row">
  <div class="col-md-3">
     <img style="height: 100%" src="${avatar}" class="profile">
  </div>
<div class="col-md-2">
  <div class="profileStats"> 
    <p> ${participations} <br> PARTICIPATIONS </p>
  </div>
</div>
<div class="col-md-2">
  <div class="profileStats"> 
  <p> $${deposited} <br> DEPOSITED</p>
  </div>
</div>
<div class="col-md-2">
  <div class="profileStats"> 
  <p>$${totalWon} <br> TOTAL WON</p>
  </div>
</div>
<div class="col-md-2">
  <div class="profileStats"> 
  <p> $${profit} <br> PROFIT</p>
  </div>
</div>
</div>
<h3>Save your trade URL</h3>
<p>Please make sure the trade url is valid or we won't be able to send you trade offers. You can find your trade url <a href="https://steamcommunity.com/id/ZouSPantS/tradeoffers/privacy" target="_blank">here</a></p>
<form class="form-group" onsubmit="return mySubmitFunction(event)">
  <input id="tradeurl" type="text" autocomplete="off" class="form-control" placeholder="${url}" style="width: 92%"></input>
  <button id="tradeBtn" class="btn btn-primary">Save</button>
</form>
<div class="battleHistory">

</div>`;

  navModal.appendChild(div);

  tradeurll = document.getElementById("tradeBtn");
  getURL();
}

function mySubmitFunction(e) {
  e.preventDefault();
  return false;
}

function getMyHistory(id, name, won, chance, avatar) {
  const div = document.createElement("a");
  div.setAttribute("href", "#" + id + "");
  div.setAttribute("onclick", "getRound(" + id + ");");

  div.innerHTML = `
  <div style="width: 100% height: 50px; background-color: #1d2022;">
    <div class="row" style="margin-top: 0px; align-items: center; border-bottom: 1px solid #fff; border-top: 1px solid #fff;">
      <div class="col">
        <p> #${id} </p>
      </div>
      <div class="col">
        <p><img style="border-radius: 100%; width: 48px; height: 48px;" src="${avatar}"> ${name}</p>
      </div>
      <div class="col">
        <p>${won} $</p>
      </div>
      <div class="col">
    <p> ${chance}%</p>
    </div>
  </div>
</div>
`;

  navModal.appendChild(div);
}

socket.on("getRoundInformation", (winner, history) => {
  $("#roundHistory").html("");
  const div = document.createElement("div");
  div.innerHTML =
    `<h3 style="text-align: center; color: gold; margin-top: 20px; padding-top: 20px; border-top: 1px solid gold;">
  ` +
    winner[0].name +
    `
</h3>`;

  div.innerHTML +=
    `
<h4 style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid gold;">
  Won: <span style="color: gold;">` +
    winner[0].won +
    `$</span> with a <span style="color: gold;">` +
    winner[0].chance +
    `%</span> Chance<br>Ticket: <span style="color: gold;">` +
    winner[0].ticket +
    `</span>
  </h4>
  <h5 style="text-align: center; margin-bottom: 20px; ">
    Items in round #` +
    winner[0].id +
    `
  </h5>`;
  for (let i = 0; i < history.length; i++) {
    div.innerHTML +=
      `
  <div class="middle-current-items-pot"><div>
  <a href="https://steamcommunity.com/profiles/` +
      history[i].steamId +
      `" target="_blank"> <img style="width: 64px; height=64px; margin-left: 30px" src="` +
      history[i].userImage +
      `"/></a>
  </div>
  <p>` +
      history[i].username +
      ` deposited: ` +
      history[i].item +
      ` - ` +
      history[i].price +
      `$</p>
  <div>
  <img style="width: 64px; height=64px; margin-right: 30px" src="https://community.cloudflare.steamstatic.com/economy/image/` +
      history[i].itemImage +
      `"/>
  </div>
  </div>
`;
  }
  getRoundHistory.appendChild(div);
});

socket.on("getPlayerJackpotInfo", (userValue, userChance, userItems) => {
  $(".ChanceID").html("");
  $(".ValueID").html("");
  $(".ItemsID").html("");
  const div = document.createElement("p");
  div.innerHTML = `Your chance: <br> ${userChance}%`;
  userChanceLive.appendChild(div);

  const div2 = document.createElement("p");
  div2.innerHTML = `Your Items: <br> ${userItems}`;
  userValueLive.appendChild(div2);

  const div3 = document.createElement("p");
  div3.innerHTML = `Your Value: <br> $${userValue}`;
  userItemsLive.appendChild(div3);
});

// Message submit (input from chatForm)
if (chatForm != null) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.elements.msg.value.length > 0 && timer < 0) {
      //Reset chat timer
      timer = startvalue;

      // Get message text
      const msg = e.target.elements.msg.value;

      // Emit message from client to server
      socket.emit("chatMessage", msg, personaname, avatar, steam64id);

      // Clear input
      e.target.elements.msg.value = "";
      e.target.elements.msg.focus();
    } else if (e.target.elements.msg.value.length > 0 && timer > 0) {
      const div = document.createElement("div");
      div.classList.add("chat-input");
      div.innerHTML = `<p> Please slow down! </p>`;
      chatMessages.appendChild(div);

      e.target.elements.msg.value = "";
      e.target.elements.msg.focus();
    }
  });
}

function getURL() {
  if (tradeurll != "") {
    tradeurll.addEventListener("click", (e) => {
      addUrl(e, 1);
    });
  }
  tradebtnnn.addEventListener("click", (e) => {
    console.log("123");
    addUrl(e, 2);
  });
}

function addUrl(e, input) {
  e.preventDefault();
  let value = "";

  if (input == 1) {
    value = document.getElementById("tradeurl").value;
  } else if (input == 2) {
    value = tradeurlll.value;
  }

  if (
    value != null &&
    value.length == 75 &&
    value.startsWith("https://steamcommunity.com/tradeoffer/new/?partner=")
  ) {
    Swal.fire({
      title: "<h2>Your trade-url has been updated!</h2>",
      icon: "success",
      confirmButtonText: "close",
      timer: 10000,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then(function () {
      $(".modal").modal("hide");
    });
    socket.emit("getURL", {
      url: value,
      steam64: steam64id,
    });
  } else {
    Swal.fire({
      title: "<h2>Invalid Trade-URL.</h2>",
      icon: "error",
      confirmButtonText: "close",
      timer: 10000,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
}

// Output message to DOM
function outputMessage(message, user, avatar, steam64id) {
  const div = document.createElement("div");
  let msg = removeHTML(message);
  let name = removeHTML(user);
  div.classList.add("chat-input");
  div.innerHTML =
    `<a href="https://steamcommunity.com/profiles/` +
    steam64id +
    `" target="_blank"> <p> <img src="${avatar}"class="chat-avatar"/> </a>${name}: ${msg} </p>`;
  chatMessages.appendChild(div);
}

function removeHTML(str) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || "";
}

/*
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
*/
function fireworks() {
  var end = Date.now() + 15 * 300;

  // eslint-disable-next-line @lwc/lwc/no-async-operation
  let interval = setInterval(function () {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    // eslint-disable-next-line no-undef
    confetti({
      startVelocity: 50,
      spread: 360,
      ticks: 600,
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2,
      },
    });
  }, 200);
}

function showDiv() {
  var x = document.getElementById("smileyBox");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function getEmojii(emojii) {
  document.getElementById("msg").value =
    document.getElementById("msg").value + emojii;
}
