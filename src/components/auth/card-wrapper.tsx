"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { BackButton } from "@/components/auth/back-button";

interface Props {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  backButtonOnClick?: () => void; // 👈 add this line
  showSocial?: Boolean;
}

export function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  backButtonOnClick, // 👈 include it here
  showSocial,
}: Props) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
      <BackButton
          href={backButtonHref}
          label={backButtonLabel}
          onClick={backButtonOnClick} // 👈 pass it down
        />      </CardFooter>
    </Card>
  );
}
