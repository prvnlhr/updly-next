"use client";
import React from "react";
import { Oval } from "react-loader-spinner";
interface LoadingSpinnerProps {
  ringColor?: string;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ ringColor }) => {
  return (
    <div className="w-[100%] h-[100%] flex items-center justify-center">
      <Oval
        visible={true}
        color={ringColor || "white"}
        secondaryColor="transparent"
        strokeWidth="3"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass="w-[100%] h-[100%] flex items-center justify-center"
      />
    </div>
  );
};

export default LoadingSpinner;
