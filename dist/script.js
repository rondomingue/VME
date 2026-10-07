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

  const fitHeroWord = (wordElement) => {
    const naturalWidth = wordElement.scrollWidth;
    const availableWidth = heroWordSlot.clientWidth;
    const fit = naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;
    wordElement.style.setProperty('--word-fit', fit.toFixed(3));
    wordElement.dataset.fit = fit.toFixed(3);
    return { fit, naturalWidth };
  };

  fitHeroWord(currentHeroWord);
  document.fonts?.ready.then(() => fitHeroWord(currentHeroWord));
  window.addEventListener('resize', () => fitHeroWord(currentHeroWord));

  const rotateHeroMethod = async () => {
    const [word, hold] = heroMethods[methodIndex];
    const incomingWord = document.createElement('span');
    incomingWord.className = 'hero-word';
    incomingWord.textContent = word;
    heroWordSlot.append(incomingWord);
    const { fit, naturalWidth } = fitHeroWord(incomingWord);
    const incomingWidth = naturalWidth * fit;
    const impactFit = fit * .82;
    const impactWidth = naturalWidth * impactFit;
    const outgoingFit = Number.parseFloat(currentHeroWord.dataset.fit) || 1;
    const outgoingCrush = outgoingFit * .58;

    const timing = { duration: 980, easing: 'cubic-bezier(.22, .72, .18, 1)', fill: 'forwards' };
    const incomingAnimation = incomingWord.animate([
      { opacity: 1, transform: `translate3d(${-incomingWidth - 90}px, 0, 0) scale(${fit}, 1)`, offset: 0 },
      { opacity: 1, transform: `translate3d(${-impactWidth}px, 0, 0) scale(${impactFit}, .94)`, offset: .38 },
      { opacity: 1, transform: `translate3d(${-impactWidth}px, 0, 0) scale(${impactFit}, .94)`, offset: .46 },
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${fit}, 1)`, offset: .84 },
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${fit}, 1)`, offset: 1 }
    ], timing);

    const outgoingAnimation = currentHeroWord.animate([
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${outgoingFit}, 1)`, offset: 0 },
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${outgoingFit}, 1)`, offset: .38 },
      { opacity: .92, transform: `translate3d(0, 0, 0) scale(${outgoingCrush}, .96)`, offset: .46 },
      { opacity: .22, transform: `translate3d(${incomingWidth}px, 0, 0) scale(${outgoingCrush}, .96)`, offset: .84 },
      { opacity: 0, transform: `translate3d(${incomingWidth + 110}px, 0, 0) scale(${outgoingFit * .16}, .92)`, offset: 1 }
    ], timing);

    await Promise.all([incomingAnimation.finished, outgoingAnimation.finished]);
    currentHeroWord.remove();
    incomingAnimation.cancel();
    currentHeroWord = incomingWord;
    methodIndex = (methodIndex + 1) % heroMethods.length;
    window.setTimeout(rotateHeroMethod, hold);
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
