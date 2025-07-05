import React from "react";

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="absolute inset-0 px-3 bg-background rounded-md flex items-center justify-center">
      {children}
    </div>
  );
};

export default layout;
