import { useState } from 'react'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { PageHeader } from './ui/PageHeader.jsx'
import { TextField } from './ui/TextField.jsx'

export function AuthScreen({ onSubmit, loading, errorMessage, infoMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) return
    await onSubmit(email.trim(), password)
  }

  return (
    <div className="reader-shell">
      <Card className="reader-card auth-card">
        <PageHeader
          eyebrow="Supabase Sync"
          title="เข้าสู่ระบบเพื่อซิงก์"
          description="ใช้ email เดียวกันบนมือถือและ desktop เพื่อเขียนต่อข้ามอุปกรณ์"
        />

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)"
          />
          {infoMessage ? <p className="auth-message">{infoMessage}</p> : null}
          {errorMessage ? <p className="auth-message error">{errorMessage}</p> : null}
          <Button variant="primary" type="submit" disabled={loading || !email.trim() || !password.trim()}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ / สมัครสมาชิก'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
