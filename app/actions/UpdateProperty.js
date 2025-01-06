"use server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function UpdateProperty(propertyId, formData) {
  await connectDB();
  const userSession = await getSessionUser();

  if (!userSession || !userSession.userId) {
    throw new Error("User ID is Required");
  }

  const { userId } = userSession;

  const existingProperties = await Property.findById(propertyId);

  //Acess all values from Amenities
  const amenities = formData.getAll("amenities");

  //verify Ownership
  if (existingProperties.owner.toString() !== userId) {
    throw new Error("Current User does not own this Property");
  }

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

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertydata
  );

  revalidatePath("/", "layout");

  redirect(`/properties/${updatedProperty._id}`);
}

export default UpdateProperty;
