import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export const CommonHeader = ({
  title,
  btnText,
  href,
}: {
  title: string;
  btnText: string;
  href: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="font-semibold text-lg">{title}</div>
      <Button asChild>
        <Link href={href}>
          <PlusIcon />
          {btnText}
        </Link>
      </Button>
    </div>
  );
};
