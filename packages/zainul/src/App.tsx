import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "./styles/chakra-theme";
import Routes from "./routing/RouteConfig";
import Titumir from "./services/api/titumir";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthorizationConfig from "./state/AuthorizationConfig";
import Appbar from "components/Appbar/Appbar";
import io from "socket.io-client";

export const titumirApi = new Titumir("http://localhost:4000");

const queryClient = new QueryClient();
const socket = io("http://localhost:4000", {
    withCredentials: true,
    transports: ["websocket"],
});

function App() {
    return (
        <Router>
            <AuthorizationConfig>
                <QueryClientProvider client={queryClient}>
                    {/* <ReactQueryDevtools /> */}
                    <ChakraProvider theme={chakraTheme}>
                        <Appbar />
                        <Routes></Routes>
                    </ChakraProvider>
                </QueryClientProvider>
            </AuthorizationConfig>
        </Router>
    );
}

export default App;
