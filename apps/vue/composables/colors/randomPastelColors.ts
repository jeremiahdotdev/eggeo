const pastelColorsHex = [
  '#F472B6', // Pink 400
  '#9F7AEA', // Purple 400
  '#60A5FA', // Blue 400
  '#22D3EE', // Cyan 400
  '#34D399', // Green 400
  '#A7F3D0', // Lime 400
  '#FBBF24', // Yellow 400
  '#F97316', // Orange 400
  '#EF4444', // Red 400
];
const pastelTextColors = [
  'text-pink-400',
  'text-purple-400',
  'text-blue-400',
  'text-cyan-400',
  'text-green-400',
  'text-lime-400',
  'text-yellow-400',
  'text-orange-400',
  'text-red-400',
];
const pastelTextHoverColors = [
  'hover:text-pink-600',
  'hover:text-purple-600',
  'hover:text-blue-600',
  'hover:text-cyan-600',
  'hover:text-green-600',
  'hover:text-lime-600',
  'hover:text-yellow-600',
  'hover:text-orange-600',
  'hover:text-red-600',
];
const pastelFillHoverColors = [
  'hover:fill-pink-600',
  'hover:fill-purple-600',
  'hover:fill-blue-600',
  'hover:fill-cyan-600',
  'hover:fill-green-600',
  'hover:fill-lime-600',
  'hover:fill-yellow-600',
  'hover:fill-orange-600',
  'hover:fill-red-600',
];
const pastelFillColors = [
  'fill-pink-500',
  'fill-purple-500',
  'fill-blue-500',
  'fill-cyan-500',
  'fill-green-500',
  'fill-lime-500',
  'fill-yellow-500',
  'fill-orange-500',
  'fill-red-500',
];
const pastelBackgroundColors = [
  'bg-pink-400',
  'bg-purple-400',
  'bg-blue-400',
  'bg-cyan-400',
  'bg-green-400',
  'bg-lime-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-red-400',
];

export const randomTailwindTextColor = () => pastelTextColors[Math.floor(Math.random() * pastelTextColors.length)];

export const randomTailwindTextHoverColor = () =>
  pastelTextHoverColors[Math.floor(Math.random() * pastelTextHoverColors.length)];

export const randomTailwindFillHoverColor = () =>
  pastelFillHoverColors[Math.floor(Math.random() * pastelFillHoverColors.length)];

export const randomTailwindFillColor = () => pastelFillColors[Math.floor(Math.random() * pastelFillColors.length)];

export const randomTailwindBackgroundColor = () =>
  pastelBackgroundColors[Math.floor(Math.random() * pastelBackgroundColors.length)];

export const randomHexColor = () => pastelColorsHex[Math.floor(Math.random() * pastelColorsHex.length)];
