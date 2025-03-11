import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import 'dotenv/config'
import { loginPage } from './pages/login.js'
import { registerPage } from './pages/register.js'
import { homePage } from './pages/home.js'

const app = new Hono()

// ミドルウェア
app.use('*', logger())

// ルート（ホームページ）
app.get('/', (c) => {
  return c.html(homePage)
})

// ログインページ
app.get('/login', (c) => {
  return c.html(loginPage)
})

// 登録ページ
app.get('/register', (c) => {
  return c.html(registerPage)
})

// サーバーポートの設定
const PORT = 3001

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`サーバーが http://localhost:${info.port} で起動しました`)
})
