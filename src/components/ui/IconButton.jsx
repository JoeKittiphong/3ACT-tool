import { Button } from './Button.jsx'

export function IconButton({ label, title, children, className = '', ...props }) {
  return (
    <Button
      size="icon"
      className={className}
      aria-label={label}
      title={title ?? label}
      {...props}
    >
      {children}
    </Button>
  )
}
