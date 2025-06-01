"use client";

// Third-party Imports
import { SessionProvider, SessionProviderProps } from "next-auth/react";

type NextAuthProviderProps = SessionProviderProps & {
  children: React.ReactNode;
};

export const NextAuthProvider = ({
  children,
  ...rest
}: NextAuthProviderProps) => {
  return <SessionProvider {...rest}>{children}</SessionProvider>;
};
