import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import router, { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import { MantineProvider, ColorScheme, LoadingOverlay } from "@mantine/core";
import { NextPageWithAuth } from "../types/nextPageAuth";
import { NextComponentType, NextPageContext } from "next/types";
import { Role } from "../types/role";
import { Unauthorized } from "../components/Unauthorized";
import { NotificationsProvider } from "@mantine/notifications";
type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
  Partial<NextPageWithAuth>;

type AppPropsWithAuth<P = {}> = AppProps<P> & {
  Component: NextComponentWithAuth;
};

export default function App(
  props: AppPropsWithAuth & { colorScheme: ColorScheme }
) {
  const { Component, pageProps } = props;

  const router = useRouter();

  return (
    <>
      <Head>
        <title>FeedMe</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1,, maximum-scale=1, user-scalable=no, shrink-to-fit=no, width=device-width"
        />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <SessionProvider session={pageProps?.session}>
            {Component.auth?.role && Component.auth.role !== Role.STUDENT ? (
              <Auth pageAccessLevel={Component.auth.role}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

interface AuthProps {
  pageAccessLevel: Role;
  children: JSX.Element;
}

function Auth({ pageAccessLevel, children }: AuthProps) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status === "loading") return;
    if (!isUser) router.push("/");
  }, [isUser, status]);

  if (isUser) {
    if (
      session.user.role === Role.ADMIN ||
      session.user.role === Role.TEACHER ||
      session.user.role === Role.STUDENT ||
      session.user.role === pageAccessLevel
    ) {
      return children;
    } else {
      return <Unauthorized user={session.user} />;
    }
  }

  return <LoadingOverlay visible={true} />;
}
