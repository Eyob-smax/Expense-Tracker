import { useSelector } from "react-redux";
import type { TRootState } from "../app/store";

export const ProfileIcon = {
  label: "Profile",
  path: "/profile",
  element: <ProfileImage />,
};

export default function ProfileImage() {
  const user = useSelector((state: TRootState) => state.auth.user);
  return (
    <div className="flex  items-center w-10 h-10 space-x-2 rounded-full bg-[#F0F2F5] text-[#61758A] ">
      {
        <img
          src={user?.profilePicture || "/homePageBg.png"}
          alt="homePageBg.png"
          className="rounded-full size-full"
        />
      }
    </div>
  );
}
