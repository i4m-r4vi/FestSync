import { useState } from "react";
import { X } from "lucide-react";

export default function SubEventsInput({ subEvents = [], setSubEvents }) {
  const [subEventInput, setSubEventInput] = useState("");

  const handleAdd = () => {
    if (!subEventInput.trim()) return;
    if (subEvents.includes(subEventInput.trim())) return;
    setSubEvents([...subEvents, subEventInput.trim()]);
    setSubEventInput("");
  };

  const handleRemove = (index) => {
    setSubEvents(subEvents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Coding Contest, UI/UX Workshop"
          value={subEventInput}
          onChange={(e) => setSubEventInput(e.target.value)}
          className="p-3 border border-border bg-input rounded flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {subEvents.map((sub, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
          >
            <span>{sub}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
