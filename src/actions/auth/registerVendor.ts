"use server";

import { createUser, findUserByEmail } from "@/data/user";
import { sendEmailVerificationEmail } from "@/lib/mail";
import { generateEmailVerificationToken } from "@/lib/token";
import bcrypt from "bcryptjs";

type RegisterUserInput = {
  email: string;
  name: string;
  password: string;
  mobile: string;
  role?: string;
  createdBy?: string;
};

export async function registerUser(values: RegisterUserInput) {
  try {
    const { email, name, password, mobile, role, createdBy } = values;

    if (!email || !name || !password || !mobile) {
      return { error: "All fields are required!" } as const;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { error: "User with this email already exists!" } as const;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    type UserRole = "USER" | "platform_admin" ;
    const createUserId=  await createUser({
        name,
        email,
        password: hashedPassword,
        mobile,
        createdBy: createdBy ?? '',
        role: (role as UserRole) || 'USER',  // Type assertion approach
        organisationId: ''
      }); 
      // console.log("createdUserId",createUserId);
      

    const verificationToken = await generateEmailVerificationToken(email);
    if (verificationToken) {
      await sendEmailVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      return {
      
        success: "User created successfully and confirmation email sent!",
        id: createUserId.id,
      } as const;
    }

    return { error: "Failed to generate verification token" } as const;
  } catch (error) {
    console.error("Register user error:", error);
    return {
      error: "An error occurred during registration"
    } as const;
  }
}