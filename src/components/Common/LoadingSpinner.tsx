import React from "react";
import { Oval } from "react-loader-spinner";

interface LoadingSpinnerProps {
  color?: string;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color }) => {
  return (
    <div className="w-full aspect-square flex items-center justify-center">
      <div className="w-[80%] h-[80%] flex items-center justify-center">
        <Oval
          visible={true}
          height="100%"
          width="100%"
          color={color || "white"}
          secondaryColor="transparent"
          strokeWidth="3"
          ariaLabel="oval-loading"
          wrapperStyle={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
