import type { FutureMilestone, Milestone, SectionId, TimelineEvent } from '../../types'

type TimelinePanelProps = {
  milestones: Milestone[]
  futureMilestones: FutureMilestone[]
  timelineEvents: TimelineEvent[]
  onNavigateSection?: (section: SectionId) => void
}

export function TimelinePanel({ futureMilestones, timelineEvents, onNavigateSection }: TimelinePanelProps) {
  return (
    <div className="section-shell">
      <div className="panel">
        <p className="eyebrow">JOURNEY LOG</p>
        <div className="future-timeline">
          {timelineEvents.map((event) => (
            <div key={event.id} className="future-node">
              <div className="future-year">{event.date}</div>
              <div>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <div className="chip-row">
                  <span className="chip">{event.category}</span>
                  {event.relatedSkill ? (
                    <span
                      className="chip selectable"
                      onClick={() => onNavigateSection?.('learning')}
                      style={{ cursor: 'pointer' }}
                    >
                      {event.relatedSkill}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <p className="eyebrow">FUTURE ROADMAP</p>
        <div className="future-timeline">
          {futureMilestones.map((milestone) => (
            <div key={milestone.id} className={`future-node ${milestone.locked ? 'locked' : ''}`}>
              <div className="future-year">{milestone.year}</div>
              <div>
                <h4>{milestone.title}</h4>
                <p>{milestone.description}</p>
                <div className="chip-row">
                  <span className="chip">{milestone.category}</span>
                  {milestone.locked ? <span className="chip">Locked</span> : <span className="chip">Active</span>}
                  {milestone.relatedGoalId ? (
                    <button
                      className="chip selectable"
                      onClick={() => onNavigateSection?.('goals')}
                      style={{ background: 'rgba(34,211,238,0.15)', borderColor: 'rgba(34,211,238,0.4)', color: '#22d3ee' }}
                    >
                      Target Goal →
                    </button>
                  ) : null}
                  {milestone.relatedSkillId ? (
                    <button
                      className="chip selectable"
                      onClick={() => onNavigateSection?.('learning')}
                      style={{ background: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.4)', color: '#c084fc' }}
                    >
                      Target Skill →
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}