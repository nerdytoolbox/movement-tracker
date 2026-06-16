import { useState } from 'react';
import { SKILLS } from '../data/skills';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import type { Skill } from '../types';

export function SkillTreeScreen() {
  const { skillProgress, updateSkillMilestone } = useApp();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  function getProgress(skill: Skill): number {
    const progress = skillProgress[skill.id];
    if (!progress) return 0;
    const completed = skill.milestones.filter(m => progress.milestones[m.id]).length;
    return Math.round((completed / skill.milestones.length) * 100);
  }

  function isUnlocked(skill: Skill): boolean {
    return skill.prerequisites.every(prereqId => {
      const prereq = SKILLS.find(s => s.id === prereqId);
      if (!prereq) return true;
      return getProgress(prereq) === 100;
    });
  }

  const tier0 = SKILLS.filter(s => s.prerequisites.length === 0);
  const tier1 = SKILLS.filter(s => s.prerequisites.length > 0 && s.prerequisites.every(p => tier0.some(s0 => s0.id === p)));
  const tier2 = SKILLS.filter(s => !tier0.includes(s) && !tier1.includes(s));

  const tiers = [tier0, tier1, tier2].filter(t => t.length > 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 px-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Skill Tree 🌳</h1>
      <p className="text-zinc-500 text-sm mb-6">Complete skills to unlock new ones</p>

      <div className="space-y-8">
        {tiers.map((tier, tierIdx) => (
          <div key={tierIdx}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                {tierIdx === 0 ? 'Foundation' : tierIdx === 1 ? 'Level 2' : 'Advanced'}
              </div>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tier.map(skill => {
                const progress = getProgress(skill);
                const unlocked = isUnlocked(skill);
                return (
                  <Card
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={unlocked ? '' : 'opacity-40'}
                  >
                    <div className="text-3xl mb-2">{skill.emoji}</div>
                    <h3 className="font-semibold text-sm text-zinc-100 mb-1 leading-tight">{skill.name}</h3>
                    {!unlocked ? (
                      <div className="text-zinc-600 text-xs">🔒 Locked</div>
                    ) : progress === 100 ? (
                      <div className="text-emerald-400 text-xs font-semibold">✓ Complete!</div>
                    ) : (
                      <>
                        <Progress value={progress} className="h-1.5 mt-2" />
                        <div className="text-zinc-500 text-xs mt-1">{progress}%</div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedSkill && (
        <Modal isOpen={true} title={selectedSkill.name} onClose={() => setSelectedSkill(null)}>
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{selectedSkill.emoji}</div>
            <p className="text-zinc-400 text-sm mb-2">{selectedSkill.description}</p>
            {!isUnlocked(selectedSkill) && (
              <div className="bg-zinc-800 rounded-2xl p-3 text-sm text-zinc-400">
                🔒 Complete prerequisites first:
                <div className="mt-1 font-semibold text-zinc-300">
                  {selectedSkill.prerequisites.map(pId => SKILLS.find(s => s.id === pId)?.name).join(', ')}
                </div>
              </div>
            )}
          </div>

          {isUnlocked(selectedSkill) && (
            <>
              <Progress value={getProgress(selectedSkill)} className="h-2 mb-2" />
              <div className="text-center text-sm text-zinc-500 mb-4">
                {getProgress(selectedSkill)}% complete
              </div>

              <h3 className="font-semibold text-zinc-300 mb-3">Milestones</h3>
              <div className="space-y-2 mb-4">
                {selectedSkill.milestones.map((milestone, i) => {
                  const completed = skillProgress[selectedSkill.id]?.milestones[milestone.id] || false;
                  const prevCompleted = i === 0 || (skillProgress[selectedSkill.id]?.milestones[selectedSkill.milestones[i - 1].id] || false);
                  const canComplete = prevCompleted;
                  return (
                    <button
                      key={milestone.id}
                      disabled={!canComplete && !completed}
                      onClick={() => updateSkillMilestone(selectedSkill.id, milestone.id, !completed)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl transition-all ${
                        completed
                          ? 'bg-violet-500/20 border border-violet-500/30'
                          : canComplete
                          ? 'bg-zinc-800 hover:bg-zinc-700'
                          : 'bg-zinc-900 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-lg mt-0.5">{completed ? '✅' : canComplete ? '⭕' : '🔒'}</span>
                      <span className={`text-sm leading-snug ${completed ? 'text-violet-300' : 'text-zinc-300'}`}>
                        {milestone.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedSkill.notes && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-sm text-amber-300">
                  💡 {selectedSkill.notes}
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
