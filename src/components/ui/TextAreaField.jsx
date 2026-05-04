export function TextAreaField({ label, className = '', ...props }) {
  return (
    <label className={className}>
      <span>{label}</span>
      <textarea {...props} />
    </label>
  )
}
