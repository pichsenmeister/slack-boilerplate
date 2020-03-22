require("dotenv").config();
const { App, ExpressReceiver } = require("@slack/bolt");
const oauth = require("./oauth");
const payloads = require("./payloads");
const store = require("./store");

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const app = new App({
  authorize: oauth.authorize,
  receiver: expressReceiver,
  logLevel: "DEBUG"
});

const express = expressReceiver.app;

// ping function to keep glitch alive
express.get("/ping", (req, res) => {
  console.log("<3");
  return res.send("pong");
});
// oauth urls
express.get("/install", oauth.install);
express.get("/redirect", oauth.redirect);


app.shortcut(/w*/, async ({ ack, context, body }) => {
  ack();

  console.log(body)
});

app.action(/w*/, async ({ ack, action, context }) => {
  ack();
  console.log(action)
});

app.view(/w*/, async ({ ack, view, context }) => {
  ack();
  
  console.log(view)
});

/**
app home opened listener to 
- render CTAs and sticker sets in home tab
- send a welcome message in messages tab if applicable
**/
app.event("app_home_opened", async ({ event, body, context }) => {

  if (event.tab === "home") {
    return app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: payloads.home.home({user: event.user})
    });
  }

  if (event.tab === "messages") {
    return app.client.chat.postMessage({
      token: context.botToken,
      channel: event.channel,
      blocks: payloads.messages.hello({user: event.user})
    });
  }
});

/**
get user from store
if user doesn't exist in store, save user to store and open the DM channel
**/
const getUser = async (context, userId, teamId) => {
  let user = await store.findUser(userId);
  // create users is not stored, open IM with user and store info
  if (!user) {
    const im = await app.client.conversations.open({
      token: context.botToken,
      users: userId
    });
    user = await store.saveUser(userId, {
      team_id: teamId,
      im: im.channel.id
    });
  }
  return user;
};

app.error(error => {
  console.error(error);
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
