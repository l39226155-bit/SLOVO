import type { Level } from '@/data/types';

export type SentenceCategory =
  | 'einfach'
  | 'fragen'
  | 'verneinung'
  | 'vergangenheit'
  | 'zukunft'
  | 'komplex'
  | 'alltag';

export interface SentenceItem {
  id: string;
  category: SentenceCategory;
  level: Level;
  de: string;
  /** Model translation with stress marks. */
  ru: string;
  /** Further correct phrasings — word order and synonyms. */
  alternatives: string[];
  explanation: string;
  mistake: string;
}

export const sentenceCategories: { id: SentenceCategory; label: string; hint: string; level: Level }[] = [
  { id: 'einfach', label: 'Einfach', hint: 'Subjekt, Verb, Objekt', level: 'A0' },
  { id: 'fragen', label: 'Fragen', hint: 'Ja/Nein und W-Fragen', level: 'A0' },
  { id: 'verneinung', label: 'Verneinung', hint: 'не und нет', level: 'A1' },
  { id: 'vergangenheit', label: 'Vergangenheit', hint: 'Perfekt und Präteritum', level: 'A1' },
  { id: 'zukunft', label: 'Zukunft', hint: 'бу́ду und хочу́', level: 'A1' },
  { id: 'komplex', label: 'Komplex', hint: 'Nebensätze und Fälle', level: 'A1' },
  { id: 'alltag', label: 'Alltagssprache', hint: 'So sagt man es wirklich', level: 'A1' },
];

