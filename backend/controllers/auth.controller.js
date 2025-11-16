import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body || {};

  // Validation
  if (!username ||  !email || !password 
  ) {
    return next(errorHandler(400, "All fields are required"))
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body ||{}

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"))
  }

  try {
    const validUser = await User.findOne({ email })

    if (!validUser) {
      return next(errorHandler(404, "User not found"))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)

    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials"))
    }

const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    )
    const { password: pass, ...rest } = validUser._doc

    res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest)
  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  const { email, name, profilePhotoUrl } = req.body

  try {
    const user = await User.findOne({ email })

    if (user) {
const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      )

      const { password: pass, ...rest } = user._doc

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest)
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8)

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

    
    const newUser = new User({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: profilePhotoUrl,
    })

    await newUser.save()

const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET
    )
    const { password: pass, ...rest } = newUser._doc

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest)
  } catch (error) {
    next(error)
  }
}