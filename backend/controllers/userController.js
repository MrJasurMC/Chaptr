const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const {
  User
} = require('../models');
const {
  ValidateUser,
  ValidateUserUpdate,
  ValidateLogin
} = require('../validation/userValidation');
const {
  Op
} = require('sequelize');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const createAuthResponse = user => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on the server');
  }
  const userData = user.toJSON();
  delete userData.password;
  userData.token = jwt.sign({
    sub: user.id,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  return userData;
};
exports.createUser = async (req, res) => {
  const {
    error
  } = ValidateUser(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const existing = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (existing) {
      return res.status(400).send({
        error: "Email is already registered"
      });
    }
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "user"
    });
    const userData = createAuthResponse(user);
    res.status(201).send(userData);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.loginUser = async (req, res) => {
  const {
    error
  } = ValidateLogin(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      return res.status(401).send({
        error: "Invalid email or password"
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        error: "Invalid email or password"
      });
    }
    const userData = createAuthResponse(user);
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.googleAuth = async (req, res) => {
  const {
    credential
  } = req.body;
  if (!credential) {
    return res.status(400).send({
      error: "Missing Google credential"
    });
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).send({
      error: "Google sign-in isn't configured on the server yet"
    });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).send({
        error: "Google account has no email"
      });
    }
    let user = await User.findOne({
      where: {
        email: payload.email
      }
    });
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        password: randomPassword,
        role: "user"
      });
    }
    const userData = createAuthResponse(user);
    res.status(200).send(userData);
  } catch (error) {
    res.status(401).send({
      error: "Invalid Google credential"
    });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password']
      }
    });
    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.updateUser = async (req, res) => {
  const {
    error
  } = ValidateUserUpdate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    });
  }
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send("User not found");
    const updates = { ...req.body };
    if (req.user?.role !== "admin") {
      delete updates.role;
    }
    await user.update(updates);
    const userData = user.toJSON();
    delete userData.password;
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send("User not found");
    const userData = user.toJSON();
    delete userData.password;
    await user.destroy();
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
exports.searchUsers = async (req, res) => {
  try {
    const {
      query
    } = req.query;
    if (!query) {
      return res.status(400).send({
        error: "Search query is required"
      });
    }
    const users = await User.findAll({
      where: {
        [Op.or]: [{
          name: {
            [Op.iLike]: `%${query}%`
          }
        }, {
          email: {
            [Op.iLike]: `%${query}%`
          }
        }]
      },
      attributes: {
        exclude: ['password']
      }
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
};
