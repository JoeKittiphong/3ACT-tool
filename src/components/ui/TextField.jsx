export function TextField({ label, className = '', ...props }) {
  return (
    <label className={className}>
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}
