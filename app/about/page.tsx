import type { Metadata } from "next";
import AboutStory from "@/components/sections/about-story/about-story";
import Portfolio from "@/components/sections/portfolio/portfolio";
import WorkingWith from "@/components/sections/working-with/working-with";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "about — kiwikoru",
  description:
    "KiwiKoru Limited, Auckland. A small AWS practice: the same certified engineers on your account, looking after the boring parts of your cloud.",
};

/** /about — the company story, who you work with, and the project globe. */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="about"
        sub="a small aws practice in auckland, looking after the boring parts of other people's cloud."
      />
      {/* KiwiKoru's own "build the business of their dreams" copy (real). */}
      <AboutStory />
      <WorkingWith />
      <Portfolio />
    </>
  );
}
