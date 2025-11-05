import { createUploadthing } from "uploadthing/next";
import { type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      console.log("Middleware called");
      // Add authentication or metadata logic if needed
      return {}; // Return metadata if no additional data is needed
    })
    .onUploadComplete(async ({ file }) => {
      console.log("File uploaded successfully:", file);
      try {
        // Return file URL or process further as needed
        return { url: file.url };
      } catch (error) {
        console.error("onUploadComplete error:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
