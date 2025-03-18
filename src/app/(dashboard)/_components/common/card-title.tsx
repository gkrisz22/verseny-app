import React from "react";

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center">
        <span className=" w-2 h-6 bg-primary rounded-sm"></span>
      <h2 className="text-xl  pl-4">{children}</h2>
    </div>
  );
};

export default CardTitle;
