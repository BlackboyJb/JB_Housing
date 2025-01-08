"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

async function bookmarkStatus(propertyId) {
  await connectDB();

  const userSession = await getSessionUser();

  if (!userSession || !userSession.userId) {
    return new Error("User Id is required");
  }

  const { userId } = userSession;

  const user = await User.findById(userId);

  let isBookmarked = user.bookmarks.includes(propertyId);

  return { isBookmarked };
}

export default bookmarkStatus;
