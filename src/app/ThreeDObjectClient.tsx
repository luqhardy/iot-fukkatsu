"use client";
import dynamic from "next/dynamic";

const ThreeDObject = dynamic(() => import("./ThreeDObject"), {
  ssr: false,
  loading: () => <div className="w-full h-full max-w-[400px] max-h-[400px] aspect-square bg-black/20 animate-pulse rounded-lg" />,
});

export default ThreeDObject;