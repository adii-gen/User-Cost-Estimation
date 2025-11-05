import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const utapi = new UTApi();
    const uploadResult = await utapi.uploadFiles([file]);

    if (!uploadResult || !uploadResult[0]?.data?.url) {
      throw new Error("Image upload failed");
    }

    // Format response to match Antd Upload component requirements
    const response = {
      url: uploadResult[0].data.url,
      uid: `upload-${Date.now()}`, // Generate unique ID
      name: file.name,
      type: file.type,
      size: file.size,
      status: "done",
      percent: 100,
    };

    console.log("Uploadthing", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
