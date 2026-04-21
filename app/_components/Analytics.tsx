"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-NQ50M9DX8L";
const STORAGE_KEY = "holstrup-cookies-consent";

export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      setAllowed(window.localStorage.getItem(STORAGE_KEY) === "all");
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
