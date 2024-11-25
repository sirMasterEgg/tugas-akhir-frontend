import { PropsWithChildren, ReactElement } from "react";

type TooltipProps = {
  tooltipMessage: string | undefined;
  displayTooltip?: boolean;
};

const Tooltip = ({
  children,
  displayTooltip,
  tooltipMessage,
}: PropsWithChildren<TooltipProps>): ReactElement => {
  return displayTooltip ? (
    <div
      className={`tooltip tooltip-right tooltip-error tooltip-open`}
      data-tip={tooltipMessage}
    >
      {children}
    </div>
  ) : (
    <>{children}</>
  );
};
export default Tooltip;
