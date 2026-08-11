'use client';

export function PrintButton() {
  return (
    <button className="button secondary no-print" onClick={() => window.print()} type="button">
      Print
    </button>
  );
}
