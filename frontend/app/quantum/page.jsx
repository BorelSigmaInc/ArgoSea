import { redirect } from "next/navigation";

/** Legacy ops URL — operators now use /internal. */
export default function QuantumRedirect() {
  redirect("/internal/");
}
