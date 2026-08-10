import { CinematicHeroMedia } from "@/components/media/CinematicHeroMedia";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { MediaAsset } from "@/lib/media";

type HomeHeroProps = {
  asset: MediaAsset;
};

export function HomeHero({ asset }: HomeHeroProps) {
  return (
    <section
      id="home-hero"
      aria-labelledby="home-hero-title"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-ink text-on-brand"
    >
      <span
        id="home-hero-sentinel"
        data-testid="home-hero-sentinel"
        className="pointer-events-none absolute left-0 top-28 h-px w-px"
        aria-hidden="true"
      />
      <CinematicHeroMedia asset={asset} />
      <Container
        variant="wide"
        className="relative z-10 flex min-h-[100svh] items-end pb-14 pt-32 sm:pb-16 sm:pt-40 md:pb-20 md:pt-44 lg:pb-24 xl:pt-48"
      >
        <div className="max-w-[46rem]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
            DFW Weddings + Events
          </p>
          <h1
            id="home-hero-title"
            className="mt-5 max-w-[10ch] font-display text-[clamp(3.35rem,7vw,6.9rem)] font-extrabold italic leading-[.88] tracking-[-.055em] text-balance"
          >
            One event. One crew. Zero handoffs.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-on-brand/78 sm:text-lg sm:leading-8">
            Photo, film, entertainment and production—planned around the same room,
            the same timeline and the moments that matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/check-availability">Check Availability</Button>
            <Button
              href="/pricing"
              variant="secondary"
              className="!border-on-brand/40 !bg-ink/35 !text-on-brand backdrop-blur-sm hover:!border-on-brand hover:!bg-ink/60"
            >
              Explore Pricing →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
