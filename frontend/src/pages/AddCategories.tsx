import { useFetcher, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ProfileIcon } from "../utils/constants";
import { useEffect, useState } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import LoadingScreen from "./LoadingScreen";
import Swal from "sweetalert2";

export default function AddCategories() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [selectedEmoji, setSelectedEmoji] = useState(""); // Track selected emoji
  const [showPicker, setShowPicker] = useState(false);
  const [navigationError, setNavigationError] = useState<string | boolean>(
    false
  );
  const [navigationLoading, setNavigationLoading] = useState(false);

  async function backToCategories() {
    setNavigationLoading(true);
    try {
      await navigate("/categories");
    } catch (err) {
      setNavigationError((err as { message: string }).message);
    } finally {
      setNavigationLoading(false);
    }
  }

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      Swal.fire({
        icon: "success",
        title: "Successfully added",
        text: `The category has been added successfully`,
      });
      navigate("/categories");
    }
  }, [fetcher.data, navigate]);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  if (navigationLoading) {
    return <LoadingScreen />;
  }

  if (navigationError && typeof navigationError === "string") {
    Swal.fire({
      icon: "error",
      title: "Error submitting an expense",
      text: navigationError,
    });
  }

  return (
    <div>
      <Header
        title="Expense Tracker"
        linksOption={[
          { label: "Home", path: "/" },
          { label: "Expenses", path: "/expenses" },
          { label: "Settings", path: "/settings" },
          { label: "Analytics", path: "/analytics" },
          { label: "Categories", path: "/categories" },
          ProfileIcon,
        ]}
      />
      <div className="w-[80%] mx-auto mt-10 space-y-5">
        <h1 className="text-2xl mb-8 font-bold">New Category</h1>

        <fetcher.Form method="post" className="flex flex-col space-y-5">
          <div className="flex md:w-1/2 flex-col space-y-2">
            <label className="text-sm font-semibold" htmlFor="category-name">
              Category Name
            </label>
            <Input
              type="text"
              name="category_name"
              id="category-name"
              placeholder="Food & Drinks"
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
          </div>
          <div className="flex md:w-1/2 flex-col space-y-2">
            <label className="text-sm font-semibold" htmlFor="relevance">
              Relevance
            </label>
            <select
              name="relevance"
              id="relevance"
              defaultValue={"Medium"}
              className="text-sm border-1 border-stone-800 p-2 rounded-md"
            >
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex md:w-1/2 flex-col space-y-2">
            <label className="text-sm font-semibold" htmlFor="icon-select">
              Icon
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="bg-stone-800 text-white rounded-md px-4 py-2"
              >
                {showPicker ? "Close emoji" : "Open Emoji"}
              </Button>
              <span className="text-2xl" aria-label="Selected emoji preview">
                {selectedEmoji || ""}
              </span>
            </div>
            {showPicker && (
              <div className="flex flex-col  z-50 md:absolute md:top-[15%] md:right-[10%] lg:right-[17%]">
                <>
                  <EmojiPicker
                    lazyLoadEmojis={true}
                    onEmojiClick={handleEmojiSelect}
                    width={300}
                    height={400}
                    className="text-sm"
                  />
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      onClick={() => setShowPicker(false)}
                      className="bg-stone-800 text-white rounded-md px-4 mt-3 "
                    >
                      Close
                    </Button>
                  </div>
                </>
              </div>
            )}
            <input type="hidden" name="icon_name" value={selectedEmoji} />
          </div>

          <div className="flex justify-start gap-x-4 mt-8">
            <Button
              type="button"
              onClick={backToCategories}
              className="bg-[#EBF2EB] text-stone-800 cursor-pointer font-semibold"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 cursor-pointer text-white"
              disabled={fetcher.state !== "idle"}
            >
              {fetcher.state === "submitting" || fetcher.state === "loading"
                ? "Creating..."
                : "Create"}
            </Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
