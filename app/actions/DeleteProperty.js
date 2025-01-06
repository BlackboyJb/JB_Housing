"use server";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is Required");
  }

  const { userId } = sessionUser;

  const property = await Property.findById(propertyId);

  if (!property) throw new Error("Property not Found");

  //verify ownership
  if (property.owner.toString() !== userId) {
    throw new Error("Unauthorized");
  }
  //Extract public ID from image URLS
  const publicIds = property.images.map((imageURL) => {
    const parts = imageURL.split("/");
    return parts.at("-1").split(".").at(0);
  });

  //Delete image from cloudinary
  if (publicIds.length > 0) {
    for (let publicId of publicIds) {
      await cloudinary.uploader.destroy(`JB-ESTATE/` + publicId);
    }
  }

  await property.deleteOne();
  revalidatePath("/", "layout");
}

export default deleteProperty;
