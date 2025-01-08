"use client";
import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import BookmarkProperty from "@/app/actions/BookmarkProperty";
import bookmarkStatus from "@/app/actions/BookmarkStatus";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const BookmarkButton = ({ property }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  //Keep Bookmark Status after Reload
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    bookmarkStatus(property._id).then((res) => {
      if (res.error) toast.error(res.error);
      if (res.isBookmarked);
      setIsBookmarked(res.isBookmarked);
      setIsLoading(false);
    });
  }, [property._id, userId, bookmarkStatus]);

  //  Handle Bookmark Action
  const handleBookmark = async () => {
    if (!userId) {
      toast.error("User needs to be logged in inorder to Bookmark Properties");
      return;
    }

    BookmarkProperty(property._id).then((res) => {
      if (res.error) return toast.error(res.error);
      setIsBookmarked(res.isBookmarked);
      toast.success(res.message);
    });
  };
  return isBookmarked ? (
    <button
      className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      onClick={handleBookmark}
    >
      <FaBookmark className="mr-2" /> Remove Property
    </button>
  ) : (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      onClick={handleBookmark}
    >
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
