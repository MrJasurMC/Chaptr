import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
const FormInput = ({
  icon: Icon,
  error,
  type,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? visible ? "text" : "password" : type;
  return <div className="mb-4">
      <div className="flex items-center gap-3 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 shadow-sm transition focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/40">
        {Icon && <Icon className="text-paper-sub dark:text-ink-sub text-lg shrink-0" />}
        <input type={actualType} aria-label={props["aria-label"] || props.placeholder} {...props} className="bg-transparent outline-none w-full text-sm placeholder:text-paper-sub dark:placeholder:text-ink-sub" />
        {isPassword && <button type="button" onClick={() => setVisible(v => !v)} className="text-paper-sub dark:text-ink-sub hover:text-gold transition shrink-0" aria-label={visible ? "Hide password" : "Show password"} tabIndex={-1}>
            {visible ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>;
};
export default FormInput;
