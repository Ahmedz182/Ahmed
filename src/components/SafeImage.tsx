"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { clsx } from "clsx";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
    containerClassName?: string;
}

export const SafeImage = ({
    src,
    alt,
    className,
    fallbackSrc = "/logo.png",
    containerClassName,
    ...props
}: SafeImageProps) => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isFallback = error || !src;
    // Check if it's a typical external link that might benefit from standard img loading
    const isDriveOrExternal = typeof src === 'string' && (src.includes('drive.google.com') || src.includes('uc?id='));

    return (
        <div className={clsx(
            "relative overflow-hidden bg-white/[0.03] flex items-center justify-center w-full h-full",
            containerClassName
        )}>
            {/* Background Logo Shadow (Visible while loading or if it fails) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src={fallbackSrc} alt="Logo BG" className="w-1/4 object-contain grayscale" />
            </div>

            {(props.unoptimized || isDriveOrExternal) ? (
                // Use standard img for high compatibility with external links in frontend
                <img
                    src={(isFallback ? fallbackSrc : src) as string}
                    alt={alt}
                    className={clsx(
                        "transition-all duration-700 w-full h-full",
                        isFallback ? "w-1/3 h-1/3 object-contain opacity-10 grayscale brightness-200" : "object-cover",
                        isLoading ? "opacity-0 scale-105 blur-lg" : "opacity-100 scale-100 blur-0",
                        className
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setError(true);
                        setIsLoading(false);
                    }}
                />
            ) : (
                <Image
                    src={isFallback ? fallbackSrc : src}
                    alt={alt}
                    className={clsx(
                        "transition-all duration-700",
                        isFallback ? "w-1/3 h-1/3 object-contain opacity-10 grayscale brightness-200" : "w-full h-full object-cover",
                        isLoading ? "opacity-0 scale-105 blur-lg" : "opacity-100 scale-100 blur-0",
                        className
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setError(true);
                        setIsLoading(false);
                    }}
                    {...props}
                />
            )}
        </div>
    );
};
