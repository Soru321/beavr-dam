import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

import { Button } from "../button";
import { Input } from "../input";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [type, setType] = useState<"password" | "text">("password");

    return (
      <div className="relative">
        <Input type={type} ref={ref} {...props} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            setType((state) => (state === "password" ? "text" : "password"))
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
        >
          {type === "password" ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
