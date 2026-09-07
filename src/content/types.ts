export type NavItem = {
  href: string;
  label: string;
};

export type CtaLink = {
  href: string;
  label: string;
};

export type TitleText = {
  title: string;
  text: string;
};

export type LabelItem = {
  label: string;
};

export type SiteProfile = {
  name: string;
  firstName: string;
  title: string;
  tagline: string;
  city: string;
  email: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  credentials: string;
  portraitSrc: string;
  portraitAlt: string;
  aboutPortraitSrc?: string;
};

export type HeroContent = {
  headline: string;
  support: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  metaLine: string;
  trustChips: LabelItem[];
};

export type RecognizeSelfContent = {
  title: string;
  lead: string;
  items: string[];
  footer: string;
};

export type TopicsContent = {
  title: string;
  lead: string;
  items: TitleText[];
};

export type ApproachContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  flow: string[];
  methodsTitle: string;
  methods: string[];
};

export type HoleContent = {
  title: string;
  text: string;
};

export type TrustTimelineContent = {
  title: string;
  lead: string;
  steps: string[];
};

export type BarrierContent = {
  title: string;
  paragraphs: string[];
};

export type FirstMeetingContent = {
  title: string;
  lead: string;
  steps: TitleText[];
};

export type ServicesContent = {
  title: string;
  lead: string;
  items: {
    id: string;
    title: string;
    duration: string;
    price: string;
    format: string;
    description: string;
  }[];
};

export type StartChooserContent = {
  title: string;
  options: { id: string; label: string }[];
  reply: string;
  cta: CtaLink;
};

export type FaqContent = {
  title: string;
  items: { question: string; answer: string }[];
};

export type FinalCtaContent = {
  title: string;
  lead: string;
  primaryCta: CtaLink;
  secondaryCtaLabel: string;
};

export type AboutContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
};

export type BookingContent = {
  title: string;
  lead: string;
  privacy: string;
  submitLabel: string;
};

export type FooterContent = {
  note: string;
  crisis: string;
};

/** Legacy fields kept for admin merge / secondary pages. */
export type LegacyHomeBlocks = {
  trustStrip: { items: TitleText[] };
  recognition: { title: string; lead: string; scenes: TitleText[] };
  shift: { title: string; lead: string; outcomes: TitleText[] };
  aboutTeaser: { title: string; lead: string; text: string; cta: CtaLink };
  process: { title: string; lead: string; steps: TitleText[] };
  testimonials: { title: string; lead: string; items: { quote: string; name: string; meta: string }[] };
  bookingCard: {
    title: string;
    price: string;
    duration: string;
    places: string;
    hours: string;
    note: string;
    primaryCta: CtaLink;
    secondaryLabel: string;
  };
};

export type SiteContent = {
  site: SiteProfile;
  nav: NavItem[];
  hero: HeroContent;
  recognizeSelf: RecognizeSelfContent;
  topics: TopicsContent;
  approach: ApproachContent;
  hole: HoleContent;
  trustTimeline: TrustTimelineContent;
  barrier: BarrierContent;
  firstMeeting: FirstMeetingContent;
  services: ServicesContent;
  startChooser: StartChooserContent;
  faq: FaqContent;
  finalCta: FinalCtaContent;
  about: AboutContent;
  booking: BookingContent;
  footer: FooterContent;
} & LegacyHomeBlocks;

export type StoredBooking = {
  id: string;
  name: string;
  contact: string;
  format: string;
  timeWindow: string;
  message: string;
  createdAt: string;
};
