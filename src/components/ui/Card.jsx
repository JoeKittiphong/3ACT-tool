export function Card({ as: Tag = 'div', className = '', ...props }) {
  const classes = ['ui-card']
  if (className) classes.push(className)

  return <Tag className={classes.join(' ')} {...props} />
}
