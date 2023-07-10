import { useEffect, useRef } from "react"

export const useInfinityScroll = (loading: boolean, increasePage: () => void) => {

    const elementObservable = useRef<HTMLDivElement>()

    useEffect(() => {
        if (elementObservable.current == null) return

        const observer = new IntersectionObserver(([firstElement, _]) => {
            if (firstElement.isIntersecting && loading === false) {
                increasePage()
            }
        }, { rootMargin: '350px' })

        observer.observe(elementObservable.current as HTMLDivElement)

        return () => {
            if (observer == null) return
            observer.disconnect()
        }
    }, [elementObservable, loading])

    return { elementObservable }
}