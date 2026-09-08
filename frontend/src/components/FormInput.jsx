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
  const actualType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-paper-surface/60 px-4 py-3 shadow-sm transition dark:bg-ink-surface/60 ${
          error
            ? "border-red-500/80"
            : "border-paper-border dark:border-ink-border"
        } focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/40`}
      >
        {Icon && <Icon className="shrink-0 text-lg text-paper-sub dark:text-ink-sub" />}

        <input
          type={actualType}
          aria-label={props["aria-label"] || props.placeholder}
          {...props}
          className="w-full border-0 bg-transparent p-0 text-sm text-paper-text outline-none placeholder:text-paper-sub focus:outline-none focus:ring-0 dark:text-ink-text dark:placeholder:text-ink-sub"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="shrink-0 text-paper-sub transition hover:text-gold dark:text-ink-sub"
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
