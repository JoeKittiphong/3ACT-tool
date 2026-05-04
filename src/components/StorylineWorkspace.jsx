import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { PageHeader } from './ui/PageHeader.jsx'

export function StorylineWorkspace({ project, onBack, onChange }) {
  const storyline = project.storyline ?? ''

  return (
    <div className="reader-shell">
      <Card className="reader-card storyline-card">
        <PageHeader
          eyebrow="Storyline Draft"
          title="Storyline"
          description="เขียนเรื่องย่อคร่าวตั้งแต่ต้นจนจบก่อนค่อยแตกไปลงทีละ point"
          actions={
            <Button variant="secondary" onClick={onBack}>
              กลับไปเขียน point
            </Button>
          }
        />

        <div className="storyline-meta">
          <span>{project.title.trim() || 'Untitled Story'}</span>
          <span>{storyline.trim().length} characters</span>
        </div>

        <textarea
          className="reader-output storyline-editor"
          value={storyline}
          onChange={(event) => onChange(event.target.value)}
          placeholder="เล่าเรื่องตั้งแต่ต้นจนจบแบบคร่าว ๆ เพื่อใช้เป็นภาพรวมก่อนจะไปแตกลงในแต่ละ point"
          rows={18}
        />
      </Card>
    </div>
  )
}
