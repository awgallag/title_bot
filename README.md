# Title Bot

I implemented Title Bot using React, Node.js, Express.js, CSS, and HTML.

## Installation

Open a terminal and navigate to the directory where you want to install the project folder.

Then enter the following command
```bash
git clone https://github.com/awgallag/title_bot.git
```
Navigate to the client folder within the title_bot directory.
```bash
cd title_bot
cd client
```
Then run the following command to install the required npm packages.
```bash
npm install
```
Then navigate back into the title_bot root directory and install the required npm packages for the server.
```bash
cd ..
npm install
```
After all of the npm packages are installed you can use the following command to run both the Node.js Express webserver and the React front-end environment concurrently on your system.
```bash
npm run titlebot
```
The React App should open automatically, but if it doesn't try opening a browser and entering localhost:3000 in the address bar.
## Notes
I noticed that some webpages won't run without being prefixed with 'www', however if you add this prefix to other webpages like 'accounts.google.com' then the url will no longer work. I could have added the prefix to urls after any initial failures and then sent them through another run of the algorithm, however the runtime would have been slow and users might get bored. Instead, I chose to display an error message that states 'Request failed try using the full url with prefixes'.

I also chose to add persistent memory to the front-end, with an option for users to remove any of the title/favicon pairs within their lists.

I hope you enjoy the app, I did.
