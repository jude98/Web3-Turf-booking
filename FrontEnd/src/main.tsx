import { App } from "@/App";
import { theme } from "@/theme";

import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { Wconfig } from "./screens";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const rootElement: any = document.getElementById("app-root");
const root = createRoot(rootElement);

root.render(
    <WagmiProvider config={Wconfig}>
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme} resetCSS={true}>
                <App />
            </ChakraProvider>
        </QueryClientProvider>
    </WagmiProvider>
);
