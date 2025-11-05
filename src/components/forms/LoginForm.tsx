"use client";

import { loginUser } from "@/actions/auth/";

import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building2, TicketIcon, ArrowLeft } from "lucide-react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

function LoginForm({ api }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      loginUser(data)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  }

  return (
    <div className="min-h-screen w-full bg-white md:bg-gradient-to-br md:from-blue-50 md:to-gray-50 flex flex-col md:items-center md:justify-center px-4 sm:px-6 lg:px-8">
      {/* Mobile Header */}
      <div className="md:hidden pt-16 pb-8 px-2">

      </div>

      {/* Desktop and Mobile Container */}
      <div className="relative w-full max-w-md bg-white md:rounded-xl md:shadow-lg md:p-8 md:sm:p-10 md:border md:border-gray-100 flex-1 md:flex-none flex flex-col md:block">

        {/* Desktop Logo - Hidden on mobile */}
        <Link href={"/"} className="hidden md:block">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md flex items-center justify-center">
                {/* <TicketIcon className="h-5 w-5 text-white" /> */}
                <img src="/icons.png" alt="" className="h-10 w-10" />
              </div>
              <span className="ml-2 text-2xl  font-bold text-primary">Tms</span>
            </div>
          </div>
        </Link>
        <div className="md:hidden pl-4 flex"> 
          {/* <TicketIcon size={50} className="text-primary pb-1 font-bold bold " /> */}
          <img src="/icons.png" className="w-10 h-10" alt="" />
          <span className="text-4xl font-bold pl-0 text-primary"> TMS</span></div>
        {/* Title - Different for mobile and desktop */}
        <h1 className="text-2xl font-bold text-primary mb-2 md:mb-6 text-left md:text-center px-6 md:px-0 md:pt-0">
          <span className="md:hidden">Let's Sign you in.</span>
          <span className="hidden md:inline">Welcome back</span>
        </h1>

        {/* Mobile subtitles */}

        <div className="md:hidden px-6 mb-8">


          <p className="text-primary text-base mb-1">Welcome back</p>
          {/* <p className="text-primary text-base">You've been missed!</p> */}
        </div>

        <div className="px-6 md:px-0 flex-1 md:flex-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-primary mb-1 md:mb-1 mb-2">
                      <span className="md:hidden">Username or Email</span>
                      <span className="hidden md:inline">Email</span>
                    </label>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        placeholder="Enter Username or Email"
                        className="w-full p-3 md:p-3 p-4 bg-gray-50 md:bg-gray-50 bg-white border border-gray-200 rounded-lg md:rounded-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 md:focus:ring-blue-800 focus:border-transparent"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs md:text-xs text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-primary mb-1 md:mb-1 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FormControl>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Password"
                          className="w-full p-3 md:p-3 p-4 bg-gray-50 md:bg-gray-50 bg-white border border-gray-200 rounded-lg md:rounded-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 md:focus:ring-blue-800 focus:ring-blue-500 focus:border-transparent pr-12 md:pr-10"
                          disabled={isPending}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 md:right-3 right-4 top-1/2 -translate-y-1/2 text-gray-500 md:text-gray-500 text-gray-400 hover:text-primary md:hover:text-primary hover:text-gray-600"
                      >
                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                      </button>
                    </div>
                    <FormMessage className="text-red-500 text-xs md:text-xs text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Desktop Remember me and Forgot password - Hidden on mobile */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-blue-800 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Mobile divider */}
              <div className="md:hidden my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400">or</span>
                  </div>
                </div>
              </div>

              {error && <FormError message={error} />}
              {success && <FormSuccess message={success} />}

              {/* Mobile Register link - Above button */}
              <div className="md:hidden text-center mb-6">
                <span className="text-gray-500">Don't have an account? </span>
                <Link
                  href="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  Register
                </Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 md:py-3 py-4 bg-blue-800 md:bg-blue-800 bg-black text-white font-medium rounded-lg md:rounded-lg rounded-xl hover:bg-blue-900 md:hover:bg-blue-900  transition-colors disabled:opacity-60 flex items-center justify-center"
              >
                {isPending ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isPending ? "Logging in..." : "Login"}
              </button>
            </form>
          </Form>

          {/* Desktop Register section - Hidden on mobile */}
          <div className="hidden md:block mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;