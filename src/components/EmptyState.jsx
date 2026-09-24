import { Film } from "lucide-react";
import Button from "./Button";

function EmptyState({
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
        <Film className="text-red-500" size={30} />
      </div>

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
        {description}
      </p>

      {buttonText && (
        <Button
          onClick={onButtonClick}
          className="mt-6"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;