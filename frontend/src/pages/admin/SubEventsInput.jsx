import { useState } from "react";


export default function SubEventsInput({ subEvents = [], setSubEvents }) {
  const [subEventInput, setSubEventInput] = useState("");

  const handleAdd = () => {
    if (!subEventInput.trim()) return;
    if (subEvents.includes(subEventInput.trim())) return; // 🚫 prevent duplicates
    setSubEvents([...subEvents, subEventInput.trim()]);
    setSubEventInput("");
  };

  const handleRemove = (index) => {
    setSubEvents(subEvents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* Input + Add Button */}
      <div className="flex gap-2 items-center justify-center">
        <input
          type="text"
          placeholder="Add SubEvent"
          value={subEventInput}
          onChange={(e) => setSubEventInput(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* Display SubEvents List */}
      <div className="flex flex-wrap gap-2">
        {subEvents.map((sub, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded"
          >
            <span>{sub}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-500 font-bold"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
