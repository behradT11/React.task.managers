import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // در اینجا نام ریپازیتوری خود را وارد کنید
  base: '/React.task.managers/', 
  plugins: [react()],
})
