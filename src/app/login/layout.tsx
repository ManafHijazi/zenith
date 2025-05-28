import { ReactNode } from 'react';

// Prevents the parent /admin guard from running on the login page
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
