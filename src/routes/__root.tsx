import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">This star isn't in our sky yet.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-rose px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">Something dimmed.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Take a breath, we'll try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-rose px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a1530" },
      { title: "Nova — Your new beginning, understood." },
      { name: "description", content: "Nova pairs with your smart wristband to understand menopause — hot flashes, sleep, emotion and care, beautifully." },
      { property: "og:title", content: "Nova — Your new beginning, understood." },
      { property: "og:description", content: "Nova pairs with your smart wristband to understand menopause — hot flashes, sleep, emotion and care, beautifully." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nova — Your new beginning, understood." },
      { name: "twitter:description", content: "Nova pairs with your smart wristband to understand menopause — hot flashes, sleep, emotion and care, beautifully." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bb02e7b1-42b0-4f55-9b0a-a12507f01183/id-preview-d5662be4--efd69d65-1a03-43da-b8ab-0f0e0b31348c.lovable.app-1779664176022.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bb02e7b1-42b0-4f55-9b0a-a12507f01183/id-preview-d5662be4--efd69d65-1a03-43da-b8ab-0f0e0b31348c.lovable.app-1779664176022.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: "16px" } }} />
    </QueryClientProvider>
  );
}
