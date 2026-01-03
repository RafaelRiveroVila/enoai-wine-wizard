import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton = ({ onClick }: ProfileButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="fixed top-4 right-4 z-50 rounded-full w-12 h-12 bg-card border-border shadow-md hover:shadow-lg transition-shadow"
    >
      <User className="w-5 h-5 text-primary" />
    </Button>
  );
};

export default ProfileButton;
