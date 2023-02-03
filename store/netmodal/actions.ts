import { createAsyncThunk } from '@reduxjs/toolkit'

const showNetModal = createAsyncThunk('netmodal/show', async (status: boolean) => {
  const payload = {
    netModalShow: status,
  }
  return payload
})

export { showNetModal }
