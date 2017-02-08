# dco-check-bot
A simple webhook that checks for valid DCO1.1 sign-off in a pull request. 

*Note: if you wish to add a repository to the dco-bot already deployed, [contact me](mailto:chrisfer@us.ibm.com) for the secret key.*

## Contributing
Pull requests welcome. Please see [contribution guidelines](CONTRIBUTING.md).

## Installation
1. Create a config.js using the [config.js.sample](config.js.sample) as a template.
2. Choose a unique value for the webhook.secret, you'll also need to create an auth token for the auth.secret
3. Modify the [manifest.yml](manifest.yml), chosing a matching host and name for the deployed webhook bot.
4. Deploy to cloud foundry with `cf push`
5. Issue a test event by using the GitHub web UI

## Adding dco-bot to a repository
1. Open your GitHub repository's Settings dialog
2. Click on "Webhooks and services" in left-hand margin
3. Click "Add webhook" button
4. Set the URL to the value of the bot's hostname followed by /webhook (eg. http://mybot.mybluemix.net/webhook)
5. Set the value of the secret to the secret value in the config.js of the deployed bot
6. Select 'Let me select individual events.' and select the "Pull request" checkbox
7. Create the webhook
8. Test by sending a pull request
