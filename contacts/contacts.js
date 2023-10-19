const { Contact } = require("./model");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (e) {
    console.log(e.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    await Contact.findByIdAndRemove(contactId);
  } catch (e) {
    console.log(e.message);
  }
};

const addContact = async (body) => {
  try {
    const newContact = new Contact(body);
    const contacts = await newContact.save();
    return contacts;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return contacts;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const { favorite } = body;
    if (!favorite) {
      console.log("missing field favorite");
      return;
    }
    const contact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { favorite: favorite },
      { new: true }
    );
    return contact;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
