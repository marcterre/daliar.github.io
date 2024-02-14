import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: any, res: NextResponse) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("file");

    console.log("imageFile", formData);

    const result = await cloudinary.uploader.upload(imageFile.filepath, {
      public_id: imageFile.newFilename,
    });

    NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    NextResponse.json({ message: "Error uploading file" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Method not implemented" },
    { status: 400 }
  );
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   switch (req.method) {
//     case "POST":
//       const { files }: any = await parseAsync(req);

//       const { imageFile } = files;

//       const result = await cloudinary.uploader.upload(imageFile.filepath, {
//         public_id: imageFile.newFilename,
//       });

//       res.status(201).json(result);

//       break;
//     default:
//       res.status(400).json({ message: "Method not implemented" });
//   }
// }

function parseAsync(req: NextApiRequest) {
  console.log("in formidable", req);
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
