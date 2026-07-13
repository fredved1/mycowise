// MycoWise quiz — pure vanilla JS, no dependencies.
// Each answer adds points to one or more mushroom "profiles".
// Highest total wins; ties break by question order.

const PROFILES = {
  lionsmane: {
    emoji: '🦁',
    title: 'Lion’s mane',
    body: 'Gericht op focus, geheugen en mentale helderheid. De populairste keuze voor wie z’n hoofd scherper wil.',
    evidence: 'Plausibel mechanisme (stimuleert zenuwgroeifactor NGF in lab/dierstudies) en enkele kleine, positieve humane studies. Veelbelovend, nog niet hard bewezen.',
    article: 'gids-lions-mane-onderzoek.html'
  },
  reishi: {
    emoji: '🌙',
    title: 'Reishi',
    body: 'Gericht op rust, ontspanning, slaap en immuun-ondersteuning. Het klassieke adaptogeen.',
    evidence: 'Sterkste dossier op immuun-modulatie (beta-glucanen, triterpenen). Voor slaap/stress vooral traditie en kleine studies.',
    article: 'gids-reishi-slaap-stress.html'
  },
  cordyceps: {
    emoji: '⚡',
    title: 'Cordyceps',
    body: 'Gericht op energie, uithoudingsvermogen en sportprestatie.',
    evidence: 'Gemengd humaan bewijs voor prestatie/VO2max; sommige studies positief, andere niet. Laag risico, realistische verwachting aanbevolen.',
    article: 'gids-cordyceps-energie-sport.html'
  },
  turkeytail: {
    emoji: '🛡️',
    title: 'Turkey tail (gewoon elfenbankje)',
    body: 'Gericht op immuunondersteuning en darmgezondheid.',
    evidence: 'Best onderzocht op immuunvlak (PSK/PSP als adjuvans onderzocht in oncologie). Als supplement: bescheiden bewijs.',
    article: 'gids-functionele-paddenstoelen-beginnersgids.html'
  }
};

const QUESTIONS = [
  {
    q: 'Wat wil je het liefst verbeteren?',
    a: [
      { t: 'Focus en geheugen', add: { lionsmane: 3 } },
      { t: 'Slaap en ontspanning', add: { reishi: 3 } },
      { t: 'Energie en uithoudingsvermogen', add: { cordyceps: 3 } },
      { t: 'Weerstand / immuunsysteem', add: { turkeytail: 3, reishi: 1 } }
    ]
  },
  {
    q: 'Hoe zou je je typische dag omschrijven?',
    a: [
      { t: 'Veel denkwerk, schermwerk, concentratie nodig', add: { lionsmane: 2 } },
      { t: 'Druk en gestrest, moeite met afschakelen', add: { reishi: 2 } },
      { t: 'Fysiek actief, sport of zware inspanning', add: { cordyceps: 2 } },
      { t: 'Vaak verkouden of snel uitgeput', add: { turkeytail: 2 } }
    ]
  },
  {
    q: 'Wanneer zou je het willen innemen?',
    a: [
      { t: '’s Ochtends, voor een productieve start', add: { lionsmane: 2, cordyceps: 1 } },
      { t: '’s Avonds, om tot rust te komen', add: { reishi: 3 } },
      { t: 'Voor het sporten', add: { cordyceps: 3 } },
      { t: 'Maakt niet uit, gewoon dagelijks', add: { turkeytail: 1, reishi: 1 } }
    ]
  },
  {
    q: 'Hoe sta je tegenover bewijs?',
    a: [
      { t: 'Ik wil iets met een plausibel mechanisme, ook al is het vroeg', add: { lionsmane: 2 } },
      { t: 'Ik hecht aan een lange traditie plus modern onderzoek', add: { reishi: 2 } },
      { t: 'Ik wil vooral een merkbaar, praktisch effect', add: { cordyceps: 2 } },
      { t: 'Geef mij het best onderzochte, ook al is het effect bescheiden', add: { turkeytail: 3 } }
    ]
  },
  {
    q: 'Wat is voor jou het belangrijkst bij een supplement?',
    a: [
      { t: 'Kwaliteit boven prijs', add: { lionsmane: 1, reishi: 1 } },
      { t: 'Een merkbaar effect', add: { cordyceps: 2, lionsmane: 1 } },
      { t: 'Rust en betere nachten', add: { reishi: 2 } },
      { t: 'Preventie en algehele gezondheid', add: { turkeytail: 2 } }
    ]
  }
];

const scores = { lionsmane: 0, reishi: 0, cordyceps: 0, turkeytail: 0 };
let current = 0;

const qText = document.getElementById('q-text');
const answersEl = document.getElementById('answers');
const bar = document.getElementById('bar');
const questionView = document.getElementById('question-view');
const resultView = document.getElementById('result-view');

function renderQuestion() {
  const item = QUESTIONS[current];
  qText.textContent = item.q;
  answersEl.innerHTML = '';
  item.a.forEach((ans) => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.type = 'button';
    btn.textContent = ans.t;
    btn.addEventListener('click', () => choose(ans));
    answersEl.appendChild(btn);
  });
  bar.style.width = (current / QUESTIONS.length * 100) + '%';
}

function choose(ans) {
  for (const key in ans.add) scores[key] += ans.add[key];
  current++;
  if (current < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function winner() {
  let best = null, bestScore = -1;
  for (const key of Object.keys(PROFILES)) {
    if (scores[key] > bestScore) { bestScore = scores[key]; best = key; }
  }
  return best;
}

function showResult() {
  bar.style.width = '100%';
  const p = PROFILES[winner()];
  document.getElementById('r-emoji').textContent = p.emoji;
  document.getElementById('r-title').textContent = p.title;
  document.getElementById('r-body').textContent = p.body;
  document.getElementById('r-evidence').textContent = p.evidence;
  document.getElementById('r-article').setAttribute('href', p.article);
  questionView.classList.add('hidden');
  resultView.classList.remove('hidden');
}

document.getElementById('restart').addEventListener('click', () => {
  for (const k in scores) scores[k] = 0;
  current = 0;
  resultView.classList.add('hidden');
  questionView.classList.remove('hidden');
  renderQuestion();
});

renderQuestion();
