import { Suspense } from "react";
import SignInView from "../../../components/maer/SignInView";

export const metadata = {
  title: "Log in to Maersat",
  description: "Sign in with your Maersat ID to Marine Maer.",
  robots: { index: true, follow: true },
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="maer-login" />}>
      <SignInView />
    </Suspense>
  );
}
