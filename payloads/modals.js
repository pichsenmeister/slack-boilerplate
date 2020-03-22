const utils = require("./utils");

module.exports = {
  // views
  hello: context => {
    return {
      callback_id: "hello:world",
      type: "modal",
      title: {
        type: "plain_text",
        text: "Hello world!",
        emoji: true
      },
      submit: {
        type: "plain_text",
        text: "Create",
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Hello ${context.user}!`
          }
        }
      ]
    };
  }
};
