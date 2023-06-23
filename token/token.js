const jwt = require("jsonwebtoken");
const fs = require("fs");
const jose = require("node-jose");
const express = require("express");
const app = express();
const port = 3000;

async function generateKeystore() {
  let keystore = jose.JWK.createKeyStore();
  await keystore.generate("RSA", 2048, {
    alg: "RS256",
    use: "sig",
  });
  return keystore;
}

function startPort() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
/* let privateKey = fs.readFileSync("./token/privateKey.pem", "utf8");
let publicKey = fs.readFileSync("./token/publicKey.pem", "utf8");

const token = jwt.sign({ email: "costventures" }, privateKey, {
  expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
  algorithm: "RS256",
}); */

//SERVER

//console.log(jwt.verify(token, publicKey));

async function main() {
  let keystore = await generateKeystore();
  startPort();

  const keys = keystore.toJSON(true);

  const input = Buffer.from("Hallo", "utf8");

  // {input} is a Buffer
  const token = await jose.JWS.createSign(keys.keys[0]).update(input).final();

  app.get("/.well-known/jwks.json", (req, res) => {
    res.json(keystore.toJSON());
  });
  console.log("well-known");

  app.get("/token", (req, res) => {
    res.json({ token: token });
  });
  console.log("token");

  console.log(keys.keys[0]);

  const verify = await jose.JWS.createVerify(keystore).verify(token);
  console.log(verify);
}

main();
