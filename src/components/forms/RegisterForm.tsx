// "use client";

// import { registerUser } from "@/actions/auth";
// import { IoEye, IoEyeOff } from "react-icons/io5";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { toast } from "@/components/ui/use-toast";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";
// import { RegisterUserSchema, Role } from "@/schemas";
// import Link from "next/link";
// import { Building2, Ticket } from "lucide-react";

// const FormSchema = RegisterUserSchema;
// type FormSchemaType = z.infer<typeof FormSchema>;

// interface RegisterFormProps {
//   text: string;
//   role: Role;
// }

// interface ServerResponse {
//   error?: string;
//   success?: string;
// }

// const RegisterForm: React.FC<RegisterFormProps> = ({ text, role }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | undefined>(undefined);
//   const [success, setSuccess] = useState<string | undefined>(undefined);
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       mobile: "",
//       password: "",
//       role: "USER" as Role,
//     },
//   });

//   const onSubmit = async (data: FormSchemaType) => {
//     if (role) data.role = role;

//     setError(undefined);
//     setSuccess(undefined);

//     startTransition(() => {
//       registerUser(data)
//         .then((response: ServerResponse) => {
//           if (response?.error) {
//             setError(response.error);
//           }
//           if (response?.success) {
//             form.reset();
//             setSuccess(response.success);
//             toast({
//               title: "🎉 Registration success",
//               description: response.success,
//             });
//           }
//         })
//         .catch(() => {
//           setError("Something went wrong!");
//         });
//     });
//   };

//   const togglePasswordVisibility = () => setShowPassword(prev => !prev);

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10 border border-gray-100">
//         {/* Logo */}
//         <Link href={"/"}>
//         <div className="flex justify-center mb-6">
//           <div className="flex items-center">
//             <div className="h-10 w-10 rounded-md bg-blue-800 flex items-center justify-center">
//               <Ticket className="h-5 w-5 text-white" />
//             </div>
//             <span className="ml-2 text-2xl font-bold text-primary">Tms</span>
//           </div>
//         </div>
//         </Link>

//         <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//           {text}
//         </h1>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name
//                   </label>
//                   <FormControl>
//                     <input
//                       {...field}
//                       type="text"
//                       placeholder="Enter your full name"
//                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
//                       disabled={isPending}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500 text-xs mt-1" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <FormControl>
//                     <input
//                       {...field}
//                       type="email"
//                       placeholder="Enter your email"
//                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
//                       disabled={isPending}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500 text-xs mt-1" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="mobile"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Mobile Number
//                   </label>
//                   <FormControl>
//                     <input
//                       {...field}
//                       type="tel"
//                       placeholder="Enter your phone number"
//                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
//                       disabled={isPending}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500 text-xs mt-1" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <FormControl>
//                       <input
//                         {...field}
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
//                         disabled={isPending}
//                       />
//                     </FormControl>
//                     <button
//                       type="button"
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                     >
//                       {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
//                     </button>
//                   </div>
//                   <FormMessage className="text-red-500 text-xs mt-1" />
//                 </FormItem>
//               )}
//             />

//             {error && <FormError message={error} />}
//             {success && <FormSuccess message={success} />}

//             <button
//               type="submit"
//               disabled={isPending}
//               className="w-full py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-60 flex items-center justify-center"
//             >
//               {isPending ? (
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : null}
//               {isPending ? "Registering..." : "Register"}
//             </button>
//           </form>
//         </Form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">
//                 Already have an account?
//               </span>
//             </div>
//           </div>

//           <div className="mt-6">
//             <Link
//               href="/auth/login"
//               className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
//             >
//               Sign in instead
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;
"use client";

import { registerUser } from "@/actions/auth";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { RegisterUserSchema, Role } from "@/schemas";
import Link from "next/link";
import { Building2, Ticket, ArrowLeft, TicketIcon } from "lucide-react";

const FormSchema = RegisterUserSchema;
type FormSchemaType = z.infer<typeof FormSchema>;

interface RegisterFormProps {
  text: string;
  role: Role;
}

