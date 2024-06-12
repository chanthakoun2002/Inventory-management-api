const User = require("../models/user");
const BlacklistedToken = require("../models/token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//generates token and adds user id as part of payload
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
};

//for user registration
exports.register = async (req, res) => {
  try {
    //email and username check to make sure unique
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(409).json({ message: "Email already exists"});
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) return res.status(409).json({ message: "Username already exists"});

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create the new user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    
    if (user) {
      res.status(201).json({ 
        message: "User has been created", 
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
    else {
      res.status(400).json({ message: "Invalid user data" });
    }
    
  } 
  catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

//for user login
exports.login = async (req, res) => {
  try {
    //check if users email exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("Email not found");

    //validate the users password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).json("Invalid password");

    res.status(201).json({
      message: "User logged in",
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//blacklists token and "logout" the user 
exports.logout = async (req, res) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const blacklistedToken = new BlacklistedToken({ token });
      await blacklistedToken.save();
      res.status(200).json('Logout successful and token blacklisted.');
    } catch (error) {
      console.error('Failed to blacklist token:', error);
      res.status(500).json('Error blacklisting token.');
    }
  } else {
    res.status(400).json('No token provided.');
  }
}

//controller to get user profile allow for user to view
//note: user not able to see pswd since hashed
exports.getUserProfile = async (req, res) => {
  if (!req.user || !req.user._id) return res.status(401).json("Unauthorized access.");
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.json(404).send("User not found");
      res.json(user);
    } catch (error) {
      res.json(500).json("Error retrieving user details");
    }
};