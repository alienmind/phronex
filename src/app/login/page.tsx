/*
 * This is the login page
 * It will display the login form
 * 
 * FIXME: Implement real authentication with OAuth and an identity provider such as Google, GitHub, etc
 */
import { LoginForm } from '@/app/ui/login-form';
import { Metadata } from 'next';

/*
 * Page metadata - will be included as the metadata in the HTML
 * Can also be used for rendering titles in subsequent pages
 */
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