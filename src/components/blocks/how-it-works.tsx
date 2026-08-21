import { useTranslations } from "next-intl";

import { StepList } from "@/components/blocks/step-list";
import { Container, Section, SectionHeading } from "@/components/primitives/section";

const stepIds = ["discovery", "pilot", "rollout"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <Section id="how-it-works" className="pt-0">
      <Container>
        <StepList
          steps={stepIds.map((id) => ({
            title: t(`steps.${id}.title`),
            description: t(`steps.${id}.description`),
          }))}
        >
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </StepList>
      </Container>
    </Section>
  );
}
