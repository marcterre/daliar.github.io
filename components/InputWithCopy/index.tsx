import React from "react";
import { Copy } from "lucide-react";

interface InputWithCopyProps {
  value: string;
  onChange: (value: string) => void;
}

const InputWithCopy: React.FC<InputWithCopyProps> = ({ value, onChange }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy value:", err);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-20 h-8 px-2 py-1 text-xs border border-gray-300 rounded-s-sm bg-white text-gray-900`}
      />
      <button
        onClick={copyToClipboard}
        className="h-8 px-2 py-1 text-xs bg-gray-600 text-white rounded-e-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
        title="Copy value"
      >
        <Copy size={12} />
      </button>
    </div>
  );
};

export default InputWithCopy;
