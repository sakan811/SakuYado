/*
 * SakuYado - A web application that helps you find the best value accommodations
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const Mermaid = ({ chart }: { chart: string }) => {
    const [svgCode, setSvgCode] = useState("");
    // generate a stable short id
    const [id] = useState(() => `mermaid-${Math.floor(Math.random() * 1000000)}`);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
                primaryColor: "#fdf2f8", // pink-50
                primaryBorderColor: "#fbcfe8", // pink-200
                primaryTextColor: "#831843", // pink-900
                lineColor: "#f472b6", // pink-400
                fontFamily: "inherit",
            },
        });

        const renderChart = async () => {
            try {
                const { svg } = await mermaid.render(id, chart);
                setSvgCode(svg);
            } catch (e) {
                console.error("Mermaid rendering error", e);
            }
        };

        renderChart();
    }, [chart, id]);

    if (!svgCode) {
        return <div className="h-32 flex items-center justify-center text-pink-500 animate-pulse">Rendering Diagram...</div>;
    }

    return (
        <div className="relative w-full border border-pink-100 rounded-xl bg-white overflow-hidden group">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => zoomIn()}
                                className="bg-white/90 backdrop-blur-sm border border-pink-200 text-pink-700 w-8 h-8 rounded-full shadow-sm flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all font-medium text-lg"
                                title="Zoom In"
                                aria-label="Zoom In"
                            >
                                +
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className="bg-white/90 backdrop-blur-sm border border-pink-200 text-pink-700 w-8 h-8 rounded-full shadow-sm flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all font-medium text-lg leading-none"
                                title="Zoom Out"
                                aria-label="Zoom Out"
                            >
                                −
                            </button>
                            <button
                                onClick={() => resetTransform()}
                                className="bg-white/90 backdrop-blur-sm border border-pink-200 text-pink-700 w-8 h-8 rounded-full shadow-sm flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all text-sm font-medium"
                                title="Reset Zoom"
                                aria-label="Reset Zoom"
                            >
                                ↺
                            </button>
                        </div>
                        <div className="w-full h-full cursor-grab active:cursor-grabbing">
                            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                <div
                                    className="flex justify-center py-10 w-full min-h-[300px]"
                                    dangerouslySetInnerHTML={{ __html: svgCode }}
                                />
                            </TransformComponent>
                        </div>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};
