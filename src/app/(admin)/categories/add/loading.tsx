import { Loader } from "lucide-react";

const loading = () => {
  return (
    <div className="flex items-center justify-center flex-1 h-full">
      <Loader className="animate-spin size-5" />
    </div>
  );
};

export default loading;
