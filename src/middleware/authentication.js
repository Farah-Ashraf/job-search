import jwt from "jsonwebtoken";
// to make sure that the user is logged in
export const auth = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please provide jwt token", success: false });
    }
    const payload = jwt.verify(token, "secret_key");
    if (!payload || !payload.userId) {
      return res
        .status(401)
        .json({ message: "User is not logged in", success: false });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(err.cause || 500)
      .json({ message: err.message, success: false });
  }
};
