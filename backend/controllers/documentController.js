const crypto = require("crypto");
const mongoose = require("mongoose");
const DriverDocument = require("../models/DriverDocument");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const { uploadDocument, deleteDocument, downloadDocument } = require("../services/cloudinaryDocuments");

const TYPES = new Set(["DRIVING_LICENSE", "VEHICLE_RC", "VEHICLE_INSURANCE", "POLLUTION_CERTIFICATE"]);
const LIMIT = 8 * 1024 * 1024;
const fileInfo = (data) => {
  const match = typeof data === "string" && data.match(/^data:(application\/pdf|image\/jpeg|image\/png);base64,([A-Za-z0-9+/]+=*)$/);
  if (!match) return null;
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > LIMIT) return null;
  const valid = match[1] === "application/pdf" ? bytes.subarray(0, 5).toString() === "%PDF-"
    : match[1] === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return valid ? { mimeType: match[1], bytes } : null;
};
const validId = (id) => mongoose.isValidObjectId(id);
const publicDoc = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  delete obj.publicId; delete obj.assetId; delete obj.secureUrl; delete obj.storageKey;
  return obj;
};

exports.listMine = async (req, res) => {
  const documents = await DriverDocument.find({ driverId: req.driver._id }).sort({ createdAt: 1 });
  res.json({ success: true, documents: documents.map(publicDoc), verification: req.driver.verification });
};

exports.upload = async (req, res) => {
  const { documentType, documentNumber, file, originalName } = req.body;
  const info = fileInfo(file);
  if (!TYPES.has(documentType)) return res.status(400).json({ success: false, message: "Choose a supported document type." });
  if (typeof documentNumber !== "string" || !documentNumber.trim() || documentNumber.trim().length > 100) return res.status(400).json({ success: false, message: "Enter a valid document number." });
  if (!info) return res.status(400).json({ success: false, message: "Upload a valid JPG, PNG, or PDF file up to 8 MB." });
  if (typeof originalName !== "string" || originalName.length > 180) return res.status(400).json({ success: false, message: "The file name is invalid." });
  const existing = await DriverDocument.findOne({ driverId: req.driver._id, documentType }).select("+publicId");
  if (existing?.verificationStatus === "approved") return res.status(409).json({ success: false, message: "Approved documents cannot be changed. Contact support to request re-verification." });

  const publicId = `${documentType.toLowerCase()}_${crypto.randomBytes(10).toString("hex")}`;
  const result = await uploadDocument(file, publicId, `drivers/${req.driver._id}/documents`);
  try {
    const values = { driverId: req.driver._id, documentType, documentNumber: documentNumber.trim(), storageKey: result.public_id, publicId: result.public_id, assetId: result.asset_id, secureUrl: result.secure_url, originalFileName: originalName.replace(/[\\/]/g, "_"), mimeType: info.mimeType, verificationStatus: "pending", rejectionReason: null, verifiedBy: null, verifiedAt: null };
    const document = existing ? await DriverDocument.findByIdAndUpdate(existing._id, values, { new: true, runValidators: true }) : await DriverDocument.create(values);
    req.driver.verification.status = "pending";
    req.driver.status = req.driver.status === "rejected" ? "pending" : req.driver.status;
    await req.driver.save();
    if (existing?.publicId) await deleteDocument(existing.publicId).catch(() => {});
    return res.status(existing ? 200 : 201).json({ success: true, document: publicDoc(document) });
  } catch (error) {
    await deleteDocument(result.public_id).catch(() => {});
    throw error;
  }
};

exports.removeMine = async (req, res) => {
  if (!validId(req.params.documentId)) return res.status(404).json({ success: false, message: "Document not found." });
  const document = await DriverDocument.findOne({ _id: req.params.documentId, driverId: req.driver._id }).select("+publicId");
  if (!document) return res.status(404).json({ success: false, message: "Document not found." });
  if (document.verificationStatus === "approved") return res.status(409).json({ success: false, message: "Approved documents cannot be removed." });
  if (document.publicId) await deleteDocument(document.publicId);
  await document.deleteOne();
  req.driver.verification.status = "pending"; await req.driver.save();
  res.json({ success: true });
};

exports.submit = async (req, res) => {
  const documents = await DriverDocument.find({ driverId: req.driver._id });
  const missing = [...TYPES].filter((type) => !documents.some((doc) => doc.documentType === type));
  const rejected = [...TYPES].filter((type) => documents.some((doc) => doc.documentType === type && doc.verificationStatus === "rejected"));
  if (missing.length || rejected.length) return res.status(400).json({ success: false, message: [missing.length ? `Upload all required documents: ${missing.join(", ")}.` : "", rejected.length ? `Re-upload rejected documents: ${rejected.join(", ")}.` : ""].filter(Boolean).join(" ") });
  req.driver.verification.status = "pending";
  await req.driver.save();
  res.json({ success: true, message: "Verification submitted for admin review.", verification: req.driver.verification });
};

