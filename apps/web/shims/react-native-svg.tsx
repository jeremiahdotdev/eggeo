'use client';

import * as React from 'react';

type SvgProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

function SvgElement({ children, ...props }: SvgProps) {
  return <span {...props}>{children}</span>;
}

export const Svg = SvgElement;
export const Circle = SvgElement;
export const ClipPath = SvgElement;
export const Defs = SvgElement;
export const Ellipse = SvgElement;
export const G = SvgElement;
export const Image = SvgElement;
export const Line = SvgElement;
export const LinearGradient = SvgElement;
export const Mask = SvgElement;
export const Path = SvgElement;
export const Pattern = SvgElement;
export const Polygon = SvgElement;
export const Polyline = SvgElement;
export const RadialGradient = SvgElement;
export const Rect = SvgElement;
export const Stop = SvgElement;
export const Text = SvgElement;
export const TSpan = SvgElement;
export const TextPath = SvgElement;
export const Use = SvgElement;

export default SvgElement;
