import { Role } from "@/schemas";

export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";

// Prefix for API authentication routes.
export const apiAuthPrefix: string = "/api/auth";

// Routes which are accessible to all.
export const publicRoutes: string[] = ["/", "/auth/verify-email" ,"/Hotels/HotelDetails","/Hotels","/admin"];

// APIs which are accessible to all.
export const publicApis: string[] = ["/api/posts", "/api/company" ,"/posts", "/api/get", "/api/productCategory","/api/serviceCategory","/api/service" , "/api/deal-types","/api/uploadthing"];

// Routes which are used for authentication.
export const authRoutes: string[] = [
  "/auth/error",
  "/auth/login",
  "/auth/register",
  "/auth/register/company",
  "/auth/register/company/admin/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Routes which are protected with diffferent roles
export const protectedRoutes: Record<string, Role[]> = {
  "^/dashboard/user(/.*)?$": ["USER"],
  "^/dashboard/admin(/.*)?$": ["platform_admin"],
  // "^/dashboard/superadmin(/.*)?$": ["SUPER_ADMIN"],
  // "^/dashboard/salePerson(/.*)?$": ["SALE_PERSON"],
  // "^/vendor(/.*)?$": ["USER","SALE_PERSON", "VENDOR"],
  // "^/vendorcreation(/.*)?$": ["SALE_PERSON"],
  // "^/dashboard/staff(/.*)?$": ["STAFF"],
};
