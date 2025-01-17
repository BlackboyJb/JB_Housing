import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyImages from "@/components/PropertyImages";
import connectDB from "@/config/database";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import PropertyContactForm from "@/components/PropertyContactForm";
import Property from "@/models/Property";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { convertToSerializableObject } from "@/utils/connvertToObject";

const PropertyId = async ({ params }) => {
  await connectDB();
  const { id } = await params;
  const properties = await Property.findById(id).lean();
  const propertyDoc = convertToSerializableObject(properties);

  if (!propertyDoc) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property not Found
      </h1>
    );
  }
  return (
    <>
      <PropertyHeaderImage image={propertyDoc.images[0]} />
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="fas fa-arrow-left mr-2" />
            Back to Properties
          </Link>
        </div>
      </section>
      <section className="bg-blue-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            {/* Proeprty Info */}
            <PropertyDetails property={propertyDoc} />
            <aside className="space-y-4">
              <BookmarkButton property={propertyDoc} />
              <ShareButtons property={propertyDoc} />
              <PropertyContactForm property={propertyDoc} />
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={propertyDoc.images} />
    </>
  );
};

export default PropertyId;
