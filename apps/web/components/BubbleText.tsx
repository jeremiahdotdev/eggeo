const easterFills = ['#F472B6', '#9F7AEA', '#60A5FA', '#22D3EE', '#34D399', '#A7F3D0', '#FBBF24', '#F97316', '#EF4444'];

function hash(value: string) {
  return value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 11);
}

function colorFor(value: string) {
  return easterFills[hash(value) % easterFills.length];
}

export function BubbleLabel({
  box = '0 0 380 100',
  children,
  className,
  color,
}: {
  box?: string;
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const text = String(children ?? '');

  return (
    <svg className={`bubble-svg ${className ?? ''}`} preserveAspectRatio="xMidYMid meet" viewBox={box}>
      <text className="bubble-text" dominantBaseline="middle" fill={color ?? colorFor(text)} textAnchor="middle" x="50%" y="51%">
        {children}
      </text>
    </svg>
  );
}

export function BubbleDigits({ label }: { label: string }) {
  return (
    <div className="bubble-digits" aria-label={label}>
      {label
        .toUpperCase()
        .split(' ')
        .map((word) => (
          <span className="bubble-word" key={word}>
            {word.split('').map((digit, index) => {
              const isSmall = digit === 'I';
              return (
                <BubbleLabel
                  box={isSmall ? '0 -10 25 60' : '0 -10 50 60'}
                  className={isSmall ? 'bubble-letter bubble-letter-small' : 'bubble-letter'}
                  key={`${digit}-${index}`}
                >
                  {digit}
                </BubbleLabel>
              );
            })}
          </span>
        ))}
    </div>
  );
}
