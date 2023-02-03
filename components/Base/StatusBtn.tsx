import clsx from "clsx";
import { buttontype } from "../../common/constant";

interface StatusBtnProps {
  color: string;
  children?: React.ReactNode;
  className?: any;
  disable?: boolean;
  statusClick?: () => void;
}

const StatusBtn = ({
  children,
  className,
  color,
  disable,
  statusClick,
}: StatusBtnProps) => {
  const disableClick = () => {

  }
  return (
    <>
      <div
        className={clsx("c-statusbtn-root", className, {
          ["blue"]: color === buttontype.blue,
          ["lightblue"]: color === buttontype.lightblue,
          ["orange"]: color === buttontype.orange,
          ["purple"]: color === buttontype.purple,
          ["violet"]: color === buttontype.violet,
          ["disable"]: disable,
        })}
        onClick={disable ?disableClick: statusClick}
      >
        {children}
      </div>
    </>
  );
};

export default StatusBtn;
