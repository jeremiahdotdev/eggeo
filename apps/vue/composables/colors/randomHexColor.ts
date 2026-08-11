// Function to generate a random hex color
export function randomColor() {
  return 100 + Math.floor(Math.random() * 156);
}

// Function to generate a random hex color
export function randomHexColor(seed?: string) {
  const r = randomColor();
  const g = randomColor();
  const b = randomColor();

  // Convert the RGB values to hexadecimal and concatenate them
  const hexColor = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  return hexColor;
}

// Helper function to convert a number to hexadecimal
function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}
