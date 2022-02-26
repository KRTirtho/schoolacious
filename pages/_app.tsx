import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import zainulTheme from 'configs/chakra-theme.config';
import { titumir } from 'services/titumir';
import { QueryClient, QueryClientProvider } from 'react-query';
import Appbar from 'components/shared/Appbar/Appbar';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={zainulTheme}>
      <UserProvider supabaseClient={titumir.supabase}>
        <QueryClientProvider client={queryClient}>
          <Appbar />
          <Component {...pageProps} />
        </QueryClientProvider>
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
