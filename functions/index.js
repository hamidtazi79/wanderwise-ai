/* eslint-disable require-jsdoc, max-len, object-curly-spacing */
const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

exports.metaCompleteRegistration = functions.auth.user().onCreate(async (user) => {
  const cfg = functions.config() || {};
  const meta = cfg.meta || {};
  const pixelId = meta.pixel_id;
  const token = meta.capi_token;

  if (!pixelId || !token) {
    console.warn("Missing meta.pixel_id or meta.capi_token in functions config");
    return null;
  }

  const email = (user.email || "").trim().toLowerCase();
  const em = email ? sha256(email) : null;

  const payload = {
    data: [
      {
        event_name: "CompleteRegistration",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://www.wanderwise.uk/",
        user_data: em ? { em: [em] } : {},
        custom_data: {
          signup_method:
            (user.providerData && user.providerData[0] && user.providerData[0].providerId) || "unknown",
        },
      },
    ],
    
  };

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) console.error("Meta CAPI error:", json);
  else console.log("Meta CAPI success:", json);

  return null;
});
