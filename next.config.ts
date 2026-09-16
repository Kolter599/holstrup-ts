import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Uden den her svarede både holstrup-ts.dk og www.holstrup-ts.dk med 200.
   * Canonical pegede rigtigt, men Google havde stadig begge varianter i indekset
   * — Search Console viste http://holstrup-ts.dk/ som en selvstændig side med
   * over 6.000 eksponeringer. Én vært, ét sæt signaler.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "holstrup-ts.dk" }],
        destination: "https://www.holstrup-ts.dk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
