"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

async function addProperty(formData) {
  //connect to database
  await connectDB();
  const userSession = await getSessionUser();

  if (!userSession || !userSession.user) {
    throw new Error("User ID is Required");
  }

  const { userId } = userSession;

  //Acess all values from Amenities and Images
  const amenities = formData.getAll("amenities");
  const images = formData.getAll("images").filter((image) => image.name !== "");

  //Property data information
  const propertydata = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    square_feet: formData.get("square_feet"),
    amenities,
    rates: {
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
      nightly: formData.get("rates.nightly"),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
  };

  //Posting Images to Cloudnary
  const imageURLS = [];
  for (const imageFile of images) {
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    //convert to base64
    const imagebase64 = imageData.toString("base64");

    //Make Request to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imagebase64}`,
      {
        folder: "JB-ESTATE",
      }
    );
    imageURLS.push(result.secure_url);
  }

  propertydata.images = imageURLS;

  const newProperty = new Property(propertydata);
  await newProperty.save();

  revalidatePath("/", "layout");
  redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
