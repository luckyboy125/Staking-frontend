import React from "react";
import { dateConvert } from "../../../common/utils";
import { useAppSelector } from "../../../store/hooks";
import {
  currentRound,
  roundDuration,
  stakingStart,
  totalRounds,
} from "../../../store/initstakinginfo/selectors";

const StakingInfo = () => {
  const stakingStartTime = useAppSelector(stakingStart);
  const totalRoundsCount = useAppSelector(totalRounds);
  const oneRoundDuration = useAppSelector(roundDuration);
  const curRound = useAppSelector(currentRound);
  const stakingEndTime =
    Math.floor(Date.now() / 1000) +
    (totalRoundsCount - curRound + 1) * oneRoundDuration;

  return (
    <div className='c-stakinginfo-stakingdate'>
      {stakingStartTime !== 0 ? (
        <>
          <div className='c-currentround-roundstatus'>
            <span className='c-stakinginfo-stakingstatustitle'>
              Staking start:
            </span>
            &nbsp; {dateConvert(stakingStartTime)}
          </div>
          <div className='c-currentround-roundstatus'>
            <span className='c-stakinginfo-stakingstatustitle'>
              Staking end:
            </span>
            &nbsp; {dateConvert(stakingEndTime)}
          </div>
        </>
      ) : (
        <div className='c-stakinginfo-nostartdes'>
          Staking has not started yet !
        </div>
      )}
    </div>
  );
};
export default StakingInfo;
