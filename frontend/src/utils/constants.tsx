import { useSelector } from "react-redux";
import type { TRootState } from "../app/store";
import { User } from "lucide-react";

export const ProfileIcon = {
  label: "Profile",
  path: "/profile",
  element: <ProfileImage />,
};

export default function ProfileImage() {
  const user = useSelector((state: TRootState) => state.auth.user);
  return (
    <div className="flex mx-auto items-center w-10 h-10 space-x-2 rounded-full bg-[#F0F2F5] text-[#61758A] ">
      {user && user.profilePicture ? (
        <img
          src={user?.profilePicture || "/homePageBg.png"}
          alt="homePageBg.png"
          className="rounded-full size-full"
        />
      ) : (
        <User className="w-6 h-6 mx-auto" />
      )}
    </div>
  );
}
