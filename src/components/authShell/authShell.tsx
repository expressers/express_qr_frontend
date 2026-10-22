import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/hooks";
import { BrandGlyph, BrandMark } from "../brandMark";
import { StaticBackdrop } from "../homeBackground/StaticBackdrop";

type AuthShellProps = {
  children: ReactNode;
  /**
   * split: form panel plus a decorative panel (lg and up). The site header comes from the layout.
   * centered: a single card for status screens that render outside the layout (own brand link).
   */
  layout?: "split" | "centered";
};

/** Shared frame of the authentication screens: no remote imagery, black and white only. */
function AuthShell({ children, layout = "split" }: AuthShellProps) {
  const { translations } = useLang();
  const t = translations.components.AuthShell;

  if (layout === "centered") {
    return (
      <div className="relative flex min-h-dvh flex-col bg-background">
        <header className="flex h-16 items-center px-4 md:h-[4.5rem] md:px-8">
          <Link to="/" className="rounded-md text-lg md:text-xl">
            <BrandMark variant="full" size={22} />
          </Link>
        </header>
        <main className="grid flex-1 place-items-center px-4 pb-16 pt-4">
          <div className="w-full max-w-[26rem] rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh w-full bg-background lg:grid-cols-2">
      <section className="flex min-h-dvh flex-col justify-center px-4 pb-10 pt-24 sm:px-8">
        <div className="mx-auto w-full max-w-[25rem]">{children}</div>
      </section>
      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden border-l border-border lg:block">
        <StaticBackdrop />
        <BrandGlyph
          size={360}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground opacity-[0.06]"
        />
        <p className="absolute inset-x-10 bottom-10 max-w-xs text-balance text-xl font-semibold leading-snug tracking-tight text-foreground">
          {t.tagline}
        </p>
      </aside>
    </div>
  );
}

export { AuthShell };
