const fs = require("fs/promises");
const path = require("path");
const nanoid = require("nanoid");

const contactsPath = path.resolve(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (e) {
    console.log(e.message);
  }
};
function saveData(data) {
  try {
    fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(e);
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const searchedContact = contacts.find(({ id }) => id === contactId);
    return searchedContact || null;
  } catch (e) {
    console.log(e.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(({ id }) => id !== contactId);
    saveData(newContacts);
    return contacts;
  } catch (e) {
    console.log(e.message);
  }
};

const addContact = async (body) => {
  try {
    const newContact = { id: nanoid(), ...body };
    const contacts = await listContacts();
    const newContacts = [...contacts, newContact];
    saveData(newContacts);
    return newContact;
  } catch (e) {
    console.log(e.message);
  }
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const indexOfuUpdatedContact = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (indexOfuUpdatedContact === -1) {
    return null;
  }
  contacts[indexOfuUpdatedContact] = { id: contactId, ...body };
  saveData(contacts);
  console.log(contacts);
  return contacts;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
