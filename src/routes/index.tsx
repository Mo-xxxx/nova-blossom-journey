import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => null,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nova:profile");
      const onboarded = raw ? JSON.parse(raw)?.onboarded : false;
      throw redirect({ to: onboarded ? "/home" : "/onboarding" });
    }
    throw redirect({ to: "/onboarding" });
  },
});
