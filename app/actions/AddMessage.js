"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

async function addMessage(previousState, formData) {
  //connect to database
  await connectDB();
  const userSession = await getSessionUser();

  if (!userSession || !userSession.user) {
    throw new Error("User ID is Required");
  }

  const { userId } = userSession;

  const recipient = formData.get("recipient");

  if (userId === recipient) {
    return { error: "You cannot Message yourself" };
  }

  const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get("property"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    body: formData.get("body"),
  });

  await newMessage.save();

  return { submitted: true };
}

export default addMessage;
