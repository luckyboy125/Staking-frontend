import { createAsyncThunk } from '@reduxjs/toolkit'

const showAlert = createAsyncThunk('alert/show', async (msg: any) => {
  const payload = {
    message: msg.message,
    severity: msg.severity,
    link: msg.link,
  }
  return payload
})

export { showAlert }
