const easterLetters = ['#F472B6', '#9F7AEA', '#60A5FA', '#22D3EE', '#34D399', '#A7F3D0', '#FBBF24', '#F97316', '#EF4444'];

export function ColorText({ children }: { children: string }) {
  return (
    <span className="color-text" aria-label={children}>
      {children.split('').map((letter, index) => (
        <span aria-hidden="true" key={`${letter}-${index}`} style={{ color: easterLetters[index % easterLetters.length] }}>
          {letter}
        </span>
      ))}
    </span>
  );
}
