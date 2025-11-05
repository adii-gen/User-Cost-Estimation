// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const imageUploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Optional authentication logic
      return { userId: "example-user-id" }; // Replace with actual user ID logic
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("File uploaded:", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof imageUploadRouter;
