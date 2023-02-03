import { createAsyncThunk } from '@reduxjs/toolkit'

const showSpinner = createAsyncThunk('spinner/show', async (msg: any) => {
  const payload = {
    spinnerShow: msg,
  }
  return payload
})

export { showSpinner }
