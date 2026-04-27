import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export function EditableTextInput({ value, onSave, placeholder = "Enter value" }) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        if (localValue !== value) {
            onSave(localValue);
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
            type="text"
            placeholder={placeholder}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
}