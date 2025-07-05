import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackBtn = () => {
  const router = useRouter();
  return (
    <>
      <div
        onClick={router.back}
        className="text-primary flex items-center justify-start gap-1 text-xs cursor-pointer"
      >
        <ArrowLeft className="size-4" /> Back
      </div>
    </>
  );
};
