const SteamUser = require("steam-user");
const SteamCommunity = require("steamcommunity");
const TradeOfferManager = require("steam-tradeoffer-manager");
const { NULL } = require("mysql/lib/protocol/constants/types");

class SteamBot {
  constructor(logOnOptions) {
    this.client = new SteamUser();
    this.community = new SteamCommunity();
    this.manager = new TradeOfferManager({
      steam: this.client,
      community: this.community,
      language: "en",
      pollInterval: 5000, // We want to poll every 5 seconds since we don't have Steam notifying us of offers
    });

    this.logOn(logOnOptions);
  }

  logOn(logOnOptions) {
    this.client.logOn(logOnOptions);

    this.client.on("loggedOn", () => {
      console.log("Logged into Steam");

      this.client.setPersona(SteamUser.EPersonaState.Invisible, "Bot 1");
      //      this.client.gamesPlayed(730);
    });

    this.client.on("webSession", (sessionid, cookies) => {
      this.manager.setCookies(cookies);

      this.community.setCookies(cookies);
      this.community.startConfirmationChecker(
        10000,
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxx" // ACCOUNT SECRET
      );
    });
  }

  sendDepositTrade(partner, itemName, tradeurl, callback) {
    if (tradeurl != "NULL") {
      const offer = this.manager.createOffer(tradeurl);

      this.manager.getUserInventoryContents(
        partner,
        252490,
        2,
        true,
        (err, myInv) => {
          if (err) {
            console.log(err);
          } else {
            for (let i = 0; i < myInv.length; i++) {
              const item = myInv[i];
              for (let n = 0; n < itemName.length; n++) {
                if (item.assetid == itemName[n]) {
                  offer.addTheirItem(item);
                }
              }
            }
            offer.send((err, status) => {
              callback(
                err,
                status === "sent" || status === "pending",
                offer.id
              );
              if (!err) {
                console.log("Offer sent!");
              }
            });
          }
        }
      );
    }
  }

  sendWinnings(partner, itemName, tradeurl, callback) {
    this.manager.loadInventory(252490, 2, true, (err, myInv) => {
      if (err) {
        console.log(err);
      } else {
        const offer = this.manager.createOffer(tradeurl);

        for (let i = 0; i < myInv.length; i++) {
          const item = myInv[i];
          for (let n = 0; n < itemName.length; n++) {
            if (item.assetid == itemName[n]) {
              offer.addMyItem(item);
            }
          }
        }
        offer.setMessage(
          `congratulations you won a jackpot on rustfunpot.com!`
        );
        if (offer.send != null) {
          offer.send((err, status) => {
            callback(err, status === "sent" || status === "pending", offer.id);
          });
        } else {
          setTimeout(function () {}, 10000);
          console.log("Items could not be sent! the winner was: " + partner);
          sendWinnings(partner, itemName, tradeurl);
        }
      }
    });
  }
}

module.exports = SteamBot;
