import { ProfileMenu } from "@/components/profile/ProfileMenu";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="font-semibold">DateGen</div>
        <ProfileMenu />
      </div>
    </header>
  );
};