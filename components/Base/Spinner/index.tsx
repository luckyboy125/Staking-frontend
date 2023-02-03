import { useAppSelector } from "../../../store/hooks";
import { spinnerStatus } from "../../../store/spinner/selectors";
import { SpinnerCircularFixed } from "spinners-react";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
export default function Spinner() {
  const spinner = useAppSelector(spinnerStatus);

  return (
    <>
      <div className={spinner === true ? "c-loaderWrapper " : "c-displayNone"}>
        <div className={"c-spinnerRoot"}>
          <SpinnerCircularFixed
            speed={150}
            size={50}
            className='c-spinner-content'
          />
          <div className='c-spinner-loading'>
            <span className='c-spinner-load'>Loading</span>
            <div className='c-spinner-dots'>
              <div className='c-spinner-dot1'>
                <FiberManualRecordIcon fontSize='small' />
              </div>

              <div className='c-spinner-dot2'>
                <FiberManualRecordIcon fontSize='small' />
              </div>

              <div className='c-spinner-dot3'>
                <FiberManualRecordIcon fontSize='small' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
