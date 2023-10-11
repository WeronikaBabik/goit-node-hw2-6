const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const contactValidationMiddleware = require("../../models/validators");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  return res.status(200).send({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contactById = await getContactById(req.params.contactId);
  if (!contactById) {
    res.status(404).json({ message: "Not found" });
  }
  return res.status(200).send({ contactById });
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactValidationMiddleware.validate(req.body);
    if (error) {
      const missingField = error.details[0].context.label;
      res
        .status(400)
        .json({ message: `missing required field: ${missingField}` });
    }
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const newContact = await addContact(contact);
    return res.status(201).send({ newContact });
  } catch (error) {}
  res.status(404).json({ message: "Not found" });
});

router.delete("/:contactId", async (req, res, next) => {
  const contactToDelete = await removeContact(req.params.contactId);
  if (!contactToDelete) {
    res.status(404).json({ message: "Not found" });
  }
  return res.status(200).send({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactValidationMiddleware.validate(req.body);
    if (error) {
      const missingField = error.details[0].context.label;
      res.status(400).json({ message: `missing fields: ${missingField}` });
    }
    await updateContact(req.params.contactId, req.body);
    const updatedContact = await getContactById(req.params.contactId);
    return res.status(200).send({ updatedContact });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
