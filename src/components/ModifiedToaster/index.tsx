"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ModifiedToaster = () => {
  const { theme } = useTheme();
  return (
    <div>
      <Toaster invert={theme == "dark"} />
    </div>
  );
};

export default ModifiedToaster;
