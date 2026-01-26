/**
 * Animation helper utilities for motion-first design
 */

/**
 * Calculate stagger delay for sequential animations
 */
export function calculateStagger(index: number, baseDelay: number = 80): number {
    return index * baseDelay;
}

/**
 * Map scroll progress (0-1) to animation progress with easing
 */
export function mapScrollToProgress(
    scrollProgress: number,
    start: number = 0,
    end: number = 1,
    ease: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'linear'
): number {
    // Clamp scroll progress
    const clamped = Math.max(0, Math.min(1, scrollProgress));

    // Apply easing
    let eased = clamped;
    switch (ease) {
        case 'easeIn':
            eased = clamped * clamped;
            break;
        case 'easeOut':
            eased = 1 - Math.pow(1 - clamped, 2);
            break;
        case 'easeInOut':
            eased = clamped < 0.5
                ? 2 * clamped * clamped
                : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
            break;
    }

    // Map to range
    return start + (end - start) * eased;
}

/**
 * Generate CSS custom property for stagger animation
 */
export function getStaggerStyle(index: number, baseDelay: number = 80): React.CSSProperties {
    return {
        '--stagger-delay': `${calculateStagger(index, baseDelay)}ms`,
        animationDelay: `${calculateStagger(index, baseDelay)}ms`,
    } as React.CSSProperties;
}

/**
 * Generate CSS custom property for letter cascade animation
 */
export function getLetterCascadeStyle(index: number): React.CSSProperties {
    return {
        '--letter-index': index.toString(),
    } as React.CSSProperties;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll handlers
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

/**
 * Get scroll percentage of element
 */
export function getScrollPercentage(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    const start = windowHeight;
    const end = -elementHeight;
    const range = start - end;
    const current = start - rect.top;

    return Math.max(0, Math.min(1, current / range));
}

/**
 * Cubic bezier easing function generator
 */
export function cubicBezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): (t: number) => number {
    return (t: number) => {
        // Simplified cubic bezier calculation
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
        const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;

        // Binary search to find t for given x
        let t0 = 0;
        let t1 = 1;
        let t2 = t;

        for (let i = 0; i < 8; i++) {
            const x = sampleCurveX(t2) - t;
            if (Math.abs(x) < 0.001) break;
            const d = (3 * ax * t2 + 2 * bx) * t2 + cx;
            if (Math.abs(d) < 0.000001) break;
            t2 -= x / d;
        }

        return sampleCurveY(t2);
    };
}

/**
 * Predefined easing functions
 */
export const easings = {
    expressive: cubicBezier(0.34, 1.56, 0.64, 1),
    smooth: cubicBezier(0.4, 0, 0.2, 1),
    conservative: cubicBezier(0.25, 0.1, 0.25, 1),
    bounce: cubicBezier(0.68, -0.55, 0.265, 1.55),
    elastic: cubicBezier(0.68, -0.6, 0.32, 1.6),
};
