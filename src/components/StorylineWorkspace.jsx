import { useBottomBarHeight } from '../hooks/useBottomBarHeight.js'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'

export function StorylineWorkspace({ project, onBack, onChange }) {
  const storyline = project.storyline ?? ''
  const barRef = useBottomBarHeight()

  return (
    <>
      <div className="reader-shell">
        <Card className="reader-card storyline-card">
          <div className="storyline-header">
            <h1>Storyline</h1>
          </div>

          <textarea
            className="reader-output storyline-editor"
            value={storyline}
            onChange={(event) => onChange(event.target.value)}
            placeholder="เล่าเรื่องตั้งแต่ต้นจนจบแบบคร่าว ๆ เพื่อใช้เป็นภาพรวมก่อนจะแตกลงในแต่ละ point"
            rows={18}
          />
        </Card>
      </div>

      <div ref={barRef} className="mobile-bottom-bar storyline-bottom-bar">
        <div className="mobile-bottom-actions storyline-bottom-actions">
          <Button variant="secondary" className="mobile-bottom-button" onClick={onBack}>
            กลับไปเขียน point
          </Button>
        </div>
      </div>
    </>
  )
}
