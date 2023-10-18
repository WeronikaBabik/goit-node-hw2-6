class DuplicatedKeyError extends Error {
  constructor(keyName, value) {
    super(`${keyName} has to be unique. ${value} in use.`);
  }
}

class UnknownDatabaseError extends Error {
  constructor() {
    super("Oops, something went wrong at database layer.");
  }
}

module.exports = { DuplicatedKeyError, UnknownDatabaseError };
