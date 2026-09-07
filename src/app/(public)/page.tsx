import { Approach } from "@/components/home/Approach";
import { Barrier } from "@/components/home/Barrier";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { FinalCta } from "@/components/home/FinalCta";
import { FirstMeeting } from "@/components/home/FirstMeeting";
import { Hero } from "@/components/home/Hero";
import { HoleMetaphor } from "@/components/home/HoleMetaphor";
import { RecognizeSelf } from "@/components/home/RecognizeSelf";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { StartChooser } from "@/components/home/StartChooser";
import { StickyCta } from "@/components/home/StickyCta";
import { Topics } from "@/components/home/Topics";
import { TrustTimeline } from "@/components/home/TrustTimeline";
import { contentService } from "@/services/contentService";

export default async function HomePage() {
  const content = await contentService.getContent();

  return (
    <>
      <Hero site={content.site} hero={content.hero} />
      <RecognizeSelf content={content.recognizeSelf} />
      <Topics content={content.topics} />
      <Approach content={content.approach} />
      <HoleMetaphor content={content.hole} />
      <TrustTimeline content={content.trustTimeline} />
      <Barrier content={content.barrier} site={content.site} />
      <FirstMeeting content={content.firstMeeting} />
      <ServicesPreview services={content.services} />
      <StartChooser content={content.startChooser} />
      <FaqAccordion content={content.faq} />
      <FinalCta finalCta={content.finalCta} site={content.site} />
      <StickyCta cta={content.hero.primaryCta} />
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
