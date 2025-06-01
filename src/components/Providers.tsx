// Components Imports
import { NextAuthProvider } from './providers/NextAuthProvider';
import { ThemeProviderMUI } from './providers/ThemeProviderMUI';
import { ToastContainer } from 'react-toastify';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <ThemeProviderMUI>{children}</ThemeProviderMUI>
      <ToastContainer />
    </NextAuthProvider>
  );
};

export default Providers;
