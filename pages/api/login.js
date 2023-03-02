const ObjectId = require("mongo-objectid");
const fs = require("fs");
const jose = require("node-jose");
const ms = require("ms");

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send("Please pass userId in request query");
  }
  // ! important: Please create your own keys
  const JWKeys = fs.readFileSync("keys.json");
  const keyStore = await jose.JWK.asKeyStore(JWKeys.toString());
  const [key] = keyStore.all({ use: "sig" });
  const opt = { compact: true, jwk: key, fields: { typ: "jwt" } };
  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + ms("1d")) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: "pubg-game-verifier",
    appName : "ludoKing",             // appName : e.g ludo (should be provided by client itself during jwtToken generation of its users)
    // id: id.hex,
    uid: userId,
  });
  const token = await jose.JWS.createSign(opt, key).update(payload).final();
  res.json(token);
}
