const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../database/models/index.js');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user with the email already exists
    const userExists = await models.User.findOne({ where: { email } });

    // if yes then return user already exists
    if (userExists) {
      return res.status(400).json({ message: 'User with the email already exists' });
    }

    // Save the user to the db
    const user = await models.User.create({ name, email, password: hashedPassword, role });

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ error, message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' }); // 12 hours
    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // 7 days

    // Set cookies in the response
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000 }); // 12 hours
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

    return res.json({ message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { registerUser, loginUser };
