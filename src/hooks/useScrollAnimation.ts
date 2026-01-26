import { useEffect, useRef, useState, RefObject } from 'react';

interface ScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

interface ScrollAnimationReturn {
    ref: RefObject<HTMLDivElement>;
    isVisible: boolean;
    scrollProgress: number;
}

/**
 * Custom hook for scroll-linked animations
 * Provides viewport intersection detection and scroll progress calculation
 */
export function useScrollAnimation(
    options: ScrollAnimationOptions = {}
): ScrollAnimationReturn {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = false,
    } = options;

    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            setScrollProgress(1);
            return;
        }

        // Intersection Observer for visibility
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.disconnect();
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        // Scroll progress calculation
        const handleScroll = () => {
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Calculate progress (0 to 1) based on element position in viewport
            const elementTop = rect.top;
            const elementBottom = rect.bottom;

            // Progress starts when element enters viewport and ends when it leaves
            const start = windowHeight;
            const end = -elementHeight;
            const range = start - end;
            const current = start - elementTop;

            const progress = Math.max(0, Math.min(1, current / range));
            setScrollProgress(progress);
        };

        // Throttle scroll handler for performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible, scrollProgress };
}

/**
 * Hook for detecting reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}
