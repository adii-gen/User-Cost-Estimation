import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Procu from "@/components/shared/Procu";
import Image from "next/image";

function ForgotPasswordPage() {
  return (
    <div className="    mt-3 flex items-center  ">
      <div className=" hidden md:relative md:flex  md:justify-end  ">
      <Image
            alt="img"
            src="/logo.png"
            height={250}
            width={500}
            className=" rounded-full w-[80%]  "
            />
        <div className="absolute top-[60%] left-[30%]">
          {/* <Procu /> */}
          {/* <p className="text-white text-[1.25rem] font-[700]">
            We&apos;re here to Increase your{" "}
            <span className="text-white">Productivity</span>
          </p> */}
        </div>
      </div>
      <div className="flex-grow">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