export const sentenceItems: SentenceItem[] = [
  // ── Einfach ──────────────────────────────────────────────────────────────
  {
    id: 's_e1',
    category: 'einfach',
    level: 'A0',
    de: 'Ich heiße Anna.',
    ru: 'Меня́ зову́т А́нна.',
    alternatives: ['Я А́нна.'],
    explanation: 'меня́ зову́т + Akkusativ ist die feste Wendung für „ich heiße“.',
    mistake: 'Nicht „Я зову́т А́нна“ – зову́т steht immer mit меня́.',
  },
  {
    id: 's_e2',
    category: 'einfach',
    level: 'A0',
    de: 'Ich trinke Kaffee.',
    ru: 'Я пью ко́фе.',
    alternatives: ['Я пью ко́фе.'],
    explanation: 'пью ist die 1. Person von пить; ко́фе bleibt im Akkusativ unverändert.',
    mistake: '„Я пить ко́фе“ – das Verb muss konjugiert werden.',
  },
  {
    id: 's_e3',
    category: 'einfach',
    level: 'A0',
    de: 'Das ist mein Haus.',
    ru: 'Э́то мой дом.',
    alternatives: ['Э́то мой дом.'],
    explanation: 'мой richtet sich nach дом (maskulin); э́то bleibt unverändert.',
    mistake: '„Э́то моя́ дом“ – falsches Genus.',
  },
  {
    id: 's_e4',
    category: 'einfach',
    level: 'A0',
    de: 'Wir wohnen in Berlin.',
    ru: 'Мы живём в Берли́не.',
    alternatives: ['Мы живём в Берли́не.'],
    explanation: 'Ort: в + Präpositional (Берли́н → Берли́не).',
    mistake: '„в Берли́н“ wäre die Richtung, nicht der Ort.',
  },
  {
    id: 's_e5',
    category: 'einfach',
    level: 'A0',
    de: 'Sie liest ein Buch.',
    ru: 'Она́ чита́ет кни́гу.',
    alternatives: ['Она́ чита́ет кни́гу.'],
    explanation: 'кни́га wird im Akkusativ zu кни́гу.',
    mistake: '„чита́ет кни́га“ – das Objekt braucht den Akkusativ.',
  },

  // ── Fragen ───────────────────────────────────────────────────────────────
  {
    id: 's_f1',
    category: 'fragen',
    level: 'A0',
    de: 'Wie heißt du?',
    ru: 'Как тебя́ зову́т?',
    alternatives: ['Как тебя́ зову́т?', 'Как твоё и́мя?'],
    explanation: 'тебя́ ist der Akkusativ von ты.',
    mistake: '„Как ты зову́т?“ – das Pronomen muss im Akkusativ stehen.',
  },
  {
    id: 's_f2',
    category: 'fragen',
    level: 'A0',
    de: 'Wo ist die Toilette?',
    ru: 'Где туале́т?',
    alternatives: ['Где туале́т?', 'Извини́те, где туале́т?'],
    explanation: 'где fragt nach dem Ort; туале́т bleibt im Nominativ.',
    mistake: '„Куда́ туале́т?“ fragt nach der Richtung.',
  },
  {
    id: 's_f3',
    category: 'fragen',
    level: 'A1',
    de: 'Sprichst du Russisch?',
    ru: 'Ты говори́шь по-ру́сски?',
    alternatives: ['Ты говори́шь по-ру́сски?', 'Вы говори́те по-ру́сски?'],
    explanation: 'говори́ть: я говорю́, ты говори́шь; по-ру́сски = auf Russisch.',
    mistake: '„Ты говори́т“ – falsche Endung.',
  },
  {
    id: 's_f4',
    category: 'fragen',
    level: 'A1',
    de: 'Wann fährt der Zug ab?',
    ru: 'Когда́ отхо́дит по́езд?',
    alternatives: ['Когда́ отхо́дит по́езд?', 'Во ско́лько отхо́дит по́езд?'],
    explanation: 'когда́ fragt allgemein nach dem Zeitpunkt, во ско́лько nach der Uhrzeit.',
    mistake: '„Когда́ по́езд отходи́ть?“ – Verb nicht konjugiert.',
  },
  {
    id: 's_f5',
    category: 'fragen',
    level: 'A1',
    de: 'Wie viel kostet das?',
    ru: 'Ско́лько э́то сто́ит?',
    alternatives: ['Ско́лько э́то сто́ит?', 'Ско́лько с меня́?'],
    explanation: 'сто́ить wird mit э́то unverändert verwendet.',
    mistake: '„Ско́лько э́то сто́ят?“ – nur bei Plural.',
  },

  // ── Verneinung ───────────────────────────────────────────────────────────
  {
    id: 's_n1',
    category: 'verneinung',
    level: 'A1',
    de: 'Ich verstehe nicht.',
    ru: 'Я не понима́ю.',
    alternatives: ['Я не понима́ю.', 'Я не понима́ю по-ру́сски.'],
    explanation: 'Die Verneinung steht direkt vor dem Verb: не понима́ю.',
    mistake: '„Я понима́ю не“ – не gehört vor das Verb.',
  },
  {
    id: 's_n2',
    category: 'verneinung',
    level: 'A1',
    de: 'Ich habe kein Geld.',
    ru: 'У меня́ нет де́нег.',
    alternatives: ['У меня́ нет де́нег.'],
    explanation: 'нет + Genitiv: де́ньги → де́нег. Die Struktur ist у меня́ нет …',
    mistake: '„У меня́ не де́ньги“ – hier braucht es нет + Genitiv.',
  },
  {
    id: 's_n3',
    category: 'verneinung',
    level: 'A1',
    de: 'Das ist nicht mein Buch.',
    ru: 'Э́то не моя́ кни́га.',
    alternatives: ['Э́то не моя́ кни́га.'],
    explanation: 'не steht vor dem besitzanzeigenden Wort; кни́га ist feminin.',
    mistake: '„Э́то мой не кни́га“ – не steht vor моя́.',
  },
  {
    id: 's_n4',
    category: 'verneinung',
    level: 'A1',
    de: 'Ich möchte keinen Kaffee.',
    ru: 'Я не хочу́ ко́фе.',
    alternatives: ['Я не хочу́ ко́фе.', 'Мне не ну́жен ко́фе.'],
    explanation: 'Bei nicht mögen/wollen steht der Akkusativ; ко́fe bleibt unverändert.',
    mistake: '„Я не хочу́ ко́фе нет“ – doppelte Verneinung ist falsch.',
  },
  {
    id: 's_n5',
    category: 'verneinung',
    level: 'A1',
    de: 'Er arbeitet heute nicht.',
    ru: 'Он сего́дня не рабо́тает.',
    alternatives: ['Он сего́дня не рабо́тает.', 'Сего́дня он не рабо́тает.'],
    explanation: 'Die Zeitangabe kann vorn oder nach dem Subjekt stehen.',
    mistake: '„Он не сего́дня рабо́тает“ – не steht vor рабо́тает.',
  },

  // ── Vergangenheit ────────────────────────────────────────────────────────
  {
    id: 's_p1',
    category: 'vergangenheit',
    level: 'A1',
    de: 'Gestern war ich zu Hause.',
    ru: 'Вчера́ я был до́ма.',
    alternatives: ['Вчера́ я был до́ма.', 'Вчера́ я была́ до́ма.'],
    explanation: 'был/была́ richtet sich nach dem Sprecher.',
    mistake: '„Вчера́ я есть до́ма“ – für gestern braucht es был/была́.',
  },
  {
    id: 's_p2',
    category: 'vergangenheit',
    level: 'A1',
    de: 'Ich habe einen Film gesehen.',
    ru: 'Я смотре́л фильм.',
    alternatives: ['Я смотре́л фильм.', 'Я посмотре́л фильм.', 'Я смотре́ла фильм.'],
    explanation: 'Russisch nutzt oft das Präteritum statt einer zusammengesetzten Form.',
    mistake: '„Я есть смотре́л“ – есть ist hier falsch.',
  },
  {
    id: 's_p3',
    category: 'vergangenheit',
    level: 'A1',
    de: 'Wir haben gestern im Restaurant gegessen.',
    ru: 'Вчера́ мы е́ли в рестора́не.',
    alternatives: ['Вчера́ мы е́ли в рестора́не.', 'Вчера́ мы пое́ли в рестора́не.'],
    explanation: 'есть → е́ли; Ort mit в + Präpositional: в рестора́не.',
    mistake: '„в рестора́н“ beschreibt die Richtung.',
  },
  {
    id: 's_p4',
    category: 'vergangenheit',
    level: 'A1',
    de: 'Sie kam spät nach Hause.',
    ru: 'Она́ пришла́ домо́й по́здно.',
    alternatives: ['Она́ пришла́ домо́й по́здно.', 'Она́ пришла́ по́здно домо́й.'],
    explanation: 'прийти́ → пришла́ (feminin); домо́й = nach Hause.',
    mistake: '„Она́ пришёл“ – falsches Genus.',
  },
  {
    id: 's_p5',
    category: 'vergangenheit',
    level: 'A1',
    de: 'Hast du das Buch gelesen?',
    ru: 'Ты чита́л э́ту кни́гу?',
    alternatives: ['Ты чита́л э́ту кни́гу?', 'Ты прочита́л э́ту кни́гу?', 'Ты чита́ла э́ту кни́гу?'],
    explanation: 'э́ту кни́гу ist Akkusativ feminin.',
    mistake: '„э́та кни́га“ wäre das Subjekt, nicht das Objekt.',
  },

  // ── Zukunft ──────────────────────────────────────────────────────────────
  {
    id: 's_z1',
    category: 'zukunft',
    level: 'A1',
    de: 'Morgen fahre ich nach Moskau.',
    ru: 'За́втра я е́ду в Москву́.',
    alternatives: ['За́втра я е́ду в Москву́.', 'За́втра я пое́ду в Москву́.'],
    explanation: 'Für geplante Zukunft reicht oft das Präsens; Richtung: в + Akkusativ.',
    mistake: '„в Москве́“ wäre der Ort, nicht das Ziel.',
  },
  {
    id: 's_z2',
    category: 'zukunft',
    level: 'A1',
    de: 'Ich werde Russisch lernen.',
    ru: 'Я бу́ду учи́ть ру́сский язы́к.',
    alternatives: ['Я бу́ду учи́ть ру́сский язы́к.', 'Я бу́ду изуча́ть ру́сский.'],
    explanation: 'бу́ду + Infinitiv bildet die analytische Zukunft.',
    mistake: '„Я бу́ду учи́л“ – nach бу́ду steht der Infinitiv.',
  },
  {
    id: 's_z3',
    category: 'zukunft',
    level: 'A1',
    de: 'Wir werden uns morgen treffen.',
    ru: 'Мы встре́тимся за́втра.',
    alternatives: ['Мы встре́тимся за́втра.', 'За́втра мы встре́тимся.'],
    explanation: 'встре́титься ist reflexiv: встре́тимся.',
    mistake: '„Мы встре́тим“ ohne -ся bedeutet „wir werden treffen“ (etwas).',
  },
  {
    id: 's_z4',
    category: 'zukunft',
    level: 'A1',
    de: 'Ich möchte im Sommer nach Petersburg fahren.',
    ru: 'Ле́том я хочу́ пое́хать в Петербу́рг.',
    alternatives: ['Ле́том я хочу́ пое́хать в Петербу́рг.', 'Я хочу́ ле́том пое́хать в Петербу́рг.'],
    explanation: 'ле́том = im Sommer (Instrumental-Adverb).',
    mistake: '„в ле́то“ ist keine russische Zeitangabe.',
  },
  {
    id: 's_z5',
    category: 'zukunft',
    level: 'A1',
    de: 'Wirst du mir helfen?',
    ru: 'Ты мне помо́жешь?',
    alternatives: ['Ты мне помо́жешь?', 'Ты помо́жешь мне?'],
    explanation: 'помо́чь + Dativ: мне помо́жешь.',
    mistake: '„помо́жешь меня́“ – falscher Fall.',
  },

  // ── Komplex ──────────────────────────────────────────────────────────────
  {
    id: 's_k1',
    category: 'komplex',
    level: 'A1',
    de: 'Ich glaube, dass er Recht hat.',
    ru: 'Я ду́маю, что он прав.',
    alternatives: ['Я ду́маю, что он прав.', 'Я счита́ю, что он прав.'],
    explanation: 'что leitet den Nebensatz ein; прав bleibt unflektiert.',
    mistake: '„Я ду́маю что он пра́вый“ – прав ist die feste Form.',
  },
  {
    id: 's_k2',
    category: 'komplex',
    level: 'A1',
    de: 'Wenn du Zeit hast, ruf mich an.',
    ru: 'Е́сли у тебя́ есть вре́мя, позвони́ мне.',
    alternatives: ['Е́сли у тебя́ есть вре́мя, позвони́ мне.', 'Позвони́ мне, е́сли у тебя́ есть вре́мя.'],
    explanation: 'е́сли = wenn; позвони́ ist der Imperativ zu позвони́ть.',
    mistake: '„ко́гда́“ würde „als/wann“ bedeuten, nicht die Bedingung.',
  },
  {
    id: 's_k3',
    category: 'komplex',
    level: 'A1',
    de: 'Das Buch, das ich lese, ist interessant.',
    ru: 'Кни́га, кото́рую я чита́ю, интере́сная.',
    alternatives: ['Кни́га, кото́рую я чита́ю, интере́сная.'],
    explanation: 'кото́рую ist Akkusativ feminin, weil кни́га das Objekt des Lesens ist.',
    mistake: '„кото́рая я чита́ю“ – falscher Fall im Relativsatz.',
  },
  {
    id: 's_k4',
    category: 'komplex',
    level: 'A1',
    de: 'Ich weiß nicht, wo er wohnt.',
    ru: 'Я не зна́ю, где он живёт.',
    alternatives: ['Я не зна́ю, где он живёт.'],
    explanation: 'Im indirekten Fragesatz bleibt die Wortstellung mit где am Anfang.',
    mistake: '„где живёт он?“ ist die direkte Frage.',
  },
  {
    id: 's_k5',
    category: 'komplex',
    level: 'A1',
    de: 'Obwohl es regnet, gehen wir spazieren.',
    ru: 'Хотя́ идёт дождь, мы гуля́ем.',
    alternatives: ['Хотя́ идёт дождь, мы гуля́ем.', 'Несмотря́ на дождь, мы гуля́ем.'],
    explanation: 'идёт дождь = es regnet (wörtlich: der Regen geht).',
    mistake: '„дождь идёт“ ist zwar möglich, aber die feste Wendung ist идёт дождь.',
  },

  // ── Alltagssprache ───────────────────────────────────────────────────────
  {
    id: 's_a1',
    category: 'alltag',
    level: 'A1',
    de: 'Wie geht’s?',
    ru: 'Как дела́?',
    alternatives: ['Как дела́?', 'Как ты?', 'Как жизнь?'],
    explanation: 'Die kürzeste Alltagsform unter Freunden.',
    mistake: '„Как ты́ дела́?“ ist keine russische Wendung.',
  },
  {
    id: 's_a2',
    category: 'alltag',
    level: 'A1',
    de: 'Alles gut, danke.',
    ru: 'Всё хорошо́, спаси́бо.',
    alternatives: ['Всё хорошо́, спаси́бо.', 'Норма́льно, спаси́бо.', 'Хорошо́, спаси́бо.'],
    explanation: 'всё (neutral) = alles; хорошо́ = gut.',
    mistake: '„Все хорошо́“ bedeutet „alle sind gut“.',
  },
  {
    id: 's_a3',
    category: 'alltag',
    level: 'A1',
    de: 'Entschuldigung, ich verstehe nicht.',
    ru: 'Извини́те, я не понима́ю.',
    alternatives: ['Извини́те, я не понима́ю.', 'Прости́те, я не понима́ю.'],
    explanation: 'извини́те ist die höfliche Form zu извини́.',
    mistake: '„извини́“ ist die Du-Form und klingt unter Fremden unhöflich.',
  },
  {
    id: 's_a4',
    category: 'alltag',
    level: 'A1',
    de: 'Sprechen Sie bitte langsamer.',
    ru: 'Говори́те, пожа́луйста, ме́дленнее.',
    alternatives: ['Говори́те, пожа́луйста, ме́дленнее.', 'Мо́жно ме́дленнее?'],
    explanation: 'ме́дленнее = langsamer (Komparativ von ме́дленно).',
    mistake: '„ме́дленно“ ohne Komparativ heißt nur „langsam“.',
  },
  {
    id: 's_a5',
    category: 'alltag',
    level: 'A1',
    de: 'Was kostet das zusammen?',
    ru: 'Ско́лько всё вме́сте?',
    alternatives: ['Ско́лько всё вме́сте?', 'Ско́лько с меня́?'],
    explanation: 'вме́сте = zusammen; typische Frage an der Kasse.',
    mistake: '„Ско́лько сто́ят всё?“ – всё ist Singular, сто́ит wäre korrekt.',
  },
];

export function sentencesByCategory(category: SentenceCategory): SentenceItem[] {
  return sentenceItems.filter((item) => item.category === category);
}
