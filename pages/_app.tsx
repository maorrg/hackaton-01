import React from "react";

import { useEffect } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { MantineProvider, ColorScheme, createStyles } from "@mantine/core";
import { Box } from "@mantine/core";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  const router = useRouter();

  return (
    <>
      <Head>
        <title>XPanda Empresa</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1,, maximum-scale=1, user-scalable=no, shrink-to-fit=no, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
            <SessionProvider session={pageProps?.session}>
              <Component {...pageProps} />
            </SessionProvider>
      </MantineProvider>
    </>
  );
}
