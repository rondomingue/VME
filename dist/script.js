const soundButton = document.querySelector('[data-sound-toggle]');
const year = document.querySelector('[data-year]');
const heroWordSlot = document.querySelector('.hero-word-slot');
const initialHeroWord = document.querySelector('[data-hero-word]');

year.textContent = new Date().getFullYear();

const heroMethods = [
  ['Painting', 1250],
  ['Designing', 1250],
  ['Escape', 2300],
  ['Creating', 1250],
  ['Directing', 1250],
  ['Escape', 2300],
  ['Coding', 1250],
  ['Photographing', 1450],
  ['Escape', 2300],
  ['Illustrating', 1350],
  ['Writing', 1250],
  ['Escape', 2300],
  ['Animating', 1250],
  ['Composing', 1250],
  ['Escape', 2300],
  ['Filmmaking', 1350],
  ['Editing', 1250],
  ['Escape', 2300],
  ['Sculpting', 1250],
  ['Storytelling', 1350],
  ['Escape', 2400],
  ['Making', 1250],
  ['Building', 1250],
  ['Escape', 2600]
];

if (heroWordSlot && initialHeroWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let methodIndex = 0;
  let currentHeroWord = initialHeroWord;

  const rotateHeroMethod = () => {
    const [word, hold] = heroMethods[methodIndex];
    const incomingWord = document.createElement('span');
    incomingWord.className = 'hero-word is-entering';
    incomingWord.textContent = word;
    heroWordSlot.append(incomingWord);
    currentHeroWord.classList.add('is-bumped');

    window.setTimeout(() => {
      currentHeroWord.remove();
      incomingWord.classList.remove('is-entering');
      currentHeroWord = incomingWord;
      methodIndex = (methodIndex + 1) % heroMethods.length;
      window.setTimeout(rotateHeroMethod, hold);
    }, 700);
  };

  window.setTimeout(rotateHeroMethod, 1800);
}

let audioContext;
let oscillator;
let gain;

soundButton.addEventListener('click', () => {
  const isOn = soundButton.getAttribute('aria-pressed') === 'true';
  if (isOn) {
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
    window.setTimeout(() => oscillator?.stop(), 380);
    soundButton.setAttribute('aria-pressed', 'false');
    soundButton.lastChild.textContent = ' Ambient off';
    return;
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
  gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 55;
  gain.gain.value = 0.0001;
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 1.2);
  soundButton.setAttribute('aria-pressed', 'true');
  soundButton.lastChild.textContent = ' Ambient on';
});
