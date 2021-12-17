# Title Bot

I implemented title bot using React, Node.js, Expres.js, CSS, and HTML

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
## Notes
I noticed that some webpages won't run without being prefixed with 'www', however if you add this prefix to other webpages like 'accounts.google.com' then the url will no longer work. I could have made another http request after every initial failure with the added prefix however the runtime would have been slow and users might get bored. Instead, I chose to display an error message that states 'Request failed try using the full url with prefixes'.

I also chose to add persistent memory to the front-end, with the option to remove any of the title/favicon pairs.

I hope you enjoy the app, I did.