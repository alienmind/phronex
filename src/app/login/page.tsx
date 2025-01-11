import { LoginForm } from '@/app/ui/login-form';
import { Metadata } from 'next';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'Login',
};
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <LoginForm />
    </main>
  );
}