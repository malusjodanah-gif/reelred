import {
  ArrowRight,
  Film,
  Library,
} from "lucide-react";

function CollectionCard({
  collection,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c1c1c] to-[#131313] p-6 transition duration-300 hover:-translate-y-1 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-950/20">

        {/* Decorative background */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-600/5 blur-2xl transition group-hover:bg-red-600/10" />

        <div className="relative">

          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
            <Library size={23} />
          </div>

          {/* Name */}
          <h2 className="mt-6 truncate text-xl font-semibold text-white">
            {collection.name}
          </h2>

          {/* Description */}
          <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-400">
            {collection.description ||
              "A personal collection of movies."}
          </p>

          {/* Bottom information */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Film size={16} />

              <span>
                {collection.movieCount || 0}{" "}
                {collection.movieCount === 1
                  ? "movie"
                  : "movies"}
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 transition group-hover:bg-red-600 group-hover:text-white">
              <ArrowRight size={17} />
            </div>

          </div>

        </div>
      </div>
    </button>
  );
}

export default CollectionCard;