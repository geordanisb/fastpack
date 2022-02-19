import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import {store} from '../src/app/store'
import {QueryClientProvider, QueryClient} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
     <Provider store={store}>
      <Component {...pageProps} />

     </Provider>
     <ReactQueryDevtools />
  </QueryClientProvider>
}

export default MyApp
