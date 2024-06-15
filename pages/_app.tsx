import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Flex, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Mantine Template</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Flex
        style={{
          width: '100vw',
          minHeight: 'fit-content',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Flex
          direction="column"
          align="center"
          gap="lg"
          w="100%"
          style={{ minHeight: '100vh' }}
          justify="center"
          py="md"
        >
          <Component {...pageProps} />
        </Flex>
      </Flex>
    </MantineProvider>
  );
}
