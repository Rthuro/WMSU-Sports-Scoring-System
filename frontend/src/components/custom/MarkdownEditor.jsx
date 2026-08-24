import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

export function MarkdownEditor({ value, onChange, height = 450 }) {
  const [localValue, setLocalValue] = useState(
    `# Markdown Editor\n\nStart writing your content here using **bold**, *italic*, ~~strikethrough~~, and more.\n\n- Unordered list item\n- Another item\n\n1. Ordered list item\n2. Another item\n\n> Blockquote example\n\n[Link example](https://example.com)\n\n\`\`\`js\nconsole.log('Code block');\n\`\`\``
  );

  // Support both controlled (value/onChange props) and uncontrolled usage
  const mdValue = value !== undefined ? value : localValue;
  const handleChange = (val) => {
    if (onChange) {
      onChange(val);
    } else {
      setLocalValue(val);
    }
  };

  return (
    <div data-color-mode="light">
      <MDEditor
        value={mdValue}
        onChange={handleChange}
        height={height}
        preview="live"
        visibleDragbar={true}
      />
    </div>
  );
}

export default MarkdownEditor;
