const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { UnknownDatabaseError } = require("../errors");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function () {
  try {
    if (!this.password) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error(error.message);
    throw new UnknownDatabaseError();
  }
});

userSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new UnknownDatabaseError();
  }
};

const User = model("users", userSchema);

module.exports = {
  User,
};
