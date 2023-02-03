import { createAsyncThunk } from '@reduxjs/toolkit'

const setRefreshStatus = createAsyncThunk('refresh/set', async (msg: any) => {
  const payload = {
    refreshStatus: msg,
  }
  return payload
})

export { setRefreshStatus }
