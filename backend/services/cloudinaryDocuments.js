const crypto = require("crypto");

const config = () => {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) throw Object.assign(new Error("Cloudinary is not configured on the server."), { status: 503 });
  return { cloud, key, secret };
};
const signature = (params, secret) => crypto.createHash("sha1").update(`${Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&")}${secret}`).digest("hex");

async function uploadDocument(dataUri, publicId, folder) {
  const { cloud, key, secret } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, public_id: publicId, timestamp, type: "authenticated" };
  const form = new URLSearchParams({ ...params, api_key: key, signature: signature(params, secret), file: dataUri });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/raw/upload`, { method: "POST", body: form });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.error?.message || "Cloudinary upload failed."), { status: 502 });
  return result;
}

async function deleteDocument(publicId) {
  const { cloud, key, secret } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { invalidate: true, public_id: publicId, timestamp, type: "authenticated" };
  const form = new URLSearchParams({ ...params, api_key: key, signature: signature(params, secret) });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/raw/destroy`, { method: "POST", body: form });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.result !== "ok" && result.result !== "not found") throw Object.assign(new Error("Unable to remove the stored document."), { status: 502 });
}

async function downloadDocument(assetId) {
  const { cloud, key, secret } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { asset_id: assetId, expires_at: timestamp + 60, timestamp };
  const query = new URLSearchParams({ ...params, signature: signature(params, secret), api_key: key });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/asset/download?${query}`);
  if (!response.ok) throw Object.assign(new Error("Unable to retrieve the private document."), { status: 502 });
  return response;
}

module.exports = { uploadDocument, deleteDocument, downloadDocument };
