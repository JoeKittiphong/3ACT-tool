import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'

export function StorylineWorkspace({ project, onBack, onChange }) {
  const storyline = project.storyline ?? ''

  return (
    <>
      <div className="reader-shell mobile-action-shell storyline-shell">
        <Card className="reader-card storyline-card">
          <div className="storyline-header">
            <h1>Storyline</h1>
          </div>

          <textarea
            className="reader-output storyline-editor"
            value={storyline}
            onChange={(event) => onChange(event.target.value)}
            placeholder="เล่าเรื่องย่อตั้งแต่ต้นจนจบแบบคร่าว ๆ เพื่อใช้เป็นภาพรวมก่อนจะแตกลงในแต่ละ point"
            rows={18}
          />
        </Card>
      </div>

      <div className="mobile-bottom-bar mobile-action-bar storyline-bottom-bar">
        <div className="mobile-bottom-actions storyline-bottom-actions">
          <Button variant="secondary" className="mobile-bottom-button" onClick={onBack}>
            กลับไปเขียน point
          </Button>
        </div>
      </div>
    </>
  )
}