exports.adminDocuments = async (req, res) => {
  if (!validId(req.params.driverId)) return res.status(404).json({ success: false, message: "Driver not found." });
  const [driver, vehicle, documents] = await Promise.all([
    Driver.findOne({ _id: req.params.driverId, role: "driver" }).select("name email phone status verification"),
    Vehicle.findOne({ driverId: req.params.driverId }),
    DriverDocument.find({ driverId: req.params.driverId }).select("+publicId +assetId +secureUrl").sort({ createdAt: 1 }),
  ]);
  if (!driver) return res.status(404).json({ success: false, message: "Driver not found." });
  res.json({ success: true, driver, vehicle, documents: documents.map(publicDoc) });
};

exports.view = async (req, res) => {
  if (!validId(req.params.documentId)) return res.status(404).json({ success: false, message: "Document not found." });
  const document = await DriverDocument.findById(req.params.documentId).select("+assetId originalFileName mimeType");
  if (!document?.assetId) return res.status(404).json({ success: false, message: "Document file not found." });
  const remote = await downloadDocument(document.assetId);
  res.set("Content-Type", document.mimeType);
  res.set("Content-Disposition", `inline; filename="${document.originalFileName.replace(/[\r\n"\\]/g, "_")}"`);
  res.set("Cache-Control", "private, no-store");
  res.set("X-Content-Type-Options", "nosniff");
  remote.body.pipeTo(Writable.toWeb(res)).catch((error) => { if (!res.headersSent) res.status(502).end(); });
};

exports.review = async (req, res) => {
  if (!validId(req.params.documentId)) return res.status(404).json({ success: false, message: "Document not found." });
  const approved = req.params.decision === "approve";
  if (!approved && (typeof req.body.reason !== "string" || !req.body.reason.trim())) return res.status(400).json({ success: false, message: "A rejection reason is required." });
  const document = await DriverDocument.findById(req.params.documentId);
  if (!document) return res.status(404).json({ success: false, message: "Document not found." });
  document.verificationStatus = approved ? "approved" : "rejected";
  document.rejectionReason = approved ? null : req.body.reason.trim().slice(0, 500);
  document.verifiedBy = req.admin._id; document.verifiedAt = new Date();
  await document.save();
  const docs = await DriverDocument.find({ driverId: document.driverId });
  const complete = [...TYPES].every((type) => docs.some((item) => item.documentType === type && item.verificationStatus === "approved"));
  const rejected = docs.some((item) => TYPES.has(item.documentType) && item.verificationStatus === "rejected");
  const verificationStatus = complete ? "approved" : rejected ? "rejected" : "pending";
  const driverUpdate = { "verification.status": verificationStatus };
  if (complete) { driverUpdate.status = "active"; driverUpdate.availability = "offline"; driverUpdate["verification.licenseVerified"] = true; driverUpdate["verification.documentsVerified"] = true; }
  if (rejected) { driverUpdate.availability = "offline"; }
  await Driver.findByIdAndUpdate(document.driverId, driverUpdate);
  res.json({ success: true, document: publicDoc(document), verificationStatus: complete ? "approved" : rejected ? "rejected" : "pending" });
};

exports.setVerification = async (req, res) => {
  if (!validId(req.params.driverId)) return res.status(404).json({ success: false, message: "Driver not found." });
  const documents = await DriverDocument.find({ driverId: req.params.driverId });
  const allApproved = [...TYPES].every((type) => documents.some((doc) => doc.documentType === type && doc.verificationStatus === "approved"));
  if (req.body.status === "approved" && !allApproved) return res.status(400).json({ success: false, message: "All four required documents must be approved before approving this driver." });
  const status = allApproved ? "approved" : documents.some((doc) => doc.verificationStatus === "rejected") ? "rejected" : "pending";
  const update = { "verification.status": status, availability: "offline" };
  if (allApproved) { update.status = "active"; update["verification.licenseVerified"] = true; update["verification.documentsVerified"] = true; }
  else update.status = "pending";
  const driver = await Driver.findOneAndUpdate({ _id: req.params.driverId, role: "driver" }, update, { new: true });
  if (!driver) return res.status(404).json({ success: false, message: "Driver not found." });
  res.json({ success: true, verification: driver.verification });
};

const { Writable } = require("stream");
