// import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
// import type { AuthConfig } from "convex/server";

// export default {
//   providers: [getAuthConfigProvider()],
// } satisfies AuthConfig;



import type { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // This forces Convex to trust the Vercel URL specifically
      domain: "https://bloom-eight-kappa.vercel.app",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;