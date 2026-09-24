import { useState } from "react";
import { X } from "lucide-react";

import Button from "./Button";

function CollectionModal({
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter a collection name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onCreate({
        name: name.trim(),
        description: description.trim(),
      });
    } catch (error) {
      console.error(error);

      setError(
        "Unable to create the collection. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

        <div className="flex items-start justify-between">

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-red-500">
              New Collection
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Create a collection
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create a personal library for movies
              you want to keep together.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          <div>
            <label
              htmlFor="collection-name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Collection name
            </label>

            <input
              id="collection-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Favourite Movies"
              maxLength={80}
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-white
                placeholder-gray-600
                outline-none
                transition
                focus:border-red-600
                focus:ring-1
                focus:ring-red-600
              "
            />
          </div>

          <div>
            <label
              htmlFor="collection-description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Description
              <span className="ml-2 text-xs text-gray-600">
                Optional
              </span>
            </label>

            <textarea
              id="collection-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What is this collection for?"
              maxLength={250}
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-white
                placeholder-gray-600
                outline-none
                transition
                focus:border-red-600
                focus:ring-1
                focus:ring-red-600
              "
            />

            <p className="mt-2 text-right text-xs text-gray-600">
              {description.length}/250
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-6">

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Collection"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CollectionModal;