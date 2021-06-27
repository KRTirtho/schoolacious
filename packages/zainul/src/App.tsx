import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./configurations/theme";
import Routes from "./configurations/Routes";
import Titumir from "./configurations/titumir";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AuthorizationStore from "./state/AuthorizationStore";

export const titumirApi = new Titumir("http://localhost:4000");

const queryClient = new QueryClient();

function App() {
    return (
        <Router>
            <AuthorizationStore>
                <QueryClientProvider client={queryClient}>
                    {/* <ReactQueryDevtools /> */}
                    <ChakraProvider theme={theme}>
                        <Routes></Routes>
                    </ChakraProvider>
                </QueryClientProvider>
            </AuthorizationStore>
        </Router>
    );
}

export default App;
