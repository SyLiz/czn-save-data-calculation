'use client';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  large?: boolean;
  className?: string;
}

export default function NumberInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 999, 
  large = false,
  className = ''
}: NumberInputProps) {
  
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  return (
    <div className={`quantity ${large ? 'large' : ''} ${className}`}>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
      />
      <div className="quantity-nav">
        <button 
          type="button"
          className="quantity-button quantity-up"
          onClick={handleIncrement}
        >
          ▲
        </button>
        <button 
          type="button"
          className="quantity-button quantity-down"
          onClick={handleDecrement}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

