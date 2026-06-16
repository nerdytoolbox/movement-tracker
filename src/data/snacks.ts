import type { MovementSnack } from '../types';

export const MOVEMENT_SNACKS: MovementSnack[] = [
  { id: 'snack-squats', name: '10 Squats', durationSeconds: 60, description: 'Ten slow bodyweight squats. Sit back, chest tall, full depth if you can!', tags: ['legs', 'quick', 'no-equipment'], emoji: '🏋️' },
  { id: 'snack-wrist-circles', name: 'Wrist Circles', durationSeconds: 60, description: 'Rotate both wrists 10 times each direction. A must for crocheters and desk workers.', tags: ['wrists', 'quick', 'seated'], emoji: '🤲' },
  { id: 'snack-deep-squat', name: 'Deep Squat Hold', durationSeconds: 60, description: 'Get into a deep squat and hold for 60 seconds. Use a door frame if you need support.', tags: ['hips', 'mobility', 'hold'], emoji: '🪑' },
  { id: 'snack-crow-attempt', name: 'Crow Pose Attempt', durationSeconds: 90, description: 'Try a crow pose! Even getting into the prep position counts. No pressure.', tags: ['balance', 'arms', 'crow'], emoji: '🐦' },
  { id: 'snack-one-leg', name: 'One-Leg Balance', durationSeconds: 60, description: 'Balance on one leg for 30 seconds each side. Level up: close your eyes!', tags: ['balance', 'quick', 'anywhere'], emoji: '🦩' },
  { id: 'snack-plank', name: 'Plank', durationSeconds: 60, description: 'Hold a plank for as long as you can, up to 60 seconds. Focus on breathing.', tags: ['core', 'strength', 'quick'], emoji: '📏' },
  { id: 'snack-shoulder-rolls', name: 'Shoulder Rolls', durationSeconds: 45, description: 'Roll both shoulders forward 10 times, then backward. Release that tension!', tags: ['shoulders', 'desk', 'quick', 'seated'], emoji: '🔄' },
  { id: 'snack-cat-cow', name: 'Cat-Cow Stretch', durationSeconds: 60, description: 'Get on all fours and move through cat-cow 10 times slowly. Your spine will thank you.', tags: ['spine', 'mobility', 'floor'], emoji: '🐱' },
  { id: 'snack-handstand-kick', name: 'Handstand Kick-up', durationSeconds: 90, description: 'Attempt 3-5 handstand kick-ups. Against wall is totally fine. Have fun with it!', tags: ['handstand', 'arms', 'wall'], emoji: '🙃' },
  { id: 'snack-neck-stretch', name: 'Neck Side Stretch', durationSeconds: 45, description: 'Drop one ear toward your shoulder and breathe. Hold 15 seconds each side.', tags: ['neck', 'seated', 'quick', 'desk'], emoji: '🦒' },
  { id: 'snack-hip-circles', name: 'Hip Circles', durationSeconds: 60, description: "Stand and make big lazy circles with your hips. Ten each way. Pretend you're hula hooping.", tags: ['hips', 'mobility', 'standing'], emoji: '⭕' },
  { id: 'snack-pushups', name: '5 Push-ups', durationSeconds: 45, description: "Just five push-ups. That's it. You can do five.", tags: ['chest', 'arms', 'quick'], emoji: '⬆️' },
  { id: 'snack-bridge', name: 'Bridge Hold', durationSeconds: 60, description: 'Lie on your back and press your hips up into bridge pose. Hold for 30 seconds.', tags: ['back', 'hips', 'floor'], emoji: '🌉' },
  { id: 'snack-frog-balance', name: 'Frog Balance', durationSeconds: 60, description: 'Squat and try to balance with knees on arms. Even lifting your heels counts!', tags: ['balance', 'arms', 'crow-prep'], emoji: '🐸' },
  { id: 'snack-cartwheel', name: 'Cartwheel Attempt', durationSeconds: 60, description: 'Throw a cartwheel! Or practice the hand placement. Progress not perfection.', tags: ['cartwheel', 'full-body', 'fun'], emoji: '🎡' },
];
