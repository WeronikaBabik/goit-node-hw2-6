const express = require("express");
const {
  getListOfContacts,
  getContact,
  addNewContact,
  deleteContact,
  updateContactById,
  updateFavoriteById,
} = require("../../models/controller");
const { isValidId } = require("../../models/validators");
const router = express.Router();

router.get("/", getListOfContacts);
router.get("/:contactId", getContact);
router.post("/", isValidId, addNewContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", isValidId, updateContactById);
router.patch("/:id/favorite", isValidId, updateFavoriteById);

module.exports = router;
