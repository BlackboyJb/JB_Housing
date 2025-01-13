"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function MarkMessagesAsRead(messageId) {
  await connectDB();

  const userSession = await getSessionUser();

  if (!userSession || !userSession.userId) {
    return new Error("User Id is required");
  }

  const { userId } = userSession;

  const message = await Message.findById(messageId);

  if (!message) throw new Error("Message not Found");

  //Verify Ownership
  if (message.recipient.toString() !== userId) {
    throw new Error("unauthorized");
  }

  message.read = !message.read;

  revalidatePath("/messages", "page");

  await message.save();

  return message.read;
}

export default MarkMessagesAsRead;
