import UserView from "../../../components/maer/UserView";

export const metadata = {
  title: "Marine Maer estimator",
  description: "Customer estimator and live service tracking from certified Maersat vendors.",
  robots: { index: false, follow: false },
};

export default function UserPage() {
  return <UserView />;
}
