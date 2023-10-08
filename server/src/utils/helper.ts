// export const stripeObject = async () => {
//     const keys = (await getSecretKeys()) as ISecretKeys;
//     if (keys) {
//       const stripe = new Stripe(keys?.stripeKey, {
//         apiVersion: null,
//         maxNetworkRetries: 0,
//         httpAgent: null,
//         timeout: 8000,
//         host: "api.stripe.com",
//         port: 443,
//         telemetry: true,
//       });
  
//       return stripe;
//     }
//   };

export const DEFAULT_LIMIT = 5;