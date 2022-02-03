import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app'

import {QueryClientProvider, QueryClient} from 'react-query'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
  </QueryClientProvider>
}

export default MyApp