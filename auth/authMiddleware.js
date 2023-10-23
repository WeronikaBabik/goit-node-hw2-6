const { getUser } = require("../users/dao");
const { verifyToken } = require("./service");

const extractTokenFromHeaders = (headers) => {
  return headers.authorization?.replace("Bearer ", "");
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = extractTokenFromHeaders(req.headers);

    if (!token) {
      throw new Error("Not authorized ");
    }

    const { email } = verifyToken(token);
    const user = await getUser({email});
    if (!user || user.token !== token) {
      throw new Error("Token is invalid");
    }

    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { authMiddleware };
