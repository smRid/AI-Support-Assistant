import React from "react";
import Script from "next/script";

const Page = () => {
  return (
    <div>
      <Script
        src="http://localhost:3000/widget.js"
        data-id="ac443301-6f47-444b-9eee-622b640e7026"
        defer
      ></Script>
    </div>
  );
};

export default Page;