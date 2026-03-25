"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaCompleteRegistration = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const crypto_1 = __importDefault(require("crypto"));
admin.initializeApp();
function sha256(value) {
    return crypto_1.default.createHash("sha256").update(value).digest("hex");
}
const META_PIXEL_ID = (0, params_1.defineString)("META_PIXEL_ID");
const META_CAPI_TOKEN = (0, params_1.defineSecret)("META_CAPI_TOKEN"); // ✅ secret
exports.metaCompleteRegistration = functions.auth.user().onCreate(async (user) => {
    const pixelId = META_PIXEL_ID.value();
    const token = META_CAPI_TOKEN.value();
    if (!pixelId || !token) {
        console.warn("Missing META_PIXEL_ID or META_CAPI_TOKEN");
        return;
    }
    const email = (user.email || "").trim().toLowerCase();
    const em = email ? sha256(email) : undefined;
    const payload = {
        data: [
            {
                event_name: "CompleteRegistration",
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: "https://www.wanderwise.uk/",
                user_data: em ? { em: [em] } : {},
                custom_data: {
                    signup_method: user.providerData?.[0]?.providerId || "unknown",
                },
            },
        ],
    };
    const qs = new URLSearchParams({ access_token: token });
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events?${qs.toString()}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const text = await res.text();
    let json = null;
    try {
        json = JSON.parse(text);
    }
    catch { }
    if (!res.ok)
        console.error("Meta CAPI error:", json ?? text);
    else
        console.log("Meta CAPI success:", json ?? text);
});
