"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function bookmarkProperty(propertyId) {
  await connectDB();

  const userSession = await getSessionUser();

  if (!userSession || !userSession.userId) {
    return new Error("User Id is required");
  }

  const { userId } = userSession;

  const user = await User.findById(userId);

  let isBookmarked = user.bookmarks.includes(propertyId);

  let message;

  if (isBookmarked) {
    //If Bookmarked, remove Bookmarks
    user.bookmarks.pull(propertyId);
    message = "Bookmark Removed";
    isBookmarked = false;
  } else {
    //If not Bookmarked, add Bookmarks
    user.bookmarks.push(propertyId);
    message = "Bookmark Added";
    isBookmarked = true;
  }

  await user.save();
  revalidatePath("/properties/saved", "page");

  return {
    message,
    isBookmarked,
  };
}

export default bookmarkProperty;
