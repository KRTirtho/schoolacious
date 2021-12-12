import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "./styles/chakra-theme";
import ApplicationRoutes from "./routing/RouteConfig";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthorizationConfig from "./state/AuthorizationConfig";
import Appbar from "components/Appbar/Appbar";

const queryClient = new QueryClient();

function App() {
    return (
        <Router>
            <AuthorizationConfig>
                <QueryClientProvider client={queryClient}>
                    {/* <ReactQueryDevtools /> */}
                    <ChakraProvider theme={chakraTheme}>
                        <Appbar />
                        <ApplicationRoutes></ApplicationRoutes>
                    </ChakraProvider>
                </QueryClientProvider>
            </AuthorizationConfig>
        </Router>
    );
}

export default App;
