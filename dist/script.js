const soundButton = document.querySelector('[data-sound-toggle]');
const year = document.querySelector('[data-year]');
const heroWord = document.querySelector('[data-hero-word]');

year.textContent = new Date().getFullYear();

const heroMethods = [
  ['Painting', 'medium'],
  ['Designing', 'medium'],
  ['Escaping', 'medium', 2200],
  ['Creating', 'medium'],
  ['Directing', 'medium'],
  ['Escaping', 'medium', 2200],
  ['Coding', 'short'],
  ['Photographing', 'long'],
  ['Escaping', 'medium', 2200],
  ['Illustrating', 'long'],
  ['Writing', 'short'],
  ['Escaping', 'medium', 2200],
  ['Animating', 'medium'],
  ['Composing', 'medium'],
  ['Escaping', 'medium', 2200],
  ['Filmmaking', 'medium'],
  ['Editing', 'short'],
  ['Escaping', 'medium', 2200],
  ['Sculpting', 'medium'],
  ['Storytelling', 'long'],
  ['Escaping', 'medium', 2400],
  ['Making', 'short'],
  ['Building', 'medium'],
  ['Escaping', 'medium', 2600]
];

if (heroWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let methodIndex = 0;

  const rotateHeroMethod = () => {
    const [word, size, hold = 1250] = heroMethods[methodIndex];
    heroWord.classList.add('is-exiting');

    window.setTimeout(() => {
      heroWord.textContent = word;
      heroWord.dataset.size = size;
      heroWord.classList.remove('is-exiting');
      heroWord.classList.add('is-entering');
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => heroWord.classList.remove('is-entering'));
      });
      methodIndex = (methodIndex + 1) % heroMethods.length;
      window.setTimeout(rotateHeroMethod, hold);
    }, 340);
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
