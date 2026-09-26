import { Reveal, SplitWords } from "./Reveal"

export default function SectionHeader({
  index,
  eyebrow,
  title,
  accent,
  intro,
}: {
  index: string
  eyebrow: string
  title: string
  accent?: string
  intro?: string
}) {
  return (
    <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12">
      <div className="md:col-span-8">
        <Reveal>
          <span className="eyebrow">
            <span className="text-saffron">{index}</span> {eyebrow}
          </span>
        </Reveal>
        <h2 className="h-section mt-6">
          <SplitWords text={title} />
          {accent && (
            <>
              {" "}
              <span className="serif-accent">
                <SplitWords text={accent} delay={0.15} />
              </span>
            </>
          )}
        </h2>
      </div>
      {intro && (
        <Reveal delay={0.2} className="self-end md:col-span-4">
          <p className="max-w-md text-[15px] leading-relaxed text-bone-2">{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
