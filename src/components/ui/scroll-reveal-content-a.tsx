"use client"

import Link from "next/link"
import React from "react"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { useMotionValueEvent, useScroll } from "motion/react"

export const centralColumnStyle = "w-[90%] max-w-[1340px] mx-auto"
export const pageYPadding = "py-10 md:py-12 lg:py-20 xl:py-30 2xl:py-40"
const defaultTitleClass = "text-2xl md:text-3xl font-semibold mb-2 text-foreground"
const defaultDescriptionClass = "text-base md:text-lg font-medium mb-1 md:mb-2 text-foreground max-w-[400px] leading-[130%]"
const panelClass =
  "absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300"

export interface ItemContent {
  title: string
  description: string
  /** Raw inner SVG markup (paths/shapes only, no outer `<svg>` tag). */
  icon: string
  /** Coordinate space the `icon` markup is drawn in. */
  viewBox?: string
  /** CSS color for the panel background — hex or `var(--token)`. */
  color: string
  /** When set, the title links here and a "Batafsil" line is added below. */
  href?: string
}

interface Props extends React.ComponentProps<"div"> {
  items: ItemContent[]
  titleClass?: string
  descriptionClass?: string
}

const ScrollRevealContentA = ({
  items,
  titleClass = defaultTitleClass,
  descriptionClass = defaultDescriptionClass,
  className,
  ...props
}: Props) => {
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const ref0 = useRef(null)
  const count = items.length

  const { scrollYProgress } = useScroll({
    target: ref0,
  })
  useMotionValueEvent(scrollYProgress, "change", () => {
    // @ts-ignore
    setScrollProgress(scrollYProgress.current)
  })

  // Same threshold as the panel crossfade below: the last panel whose threshold
  // has been passed is the one on top, i.e. the one on screen.
  const activeIndex = items.reduce(
    (last, _item, i) => (scrollProgress > (i === 0 ? -1 : i / count) ? i : last),
    0,
  )

  return (
    <div className={cn("bg-background", className)} ref={ref0} {...props}>
      <div className="max-w-[90vw] mx-auto">
        <div className="flex w-full mx-auto relative z-20">
          <div
            className={cn(
              centralColumnStyle,
              // Top padding is just breathing room — the site header now
              // auto-hides on scroll (see Motion.tsx + header.css) instead of
              // permanently occupying this space. Bottom padding still dodges
              // a real fixed element: the mobile-only call bar (~76px +
              // buffer — see mobile-cta.css, hidden from 860px up), which
              // doesn't hide. Height stays a flat 100vh (box-sizing:
              // border-box eats the padding out of that, not on top of it),
              // so this only shrinks the visible content box, not the sticky
              // element itself.
              "sticky top-0 flex flex-col w-full items-start justify-center h-[100vh] pt-6 pb-[96px] md:pt-8 min-[860px]:pb-0",
            )}
          >
            <div className="flex flex-row gap-16 md:gap-24 lg:gap-32 xl:gap-40 2xl:gap-48 w-full h-full">
              <div className="lg:!w-[50vw] !w-full h-auto flex flex-col justify-center gap-4 md:gap-10">
                {items.map((item, i) => (
                  <PointItem
                    key={item.title}
                    active={true}
                    number={String(i + 1).padStart(2, "0")}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    viewBox={item.viewBox}
                    color={item.color}
                    href={item.href}
                    thresholdStart={i / count}
                    thresholdEnd={(i + 1) / count}
                    scrollProgress={scrollProgress}
                  />
                ))}
              </div>
              <div className="hidden lg:flex flex-col justify-center items-center !w-[50vw] relative h-full">
                {/* The panels stack on `absolute inset-0`, so this wrapper — not
                    the full-height sticky column — is what sizes them: a
                    centred square card scaled off the viewport height and
                    capped, so it stays proportionate to the figure inside
                    instead of stretching the whole 100vh. */}
                <div className="relative shrink-0 aspect-square h-[min(56vh,500px)] max-w-full">
                  {items.map((item, i) => (
                    <div
                      key={item.title}
                      className={cn(
                        panelClass,
                        scrollProgress > (i === 0 ? -1 : i / count) ? "opacity-100" : "opacity-0",
                      )}
                      // Panels stack, so the frontmost visible one is the active
                      // service. Purely a styling hook for the per-item figure
                      // animations — the crossfade above is untouched by it.
                      data-active={i === activeIndex ? "true" : undefined}
                      style={{ background: item.color }}
                    >
                      {/* Sized as a share of the card, not in px, so the figure
                          keeps the same inset at every card size. */}
                      <FigureSvg icon={item.icon} viewBox={item.viewBox} className="w-[44%] h-[44%] text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: `${count * 100}vh` }} />
        </div>
      </div>
    </div>
  )
}

export default ScrollRevealContentA

const FigureSvg = ({ icon, viewBox, className }: { icon: string; viewBox?: string; className: string }) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{
      __html: `<svg width="100%" height="100%" viewBox="${viewBox ?? "0 0 26 26"}" fill="none" aria-hidden="true">${icon}</svg>`,
    }}
  />
)

const getBarPercentageHeight = (scrollProgress: number, thresholdStart: number, thresholdEnd: number) => {
  if (scrollProgress < thresholdStart) {
    return 0
  }
  if (scrollProgress > thresholdEnd) {
    return 100
  }
  return ((scrollProgress - thresholdStart) / (thresholdEnd - thresholdStart)) * 100
}

const PointItem = ({
  active,
  number,
  title,
  description,
  icon,
  viewBox,
  color,
  href,
  thresholdStart,
  thresholdEnd,
  scrollProgress,
}: {
  active: boolean
  number: string
  title: string
  description: string
  icon: string
  viewBox?: string
  color: string
  href?: string
  thresholdStart: number
  thresholdEnd: number
  scrollProgress: number
}) => {
  const barHeightPercentage = getBarPercentageHeight(scrollProgress, thresholdStart, thresholdEnd)
  const isActive = barHeightPercentage > 0
  const titleContent = href ? (
    <Link href={href} className="services__title-link">
      {title}
    </Link>
  ) : (
    title
  )
  return (
    <div className={cn("flex flex-col interactive w-full", active ? "opacity-100" : "opacity-50")}>
      {/* Desktop/tablet-with-panel (lg+): unchanged from before this figure sat
          in its own swapping panel on the right, so this stays exactly as it
          was — number heading, then the progress-line row, both untouched
          inside this wrapper. Visibility is switched entirely in services.css
          via `.services__desktop-row` / `.services__mobile-card`, deliberately
          NOT via Tailwind's `hidden`/`lg:` utilities on the same elements that
          also need a Tailwind `display` utility (e.g. `flex` on the row below)
          — a plain-CSS rule and a Tailwind utility class tie on specificity,
          so whichever stylesheet happens to load last wins regardless of
          breakpoint, which is what showed the mobile card on desktop too. This
          wrapper carries the ONLY display toggle; nothing inside it competes. */}
      <div className="services__desktop-row w-full">
        <div className="w-full">
          <h3 className={cn(defaultTitleClass, "mb-1 ml-5 md:mb-4", isActive ? "opacity-100" : "opacity-50")}>{number}</h3>
        </div>
        <div className="w-full flex relative left-[16px]">
          <div className="w-[70px] flex items-start justify-center relative">
            <div className="h-full w-[2px] bg-foreground/10 absolute top-0 left-[50%] -translate-x-1/2" />
            <div
              className="h-full w-[2px] bg-foreground absolute top-0 left-[50%] -translate-x-1/2"
              style={{ height: `${barHeightPercentage}%` }}
            />
          </div>
          <div className="w-[calc(100% - 40px)] pl-4">
            <div className="flex flex-col gap-1">
              <h3 className={cn(defaultTitleClass, isActive ? "opacity-100" : "opacity-50")}>{titleContent}</h3>
              <p className={cn(defaultDescriptionClass, isActive ? "opacity-100" : "opacity-50")}>{description}</p>
              {href && (
                <Link href={href} className="services__more-link">
                  Batafsil
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Below lg: no shared swap panel exists (it's `hidden lg:flex`), so each
          item carries its own compact card — figure + text always visible,
          no swap/sync state to manage. The figure's animation is triggered by
          the same `isActive` scroll-threshold this item already computes for
          its progress line above, via the `svc-fig` rules in services.css
          (they key off any `[data-active='true']` ancestor inside `.services`,
          so this needs no CSS of its own to animate). */}
      <div className="services__mobile-card" data-active={isActive || undefined}>
        <div className="services__mobile-card-figure" style={{ background: color }}>
          <FigureSvg icon={icon} viewBox={viewBox} className="w-[58%] h-[58%] text-white" />
        </div>
        <div className="services__mobile-card-body">
          <span className="services__mobile-card-number">{number}</span>
          <h3 className="services__mobile-card-title">{titleContent}</h3>
          <p className="services__mobile-card-desc">{description}</p>
          {href && (
            <Link href={href} className="services__more-link">
              Batafsil
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
