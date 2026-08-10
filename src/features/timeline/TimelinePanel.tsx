import type { FutureMilestone, Milestone, TimelineEvent } from '../../types'

type TimelinePanelProps = {
  milestones: Milestone[]
  futureMilestones: FutureMilestone[]
  timelineEvents: TimelineEvent[]
}

export function TimelinePanel({ futureMilestones, timelineEvents }: TimelinePanelProps) {
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
                  {event.relatedSkill ? <span className="chip">{event.relatedSkill}</span> : null}
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
                  {milestone.relatedGoalId ? <span className="chip">Goal</span> : null}
                  {milestone.relatedSkillId ? <span className="chip">Skill</span> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}