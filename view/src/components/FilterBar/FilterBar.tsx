import './FilterBar.css'
import { useState } from 'react';


interface MyFilterBarProps {
    min: number;
    max: number;
    onChange: (value: number) => void;
}

function FilterBar({ min, max, onChange }: MyFilterBarProps) {
    const [value, setValue] = useState(min);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <div className="slider-container">
            <span className="slider-label">{min}</span>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleSliderChange}
                className="slider"
            />
            <span className="slider-label">{max}</span>
            <div className="slider-value">{value}</div>
        </div>
    );
}

export default FilterBar
