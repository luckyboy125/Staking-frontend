import React from "react";
import { dateConvert } from "../../../common/utils";
import { useAppSelector } from "../../../store/hooks";
import {
  currentRound,
  roundDuration,
  roundStart,
  totalRounds,
} from "../../../store/initstakinginfo/selectors";

const CurrentRound = () => {
  const curRound = useAppSelector(currentRound);
  const roundStartTime = useAppSelector(roundStart);
  const roundDur = useAppSelector(roundDuration);
  const roundNum = useAppSelector(totalRounds);

  return (
    <div className='animate__animated animate__zoomIn animate__repeat-3 c-currentround-roundroot'>
      <div className='c-currentround-roundtitle'>
        Current round: &nbsp;{curRound} / {roundNum}
      </div>
      <div className='c-currentround-rounddescript'>
        {roundStartTime !== 0 ? (
          <>
            <div className='c-currentround-roundstatus'>
              <span className='c-currentround-roundstatustitle'>Start:</span>{" "}
              &nbsp;
              {dateConvert(roundStartTime)}
            </div>
            <div className='c-currentround-roundstatus'>
              <span className='c-currentround-roundstatustitle'>End:</span>{" "}
              &nbsp; {dateConvert(roundStartTime + roundDur)}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default CurrentRound;
