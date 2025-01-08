"use client";

import { FaShare } from "react-icons/fa";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  XIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
const ShareButtons = ({ property }) => {
  const shareURL = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;
  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share this Property:
        <div className="flex gap-3 justify-center pb-5">
          {/* //Facebook Share Button */}
          <FacebookShareButton
            url={shareURL}
            quote={property.name}
            hashtag={[`#${property.type.replace(/\s/g, "")}forRent`]}
          />
          <FacebookIcon size={30} round={true} />
          {/* //Twitter Share Button */}
          <TwitterShareButton
            url={shareURL}
            quote={property.name}
            hashtag={[`#${property.type.replace(/\s/g, "")}forRent`]}
          />
          <XIcon size={30} round={true} />
          {/* //Whatsapp share Button */}
          <WhatsappShareButton
            url={shareURL}
            quote={property.name}
            hashtag={`#${property.type.replace(/\s/g, "")}forRent`}
            seperator="::"
          />
          <WhatsappIcon size={30} round={true} />
          {/* //Email Share Button */}
          <EmailShareButton
            url={shareURL}
            subject={property.name}
            body={`check out this property listing:${shareURL}`}
          />
          <EmailIcon size={30} round={true} />
        </div>
      </h3>
    </>
  );
};

export default ShareButtons;
