"use client"
import { useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

// import Navigation from "@/components/Navigation";
import Footer from "@/components/shared/Gennextfooter";
// import TravelDealSearch from "./search/page";
import { useSession } from "next-auth/react";
// import Homepage from "@/components/Homepage";
import { useCurrentRole, useCurrentUser } from "@/hooks/auth";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import Homepage from "@/components/Homepage";
 
export default function Home() {
  // const { data: session, status } = useSession();
  // const user = useCurrentUser();
function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
 
  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }
 
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }
 
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification()
      setMessage('')
    }
  }
 
  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }
 
  return (
    <div>
      
    </div>
  )
}
  function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
  function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
 
  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )
 
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])
 
  if (isStandalone) {
    return null // Don't show install button if already installed
  }
 
  return (
    <div>
      
    </div>
  )
}
  const role = useCurrentRole() as "USER" | "TRAVEL_AGENT" | "HOTEL_ADMIN" | "SALE_PERSON" | "SUPER_ADMIN" | undefined;
  console.log("role",role);
  
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  
  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleRouting = async () => {
      if (!role) {
        return;
      }

      setIsRedirecting(true);
      switch (role) {
        case "USER":
          router.push("/dashboard/user");
          break;
          case "SUPER_ADMIN":
            router.push("/dashboard/superadmin");
            break;
        case "TRAVEL_AGENT":
          router.push("/dashboard/home");
        default:
          setIsRedirecting(false);
          break;
      }
      
    };
    handleRouting();
  }, [router, role]);


  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return <Loader />;;
  }

  if (isRedirecting ) {
    return <Loader />;
  }

  
  // if (user) {
  //   return (
  //     <main className="relative">
  //       <Navigation />
  //       <TravelDealSearch />
  //       <Footer />
  //     </main>
  //   );
  // }

  // If user is authenticated, show the main application
  return (
  <div>
    <PushNotificationManager />
      <InstallPrompt />
    <Homepage />

  </div>
 )
}