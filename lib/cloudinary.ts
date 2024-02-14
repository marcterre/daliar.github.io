import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

cloudinary.config({
  cloud_name: "daliar",
  api_key: "952297949811794",
  api_secret: "eaaB4TeQSFEySTMAgYQRLrJZOG4",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { files }: any = await parseAsync(req);

      const { imageFile } = files;

      const result = await cloudinary.uploader.upload(imageFile.filepath, {
        public_id: imageFile.newFilename,
      });

      res.status(201).json(result);

      break;
    default:
      res.status(400).json({ message: "Method not implemented" });
  }
}

function parseAsync(req: NextApiRequest) {
  return new Promise((resolve, reject) => {
    const form = formidable({});

    form.parse(req, (error: Error, fields: any, files: any) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      resolve({ fields, files });
    });
  });
}
