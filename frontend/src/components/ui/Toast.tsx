import { Toaster } from "react-hot-toast";

export function Toast() {
  return <Toaster position="top-right" toastOptions={{ className: "font-sans text-sm" }} />;
}
