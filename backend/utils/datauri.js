//ye code bhi kaafi useful hai jab tu kisi image/file ko buffer se base64 data URL mein convert karna chahta hai – jo Cloudinary jese services mein upload karne ke kaam aata hai
import DataUriParser from "datauri/parser.js";

import path from "path";

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default getDataUri;