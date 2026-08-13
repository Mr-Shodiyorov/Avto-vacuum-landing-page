"use client"

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
  /** CSS color for the panel background — hex or `var(--token)`. */
  color: string
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
                    thresholdStart={i / count}
                    thresholdEnd={(i + 1) / count}
                    scrollProgress={scrollProgress}
                  />
                ))}
              </div>
              <div className="hidden lg:flex flex-col justify-center items-center !w-[50vw] relative h-full">
                {items.map((item, i) => (
                  <div
                    key={item.title}
                    className={cn(panelClass, scrollProgress > (i === 0 ? -1 : i / count) ? "opacity-100" : "opacity-0")}
                    style={{ background: item.color }}
                  >
                    <span
                      className="w-40 h-40 xl:w-52 xl:h-52 text-white"
                      dangerouslySetInnerHTML={{
                        __html: `<svg width="100%" height="100%" viewBox="0 0 26 26" fill="none" aria-hidden="true">${item.icon}</svg>`,
                      }}
                    />
                  </div>
                ))}
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
  thresholdStart,
  thresholdEnd,
  scrollProgress,
}: {
  active: boolean
  number: string
  title: string
  description: string
  thresholdStart: number
  thresholdEnd: number
  scrollProgress: number
}) => {
  const barHeightPercentage = getBarPercentageHeight(scrollProgress, thresholdStart, thresholdEnd)
  const isActive = barHeightPercentage > 0
  return (
    <div className={cn("flex flex-col interactive w-full", active ? "opacity-100" : "opacity-50")}>
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
            <h3 className={cn(defaultTitleClass, isActive ? "opacity-100" : "opacity-50")}>{title}</h3>
            <p className={cn(defaultDescriptionClass, isActive ? "opacity-100" : "opacity-50")}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
