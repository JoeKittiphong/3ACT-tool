export function Badge({ tone = 'default', className = '', as: Tag = 'span', ...props }) {
  const classes = ['ui-badge']

  if (tone === 'blue') classes.push('chip')
  else if (tone === 'green') classes.push('editor-badge', 'light')
  else if (tone === 'yellow') classes.push('progress-pill')
  else classes.push('editor-badge')

  if (className) classes.push(className)

  return <Tag className={classes.join(' ')} {...props} />
}
