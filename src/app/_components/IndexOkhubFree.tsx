"use client";

import dynamic from "next/dynamic";
const IndexGrapesJS = dynamic(() => import("@/app/_components/IndexGrapesJS"), {
  ssr: false,
});

const IndexOkhubFree = () => {
  return <IndexGrapesJS />;
};

export default IndexOkhubFree;
