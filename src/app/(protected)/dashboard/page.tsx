"use client";
import Loader from "@/components/shared/Loader";
import { useCurrentRole, useCurrentUser } from "@/hooks/auth";
import { log } from "console";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const role = useCurrentRole() as "USER" |"platform_admin"|  undefined;
  const user = useCurrentUser();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  if (!role) {
    window.location.reload();
  }

 
  useEffect(() => {
    // const checkVendorProfile = async () => {
    //   if (role === "VENDOR") {
    //     try {
    //       const response = await fetch(`/api/users?id=${user?.id}`);
    //       const data = await response.json();
         
    //       if (data && data.length > 0) {
    //         const vendorData = data[0];
            

    //         if (vendorData.vendorProfileId === null) {
    //           router.push("/dashboard/admin");
    //         } 
          
    //         else if(vendorData.vendorProfileId ) {
    //           router.push(`/vendor/edit/${vendorData.vendorProfileId}`);
    //         }
    //       }
    //     } catch (error) {
    //       console.error("Error fetching vendor data:", error);
    //       // Handle error case - redirect to a default route or show error message
    //       router.push("/dashboard/admin");
    //     }
    //   }
    // };

    const handleRouting = async () => {
      if (!role) {
        window.location.reload();
        router.push("/auth/login");
        return;
      }

      setIsRedirecting(true);

      console.log("role",role);
      switch (role) {
        // case "SALE_PERSON":
        //   router.push("/dashboard/salePerson");
        //   break;
        // case "VENDOR":
        //   await checkVendorProfile();
        //   break;
        case "platform_admin":
          
          
            router.push("/dashboard/admin");
            break;
        case "USER":
          router.push("/dashboard/user");
          break;
          
       
        default:
          setIsRedirecting(false);
          break;
      }
      
      setIsLoading(false);
    };

    handleRouting();
  }, [router, role]);

  if (isRedirecting || isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-4">
      {/* Your default dashboard content goes here */}
    </div>
  );
}