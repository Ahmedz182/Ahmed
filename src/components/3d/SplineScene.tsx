"use client";

import { Suspense } from "react";
import Spline from "@splinetool/react-spline";

interface SplineSceneProps {
    scene: string;
    className?: string;
}

export function SplineScene({ scene, className = "" }: SplineSceneProps) {
    return (
        <div
            className={`relative overflow-hidden ${className}`}
            /* Extend the inner canvas downward so the bottom watermark is clipped */
            style={{ isolation: "isolate" }}
        >
            {/* Pull the Spline canvas down so its bottom 60px (where badge lives) scrolls out */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    bottom: "-60px",
                    pointerEvents: "none",
                }}
            >
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-2 border-accent-mint/30 border-t-accent-mint animate-spin" />
                    </div>
                }>
                    <Spline
                        scene={scene}
                        style={{ width: "100%", height: "calc(100% + 60px)" }}
                    />
                </Suspense>
            </div>

            {/* Hard cover over Spline branding (bottom-right corner) */}
            <div
                className="absolute bottom-0 right-0 z-50 pointer-events-none"
                style={{
                    width: "200px",
                    height: "52px",
                    background: "linear-gradient(to left, #071E2F 40%, transparent 100%)",
                }}
            />
            {/* Also cover left edge of badge if it extends left */}
            <div
                className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
                style={{
                    height: "4px",
                    background: "#071E2F",
                }}
            />
        </div>
    );
}
