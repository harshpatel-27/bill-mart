import { Loader } from "lucide-react";

export const CustomLoader = () => {
  return (
    <div className="flex items-center justify-center flex-1 h-full">
      <Loader className="animate-spin size-5" />
    </div>
  );
};
