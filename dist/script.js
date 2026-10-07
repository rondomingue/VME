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

  const splitHeroWord = (wordElement, word) => {
    wordElement.textContent = '';
    [...word].forEach((character) => {
      const letter = document.createElement('span');
      letter.className = 'hero-letter';
      letter.textContent = character === ' ' ? '\u00a0' : character;
      wordElement.append(letter);
    });
  };

  const fitHeroWord = (wordElement) => {
    const naturalWidth = wordElement.scrollWidth;
    const availableWidth = heroWordSlot.clientWidth;
    const fit = naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;
    wordElement.style.setProperty('--word-fit', fit.toFixed(3));
    wordElement.dataset.fit = fit.toFixed(3);
    return { fit, naturalWidth };
  };

  splitHeroWord(currentHeroWord, currentHeroWord.textContent);
  fitHeroWord(currentHeroWord);
  document.fonts?.ready.then(() => fitHeroWord(currentHeroWord));
  window.addEventListener('resize', () => fitHeroWord(currentHeroWord));

  const rotateHeroMethod = async () => {
    const [word, hold] = heroMethods[methodIndex];
    const incomingWord = document.createElement('span');
    incomingWord.className = 'hero-word';
    splitHeroWord(incomingWord, word);
    heroWordSlot.append(incomingWord);
    const { fit, naturalWidth } = fitHeroWord(incomingWord);
    const incomingWidth = naturalWidth * fit;
    const impactFit = fit * .82;
    const impactWidth = naturalWidth * impactFit;
    const outgoingFit = Number.parseFloat(currentHeroWord.dataset.fit) || 1;
    const timing = { duration: 1050, easing: 'cubic-bezier(.22, .72, .18, 1)', fill: 'forwards' };
    const incomingAnimation = incomingWord.animate([
      { opacity: 1, transform: `translate3d(${-incomingWidth - 110}px, 0, 0) rotate(-1.5deg) scale(${fit}, 1)`, offset: 0 },
      { opacity: 1, transform: `translate3d(${-impactWidth}px, 0, 0) rotate(0) scale(${impactFit}, .95)`, offset: .34 },
      { opacity: 1, transform: `translate3d(${-impactWidth}px, 0, 0) rotate(0) scale(${impactFit}, .95)`, offset: .43 },
      { opacity: 1, transform: `translate3d(0, 0, 0) rotate(.35deg) scale(${fit}, 1.015)`, offset: .82 },
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${fit}, 1)`, offset: 1 }
    ], timing);

    const outgoingAnimation = currentHeroWord.animate([
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${outgoingFit}, 1)`, offset: 0 },
      { opacity: 1, transform: `translate3d(0, 0, 0) scale(${outgoingFit}, 1)`, offset: .34 },
      { opacity: 1, transform: `translate3d(8px, 0, 0) scale(${outgoingFit}, 1)`, offset: .43 },
      { opacity: 1, transform: `translate3d(${incomingWidth + 8}px, 0, 0) scale(${outgoingFit}, 1)`, offset: .82 },
      { opacity: 1, transform: `translate3d(${incomingWidth + 130}px, 0, 0) scale(${outgoingFit}, 1)`, offset: 1 }
    ], timing);

    const outgoingLetters = [...currentHeroWord.querySelectorAll('.hero-letter')];
    const letterAnimations = outgoingLetters.map((letter, index) => {
      const progress = outgoingLetters.length > 1 ? index / (outgoingLetters.length - 1) : 0;
      const squeeze = .42 + (progress * .38);
      const finalSqueeze = .16 + (progress * .2);
      const shear = -15 + (progress * 9);
      const roll = 14 - (progress * 7);
      return letter.animate([
        { opacity: 1, transform: 'translate3d(0, 0, 0) skewX(0) rotate(0) scaleX(1)', offset: 0 },
        { opacity: 1, transform: `translate3d(0, 0, 0) skewX(${shear}deg) rotate(${roll * .28}deg) scaleX(${squeeze})`, offset: .36 },
        { opacity: .68, transform: `translate3d(${10 + progress * 8}px, ${-3 + progress * 5}px, 0) skewX(${shear * .55}deg) rotate(${roll * .68}deg) scaleX(${squeeze * .7})`, offset: .7 },
        { opacity: 0, transform: `translate3d(${28 + progress * 16}px, ${5 + progress * 5}px, 0) skewX(0) rotate(${roll}deg) scaleX(${finalSqueeze})`, offset: 1 }
      ], {
        duration: 680,
        delay: 450 + (index * 42),
        easing: 'cubic-bezier(.3, .68, .28, 1)',
        fill: 'forwards'
      });
    });

    await Promise.all([
      incomingAnimation.finished,
      outgoingAnimation.finished,
      ...letterAnimations.map((animation) => animation.finished)
    ]);
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
