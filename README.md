![Node.js CI](https://github.com/michaeldipper-sky/isthereanydeal-bot/workflows/Node.js%20CI/badge.svg?branch=master)

# isthereanydeal-bot
Discord Bot for integrating IsThereAnyDeal.com

Makes use of the IsThereAnyDeal API available here: https://itad.docs.apiary.io/#

## Prerequisites
* Node 14

## Running the bot
* Work out how to add it to your Discord server (Google is your friend)
* Setup environment variables for IsThereAnyDeal and Discord
  * `ITAD_API_KEY`: Available after creating an account at https://isthereanydeal.com/dev/app/
  * `DISCORD_TOKEN`: Available after creating a Discord bot at https://discordapp.com/developers/applications
* Run `npm install`
* Run `npm start`

## Running the unit tests
* Run `npm install` (if you haven't already)
* Run `npm test`

## Troubleshooting
* Set the logger to debug mode using the `LOGGER_MODE` environment variable: `export LOGGER_MODE=debug`
* That's it.
