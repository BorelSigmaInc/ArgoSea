import { redirect } from "next/navigation";

/** Legacy /argo path → Maersat platform. */
export default function PlatformRedirect() {
  redirect("/platform/");
}
