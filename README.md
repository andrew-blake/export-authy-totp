# Export Authy TOTP Secret Keys
* Install Authy desktop app (version 2.2.3; versions after that won't work).
* Run following commands

```
$ cd /Applications/Authy\ Desktop.app/Contents/Resources
$ npx asar extract app.asar /tmp/authy-src
$ cd /tmp/authy-src
$ npx electron . --remote-debugging-port=5858
Need to install the following packages:
  electron@24.1.3
Ok to proceed? (y) y

DevTools listening on ws://127.0.0.1:5858/devtools/browser/baad4677-3889-4d33-ba31-007d3888798c

$ npx electron . --remote-debugging-port=5858 '--remote-allow-origins=*'
```

* Authy app will launch 
* Enter your backup password to unlock
* Open the following URL in a Chrome (or Chromium-based) web browser: http://localhost:5858
* Click the Twilio Authy link in that webpage.
* In Chrome Developer Tools top navigation bar, go in the Sources tab (if you don't see it, click >> to expand the full list), then select the Snippets sub-tab (tabs on the second line; again, click >> to expand the full list), and finally choose + New snippet.
* If you'd like to ensure the code below doesn't send anything to a remote server, you can disconnect from the internet now.
* In the snippet editor window that appears on the right, paste the code from the `export-totp-snippet.js`
* Right-click the snippet name on the navigator pane on the left (eg. Script snippet #1) , and choose Run.
* All your Authy tokens will be displayed in the Console at the bottom; either copy-paste the TOTP URI, or scan the QR codes.
* JSON file is created. Save to this folder with a new date.
* If Authy locks, the QR codes will be cleared from the Console output.
