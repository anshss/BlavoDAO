// "use client";

// import * as React from "react";
// import {
//     RainbowKitProvider,
//     getDefaultWallets,
//     connectorsForWallets,
// } from "@rainbow-me/rainbowkit";
// import {
//     argentWallet,
//     trustWallet,
//     ledgerWallet,
// } from "@rainbow-me/rainbowkit/wallets";
// import { configureChains, createConfig, WagmiConfig } from "wagmi";
// import {  polygon, polygonMumbai, sepolia} from "wagmi/chains";
// import { publicProvider } from "wagmi/providers/public";

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//     [
//         // polygon,
//         polygonMumbai,
//         sepolia,
//         ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [polygonMumbai] : []),
//     ],
//     [publicProvider()]
// );

// // const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
// const projectId = `95f8ce26a83baf6d9b6db95a07e082a1`;

// const { wallets } = getDefaultWallets({
//     appName: "IKnowSpots",
//     projectId,
//     chains,
// });

// const demoAppInfo = {
//     appName: "IKnowSpots",
// };

// const connectors = connectorsForWallets([
//     ...wallets,
//     {
//         groupName: "Other",
//         wallets: [
//             argentWallet({ projectId, chains }),
//             trustWallet({ projectId, chains }),
//             ledgerWallet({ projectId, chains }),
//         ],
//     },
// ]);

// const wagmiConfig = createConfig({
//     autoConnect: true,
//     connectors,
//     publicClient,
//     webSocketPublicClient,
// });

// export function Providers({ children }: { children: React.ReactNode }) {
//     const [mounted, setMounted] = React.useState(false);
//     React.useEffect(() => setMounted(true), []);
//     return (
//         <WagmiConfig config={wagmiConfig}>
//             <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
//                 {mounted && children}
//             </RainbowKitProvider>
//         </WagmiConfig>
//     );
// }


import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import * as React from "react";


const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: '95f8ce26a83baf6d9b6db95a07e082a1',
    chains: [mainnet, polygon, optimism, arbitrum, base, zora],
    ssr: false, // If your dApp uses server side rendering (SSR)
  });

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        // <WagmiConfig config={wagmiConfig}>
        //     <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        //         {mounted && children}
        //     </RainbowKitProvider>
        // </WagmiConfig>

        <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
          {mounted && children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
}

//   const App = () => {
//     return (
//       <WagmiProvider config={config}>
//         <QueryClientProvider client={queryClient}>
//           <RainbowKitProvider>
//             {/* Your App */}
//           </RainbowKitProvider>
//         </QueryClientProvider>
//       </WagmiProvider>
//     );
//   };