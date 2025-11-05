// import { OurFileRouter } from "@/server/uploadthing";
// import { generateReactHelpers } from "@uploadthing/react";

// export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

// //For frontend
import { OurFileRouter } from "@/app/api/uploadthing/core";
import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
  
  
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();