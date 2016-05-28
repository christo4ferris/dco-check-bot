# dco-check-bot
A webhook that checks for valid DCO1.1 sign-off in a pull request.

# Contributing
Pull requests welcome. Please see [contribution guidelines](CONTRIBUTING.md).

# Installation
1. Create a config.js using the [config.js.sample](config.js.sample) as a template. Use unique value for the
2. Modify the [manifest.yml](manifest.yml), chosing a matching host and name for the deployed webhook bot.
3. Deploy to cloud foundry with `cf push`
4. Issue a test event by using the GitHub web UI
