import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const authMiddleware = requireAuth({
  loadUser: true
});

export async function attachUser(req, res, next) {
  try {
    const { userId: clerkId } = req.auth();  // ✔ Clerk NEW API

    const mongoUser = await User.findOne({ clerkId });

    if (!mongoUser) {
      return res.status(401).json({ message: "User not found in database" });
    }

    req.user = mongoUser; // ✔ Now req.user is correct
    next();

  } catch (error) {
    console.log("Auth attach error:", error);
    res.status(500).json({ message: "Auth processing error" });
  }
}
