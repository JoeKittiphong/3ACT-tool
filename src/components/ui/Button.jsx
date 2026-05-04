export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = ['ui-button', `${variant}-button`]

  if (size === 'sm') classes.push('ui-button-sm')
  if (size === 'icon') classes.push('ui-button-icon')
  if (className) classes.push(className)

  return <button type={type} className={classes.join(' ')} {...props} />
}
