'use client'

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

export type CarouselApi = UseEmblaCarouselType[1]
export const Carousel = (props: React.ComponentProps<'div'>) => {
 const [ref] = useEmblaCarousel()
 return <div ref={ref} {...props} />
}
export const CarouselContent = (props: React.ComponentProps<'div'>) => <div {...props} />
export const CarouselItem = (props: React.ComponentProps<'div'>) => <div {...props} />
export const CarouselPrevious = (props: React.ComponentProps<'button'>) => <button {...props} />
export const CarouselNext = (props: React.ComponentProps<'button'>) => <button {...props} />
