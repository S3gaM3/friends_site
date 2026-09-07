import type { CtaLink } from "@/content/types";
import { Button } from "@/components/ui/Button";

export function StickyCta({ cta }: { cta: CtaLink }) {
  return (
    <div className="sticky-cta md:hidden">
      <Button href={cta.href} className="w-full">
        {cta.label}
      </Button>
    </div>
  );
}
