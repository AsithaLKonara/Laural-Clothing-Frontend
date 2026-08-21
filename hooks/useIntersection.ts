import { useEffect, useRef, useState, MutableRefObject } from 'react';

export function useIntersection<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [MutableRefObject<T | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options?.root, options?.rootMargin, options?.threshold]);

  return [ref, isIntersecting];
}
