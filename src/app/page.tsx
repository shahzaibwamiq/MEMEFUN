"use client";

import Banner from "@/components/banner/banner";
import AllTokens from "@/components/tokensList/all_tokens";

export default function Home() {
    const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  return (
    <>
      <Banner ApiUrl={ApiUrl ?? ""} />
      <AllTokens />
    </>
  );
};
