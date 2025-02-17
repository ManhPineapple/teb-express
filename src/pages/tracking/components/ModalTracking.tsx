import React from "react";

interface ModalTrackingProps {
  text: string;
  setText: (text: string) => void;
  track: () => void;
  open: boolean;
  closeTextarea: () => void;
}

const ModalTracking: React.FC<ModalTrackingProps> = ({
  text,
  setText,
  track,
  open,
  closeTextarea,
}) => {
  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="input-multi input-multi-open">
      <textarea
        id="textarea"
        value={text}
        onChange={handleChange}
        onBlur={closeTextarea}
        className="absolute border border-[#141f65] box-border rounded-lg w-[545px] h-32 pl-4 text-sm leading-6 text-[#313232]"
        placeholder="1. Please enter the tracking number, separated by enter"
      />
      <button
        onClick={track}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Track
      </button>
    </div>
  );
};

export default ModalTracking;
