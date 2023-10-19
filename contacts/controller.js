const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("./contacts");
const {
  contactValidationMiddleware,
  addContactValidation,
} = require("./validators");

const getListOfContacts = async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).send({ contacts });
};

const getContact = async (req, res, next) => {
  const contactById = await getContactById(req.params.contactId);
  if (!contactById) {
    res.status(404).json({ message: "Not found" });
  }
  return res.status(200).send({ contactById });
};

const addNewContact = async (req, res, next) => {
  try {
    const { error } = addContactValidation.validate(req.body);
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
};

const deleteContact = async (req, res, next) => {
  const contactToDelete = await removeContact(req.params.contactId);
  if (!contactToDelete) {
    res.status(404).json({ message: "Not found" });
  }
  return res.status(200).send({ message: "contact deleted" });
};

const updateContactById = async (req, res, next) => {
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
};

const updateFavoriteById = async (req, res, next) => {
  const { favorite } = req.body;
  if (!favorite) {
    res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const contact = await updateStatusContact(req.params.id, req.body);
    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

module.exports = {
  getListOfContacts,
  getContact,
  addNewContact,
  deleteContact,
  updateContactById,
  updateFavoriteById,
};
