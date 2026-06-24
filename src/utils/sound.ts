export function playTimerSound() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a beep sound using oscillator
  const beepDuration = 0.2;
  const beepFrequency = 800;
  const numBeeps = 3;
  const beepInterval = 0.15;
  
  const now = audioContext.currentTime;
  
  for (let i = 0; i < numBeeps; i++) {
    const startTime = now + i * beepInterval;
    const endTime = startTime + beepDuration;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = beepFrequency;
    oscillator.type = 'sine';
    
    // Fade in and out
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, endTime);
    
    oscillator.start(startTime);
    oscillator.stop(endTime);
  }
}
