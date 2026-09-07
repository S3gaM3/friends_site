import { Approach } from "@/components/home/Approach";
import { Barrier } from "@/components/home/Barrier";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { FinalCta } from "@/components/home/FinalCta";
import { FirstMeeting } from "@/components/home/FirstMeeting";
import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { StickyCta } from "@/components/home/StickyCta";
import { Topics } from "@/components/home/Topics";
import { contentService } from "@/services/contentService";

export default async function HomePage() {
  const content = await contentService.getContent();

  return (
    <>
      <Hero site={content.site} hero={content.hero} />
      <Topics content={content.topics} />
      <Approach content={content.approach} hole={content.hole} />
      <Barrier content={content.barrier} site={content.site} />
      <ServicesPreview services={content.services} />
      <FirstMeeting content={content.firstMeeting} />
      <FaqAccordion content={content.faq} />
      <FinalCta finalCta={content.finalCta} site={content.site} />
      <StickyCta cta={content.firstMeeting.cta} />
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