interface ServerResponse {
  error?: string;
  success?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ text, role }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "USER" as Role,
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    if (role) data.role = role;

    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      registerUser(data)
        .then((response: ServerResponse) => {
          if (response?.error) {
            setError(response.error);
          }
          if (response?.success) {
            form.reset();
            setSuccess(response.success);
            toast({
              title: "🎉 Registration success",
              description: response.success,
            });
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="min-h-screen w-full bg-white md:bg-gradient-to-br md:from-blue-50 md:to-gray-50 flex flex-col md:items-center md:justify-center px-4 sm:px-6 lg:px-8">
      {/* Mobile Header */}
      <div className="md:hidden pt-14 pb-8 px-2">
        
      </div>

      {/* Desktop and Mobile Container */}
      <div className="relative w-full max-w-md bg-white md:rounded-xl md:shadow-lg md:p-8 md:sm:p-10 md:border md:border-gray-100 flex-1 md:flex-none flex flex-col md:block">
        
        {/* Desktop Logo - Hidden on mobile */}
        <Link href={"/"} className="hidden md:block">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
                <img src="/icons.png" alt="" className="h-10 w-10" />
              
              <span className="ml-2 text-2xl font-bold text-primary">Tms</span>
            </div>
          </div>
        </Link>
<div className="md:hidden pl-4 flex"> 
  {/* <TicketIcon size={50} className="text-primary pb-1 font-bold bold " /> */}
  <img src="/icons.png" alt="" className="h-10 w-10" />
  <span className="text-4xl font-bold pl-0 text-primary"> TMS</span></div>
        {/* Title - Different for mobile and desktop */}
        <h1 className="text-2xl font-bold text-primary mb-2 md:mb-6 text-left md:text-center px-6 md:px-0">
          <span className="md:hidden">Let's Create account.</span>
          <span className="hidden md:inline">{text}</span>
        </h1>

        {/* Mobile subtitles */}
        <div className="md:hidden px-6 mb-8">
          <p className="text-primary text-base mb-1">Welcome to TMS</p>
        
        </div>

        <div className="px-6 md:px-0 flex-1 md:flex-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-1 mb-2">
                      Full Name
                    </label> */}
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full p-3 md:p-3 p-4 bg-gray-50 md:bg-gray-50 bg-white border border-gray-200 rounded-lg md:rounded-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 md:focus:ring-blue-800 focus:ring-blue-500 focus:border-transparent"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs md:text-xs text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-1 mb-2">
                      Email
                    </label> */}
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 md:p-3 p-4 bg-gray-50 md:bg-gray-50 bg-white border border-gray-200 rounded-lg md:rounded-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 md:focus:ring-blue-800 focus:ring-blue-500 focus:border-transparent"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs md:text-xs text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-1 mb-2">
                      Mobile Number
                    </label> */}
                    <FormControl>
                      <input
                        {...field}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full p-3 md:p-3 p-4 bg-gray-50 md:bg-gray-50 bg-white border border-gray-200 rounded-lg md:rounded-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 md:focus:ring-blue-800 focus:ring-blue-500 focus:border-transparent"
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
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-1 mb-2">
                      Password
                    </label> */}
                    <div className="relative">
                      <FormControl>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full p-3 md:p-3 p-4 bg-gray-50 md:bg-gray-50 bg-white border border-gray-200 rounded-lg md:rounded-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 md:focus:ring-blue-800 focus:ring-blue-500 focus:border-transparent pr-12 md:pr-10"
                          disabled={isPending}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 md:right-3 right-4 top-1/2 -translate-y-1/2 text-gray-500 md:text-gray-500 text-gray-400 hover:text-primary md:hover:text-primary hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                      </button>
                    </div>
                    <FormMessage className="text-red-500 text-xs md:text-xs text-sm mt-1" />
                  </FormItem>
                )}
              />

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

              {/* Mobile Login link - Above button */}
              <div className="md:hidden text-center mb-6">
                <span className="text-gray-500">Already have an account? </span>
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 md:py-3 py-4 bg-blue-800 md:bg-blue-800 bg-black text-white font-medium rounded-lg md:rounded-lg rounded-xl hover:bg-blue-900 md:hover:bg-blue-900 hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center"
              >
                {isPending ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isPending ? "Registering..." : "Register"}
              </button>
            </form>
          </Form>

          {/* Desktop Login section - Hidden on mobile */}
          <div className="hidden md:block mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;