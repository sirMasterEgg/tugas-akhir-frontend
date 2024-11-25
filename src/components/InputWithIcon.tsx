import {
  forwardRef,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactElement;
}

const InputWithIcon = forwardRef<
  HTMLInputElement,
  PropsWithChildren<InputWithIconProps>
>(({ icon, ...props }, ref) => {
  return (
    <label className="input rounded-full input-bordered flex items-center gap-2">
      <input ref={ref} {...props} />
      {icon}
    </label>
  );
});
export default InputWithIcon;
