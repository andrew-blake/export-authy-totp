// Based on https://github.com/LinusU/base32-encode/blob/master/index.js
function hex_to_b32(hex) { let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; let bytes = []; for (let i = 0; i < hex.length; i += 2) { bytes.push(parseInt(hex.substr(i, 2), 16)); } let bits = 0; let value = 0; let output = ''; for (let i = 0; i < bytes.length; i++) { value = (value << 8) | bytes[i]; bits += 8; while (bits >= 5) { output += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5; } } if (bits > 0) { output += alphabet[(value << (5 - bits)) & 31]; } return output; }

// from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
function uuidv4() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }); }

// from https://gist.github.com/gboudreau/94bb0c11a6209c82418d01a59d958c93
function saveToFile(data, filename) { if (!data) { console.error('Console.save: No data'); return; } if (typeof data === "object") { data = JSON.stringify(data, undefined, 4) } const blob = new Blob([data], { type: 'text/json' }); const e = document.createEvent('MouseEvents'); const a = document.createElement('a'); a.download = filename; a.href = window.URL.createObjectURL(blob); a.dataset.downloadurl = ['text/json', a.download, a.href].join(':'); e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); a.dispatchEvent(e); }

function deEncrypt({ log = false, save = false }) {
  const folder = {
      id: uuidv4(),
      name: 'Imported from Authy'
  };

  const bw = {
      "encrypted": false,
      "folders": [
          folder
      ],
      "items": appManager.getModel().map((i) => {
          let secretSeed = i.secretSeed;
          if (typeof secretSeed == "undefined") {
              secretSeed = i.encryptedSeed;
          }
          const secret = (i.markedForDeletion === false ? i.decryptedSeed : hex_to_b32(secretSeed));
          const period = (i.digits === 7 ? 10 : 30);

          const [issuer, rawName] = (i.name.includes(":"))
              ? i.name.split(":")
              : ["", i.name];
          const name = [issuer, rawName].filter(Boolean).join(": ");
          const totp = `otpauth://totp/${name}?secret=${secret}&digits=${i.digits}&period=${period}${issuer ? '&issuer=' + issuer : ''}`;

          return ({
              id: uuidv4(),
              organizationId: null,
              folderId: folder.id,
              type: 1,
              reprompt: 0,
              name,
              notes: null,
              favorite: false,
              login: {
                  username: null,
                  password: null,
                  totp
              },
              collectionIds: null
          });
      }),
  };

  if (log) console.log(JSON.stringify(bw));
  if (save) saveToFile(bw, 'authy-to-bitwarden-export.json');
}

deEncrypt({
  log: true,
  save: true,
});