const express = require("express");
const {
  getListOfContacts,
  getContact,
  addNewContact,
  deleteContact,
  updateContactById,
  updateFavoriteById,
} = require("../../contacts/controller");
const { isValidId } = require("../../contacts/validators");
const router = express.Router();

router.get("/", getListOfContacts);
router.get("/:contactId", getContact);
router.post("/", isValidId, addNewContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", isValidId, updateContactById);
router.patch("/:id/favorite", isValidId, updateFavoriteById);

module.exports = router;
