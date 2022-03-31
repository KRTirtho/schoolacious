import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import zainulTheme from 'configs/chakra-theme.config';
import { titumir } from 'services/titumir';
import { QueryClient, QueryClientProvider } from 'react-query';
import Appbar from 'components/shared/Appbar/Appbar';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

const queryClient = new QueryClient();

export type NextLayoutPage = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface AppLayoutProps extends AppProps {
  Component: NextLayoutPage;
}

function MyApp({ Component, pageProps }: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ChakraProvider theme={zainulTheme}>
      <UserProvider supabaseClient={titumir.supabase}>
        <QueryClientProvider client={queryClient}>
          <Appbar />
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
