import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export function EditableValueInput({ value, onSave }) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        const clamped = Math.max(0, parseInt(localValue) || 0);
        if (clamped !== value) {
            onSave(clamped);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    return (
        <Input
            value={localValue}
            type="number"
            min="0"
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
}