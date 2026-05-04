import { useState } from 'react'
import { authText } from '../constants/authText'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { PageHeader } from './ui/PageHeader.jsx'
import { TextField } from './ui/TextField.jsx'

export function AuthScreen({ onSubmit, onResetPassword, loading, errorMessage, infoMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isSubmitDisabled = loading || !email.trim() || !password.trim()
  const isResetDisabled = loading || !email.trim()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitDisabled) return
    await onSubmit(email.trim(), password)
  }

  return (
    <div className="reader-shell">
      <Card className="panel-card auth-card">
        <PageHeader
          eyebrow="Supabase Sync"
          title={authText.title}
          description={authText.description}
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
            placeholder={authText.passwordPlaceholder}
          />
          {infoMessage ? <p className="auth-message">{infoMessage}</p> : null}
          {errorMessage ? <p className="auth-message error">{errorMessage}</p> : null}
          <div className="auth-actions">
            <Button
              className="auth-action-button"
              variant="primary"
              type="submit"
              disabled={isSubmitDisabled}
            >
              {loading ? authText.submitLoadingLabel : authText.submitLabel}
            </Button>
            <Button
              className="auth-action-button"
              variant="secondary"
              type="button"
              onClick={() => onResetPassword(email.trim())}
              disabled={isResetDisabled}
            >
              {authText.resetPasswordLabel}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
