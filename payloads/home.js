const utils = require("./utils");

module.exports = {
  home: context => {
    return {
      type: "home",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Hello <@${context.user}>!`
          }
        }
      ]
    };
  }
};
