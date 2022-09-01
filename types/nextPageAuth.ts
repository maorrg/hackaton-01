import type { NextPage } from "next";
import { Role } from "./role";

type PageAuth = {
  role: Role;
  loading: JSX.Element;
  unauthorized: string;
};

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
  auth: PageAuth;
};
