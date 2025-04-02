import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaApple, FaGithub } from "react-icons/fa";
import { toast } from "sonner";

const AuthOption = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => {
          window.location.href =
            process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/user/google";
        }}
      >
        <FcGoogle />
        Google
      </Button>
      <Button
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => {
          window.location.href = "/api/auth/user/github";
        }}
      >
        <FaGithub />
        Github
      </Button>
      <Button
        className="flex gap-2 items-center cursor-pointer"
        onClick={() =>
          toast(
            "Login menggunakan apple sedang dalam pengembangan.\nAkan segera hadir!"
          )
        }
      >
        <FaApple />
        Apple
      </Button>
    </div>
  );
};

export default AuthOption;
