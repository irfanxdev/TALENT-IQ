import { clerkClient } from "@clerk/express";
import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    // Clerk v5: always use req.auth()
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Generate Stream token using Clerk User ID
    const token = chatClient.createToken(userId);

    res.status(200).json({
      token,
      userId,
      userName: user.firstName + " " + (user.lastName || ""),
      userImage: user.imageUrl,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
    