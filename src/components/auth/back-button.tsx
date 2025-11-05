"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  href: string;
  label: string;
  onClick?: () => void; // 👈 add this
}

export function BackButton({ href, label, onClick }: Props) {
  if (onClick) {
    return (
      <Button
        size="sm"
        variant="link"
        className="w-full font-normal"
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="link"
      className="w-full font-normal"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
