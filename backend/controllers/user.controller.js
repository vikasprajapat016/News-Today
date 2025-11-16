import bcryptjs from "bcryptjs"
import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"

export const updateUser = async (req, res, next) => {
  try {
    console.log("Received data:", req.body)

    // 1️⃣ Check user permission
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You can only update your own account!"))
    }

    // 2️⃣ Validate password if present
    if (req.body.password) {
      if (req.body.password.length < 8) {
        return next(errorHandler(400, "Password must be at least 8 characters"))
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    // 3️⃣ Validate username if present
    if (req.body.username) {
      if (req.body.username.length < 5 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 5 and 20 characters")
        )
      }

      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"))
      }

      req.body.username = req.body.username.toLowerCase()

      if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
        return next(
          errorHandler(400, "Username can only contain letters and numbers")
        )
      }
    }

    // 4️⃣ Build update object dynamically
    const updateFields = {}

    if (req.body.username) updateFields.username = req.body.username
    if (req.body.email) updateFields.email = req.body.email
    if (req.body.password) updateFields.password = req.body.password
    if (req.body.profilePicture) updateFields.profilePicture = req.body.profilePicture

    // 🧩 Prevent updating if nothing changed
    if (Object.keys(updateFields).length === 0) {
      return next(errorHandler(400, "No changes provided"))
    }

    console.log("Updating fields:", updateFields)

    // 5️⃣ Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    )

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"))
    }

    // 6️⃣ Return sanitized response
    const { password, ...rest } = updatedUser._doc
    console.log("Updated user:", rest)

    res.status(200).json(rest)
  } catch (error) {
    console.error("Error in updateUser:", error)
    next(error)
  }
}
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only update your own account!"))
  }

  try {
    await User.findByIdAndDelete(req.params.userId)

    res.status(200).json("User has been deleted!")
  } catch (error) {
    next(error)
  }
}

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been loggedout successfully!")
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not authorized to access this resource!")
    )
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === "asc" ? 1 : -1

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const getUsersWithoutPassword = users.map((user) => {
      const { password: pass, ...rest } = user._doc

      return user
    })

    const totalUsers = await User.countDocuments()

    const now = new Date() // 2024 15 Nov

    const oneMonthAgo = new Date( // 2024 15 Oct
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({
      users: getUsersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    const { password, ...rest } = user._doc

    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}