// Components Imports
import { NextAuthProvider } from "./providers/NextAuthProvider";
import { ThemeProviderMUI } from "./providers/ThemeProviderMUI";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <ThemeProviderMUI>{children}</ThemeProviderMUI>;
    </NextAuthProvider>
  );
};

export default Providers;
