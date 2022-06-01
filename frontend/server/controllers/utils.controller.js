const jwt = require("jsonwebtoken");
const axios = require("axios");

const googleServiceCredential = require("../support-hp-317808-edfcf4b00faf.json");

exports.generateGoogleAccessToken = async (req, res) => {
  try {
    var OAuthCredential = {
      iss: "supporthp@support-hp-317808.iam.gserviceaccount.com",
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const signedJWT = jwt.sign(
      OAuthCredential,
      googleServiceCredential.private_key,
      {
        algorithm: "RS256",
      }
    );

    const OAuthResonse = await axios.post(
      "https://oauth2.googleapis.com/token",
      `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signedJWT}`
    );
    return res.status(200).json(OAuthResonse.data);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
