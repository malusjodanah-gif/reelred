import { Heart, Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0b0b0b]">

      <div className="mx-auto max-w-7xl px-6 py-12 text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10">
          <Sparkles
            size={22}
            className="text-red-500"
          />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          Made for your next movie night.
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-gray-500">
          Happy Birthday, Bub! 🎂
          <br />
          Here's to another year of great stories,
          unforgettable moments, and movies worth watching.
        </p>

        <div className="mx-auto mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          Made with
          <Heart
            size={13}
            className="fill-red-600 text-red-600"
          />
          just for you
        </div>

      </div>

    </footer>
  );
}

export default Footer;