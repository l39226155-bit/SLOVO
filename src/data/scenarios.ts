import type { Scenario } from '@/data/types';

/** Conversation settings for the AI tutor, each with a starting line and key phrases. */
export const scenarios: Scenario[] = [
  {
    id: 'cafe',
    title: 'Im Café',
    glyph: '☕️',
    level: 'A0',
    goal: 'Bestellen, nach dem Preis fragen und bezahlen.',
    opening: { ru: 'До́брый день! Что вы хоти́те?', de: 'Guten Tag! Was möchten Sie?' },
    keyPhrases: [
      { ru: 'Оди́н ко́фе, пожа́луйста.', de: 'Einen Kaffee, bitte.' },
      { ru: 'Ско́лько э́то сто́ит?', de: 'Wie viel kostet das?' },
      { ru: 'Счёт, пожа́луйста.', de: 'Die Rechnung, bitte.' },
    ],
  },
  {
    id: 'restaurant',
    title: 'Im Restaurant',
    glyph: '🍽️',
    level: 'A1',
    goal: 'Essen bestellen, Allergien nennen, bezahlen.',
    opening: { ru: 'Здра́вствуйте! Вот ме́ню. Что бу́дете зака́зывать?', de: 'Guten Tag! Hier ist die Speisekarte. Was bestellen Sie?' },
    keyPhrases: [
      { ru: 'Я хочу́ суп и сала́т.', de: 'Ich möchte Suppe und Salat.' },
      { ru: 'У меня́ аллерги́я на оре́хи.', de: 'Ich bin allergisch gegen Nüsse.' },
      { ru: 'Мо́жно плати́ть ка́ртой?', de: 'Kann man mit Karte zahlen?' },
    ],
  },
  {
    id: 'shopping',
    title: 'Einkaufen',
    glyph: '🛍️',
    level: 'A1',
    goal: 'Größen erfragen, Preise verhandeln, kaufen.',
    opening: { ru: 'Здра́вствуйте! Вам помо́чь?', de: 'Guten Tag! Kann ich Ihnen helfen?' },
    keyPhrases: [
      { ru: 'У вас есть э́то в друго́м разме́ре?', de: 'Haben Sie das in einer anderen Größe?' },
      { ru: 'Э́то сли́шком до́рого.', de: 'Das ist zu teuer.' },
      { ru: 'Я беру́ э́то.', de: 'Ich nehme das.' },
    ],
  },
  {
    id: 'travel',
    title: 'Auf Reisen',
    glyph: '✈️',
    level: 'A1',
    goal: 'Nach dem Weg fragen, Tickets kaufen, Anschlüsse finden.',
    opening: { ru: 'Извини́те, вы не ме́стный? Чем я могу́ помо́чь?', de: 'Entschuldigung, sind Sie nicht von hier? Wie kann ich helfen?' },
    keyPhrases: [
      { ru: 'Как дое́хать до це́нтра?', de: 'Wie komme ich ins Zentrum?' },
      { ru: 'Оди́н биле́т, пожа́луйста.', de: 'Eine Fahrkarte, bitte.' },
      { ru: 'Где туале́т?', de: 'Wo ist die Toilette?' },
    ],
  },
  {
    id: 'school',
    title: 'In der Schule',
    glyph: '🎒',
    level: 'A1',
    goal: 'Nach Erklärungen fragen, Hausaufgaben besprechen.',
    opening: { ru: 'Приве́т! Ты сде́лал дома́шнее зада́ние?', de: 'Hallo! Hast du die Hausaufgaben gemacht?' },
    keyPhrases: [
      { ru: 'Я не понима́ю э́то пра́вило.', de: 'Ich verstehe diese Regel nicht.' },
      { ru: 'Повтори́те, пожа́луйста.', de: 'Wiederholen Sie das bitte.' },
      { ru: 'Как э́то по-ру́сски?', de: 'Wie sagt man das auf Russisch?' },
    ],
  },
  {
    id: 'friends',
    title: 'Mit Freunden',
    glyph: '🫂',
    level: 'A1',
    goal: 'Small Talk, Pläne machen, sich verabreden.',
    opening: { ru: 'Приве́т! Как дела́? Что но́вого?', de: 'Hallo! Wie geht’s? Was gibt’s Neues?' },
    keyPhrases: [
      { ru: 'Хорошо́, спаси́бо. А у тебя́?', de: 'Gut, danke. Und bei dir?' },
      { ru: 'Дава́й встре́тимся в кафе́.', de: 'Lass uns im Café treffen.' },
      { ru: 'Во ско́лько?', de: 'Um wie viel Uhr?' },
    ],
  },
  {
    id: 'everyday',
    title: 'Alltag',
    glyph: '🏠',
    level: 'A0',
    goal: 'Über den Tag sprechen, Termine nennen.',
    opening: { ru: 'Что ты де́лаешь сего́дня?', de: 'Was machst du heute?' },
    keyPhrases: [
      { ru: 'У́тром я рабо́таю.', de: 'Morgens arbeite ich.' },
      { ru: 'Ве́чером я до́ма.', de: 'Abends bin ich zu Hause.' },
      { ru: 'Я о́чень занят.', de: 'Ich bin sehr beschäftigt.' },
    ],
  },
  {
    id: 'hotel',
    title: 'Im Hotel',
    glyph: '🏨',
    level: 'A1',
    goal: 'Zimmer buchen, Probleme melden, auschecken.',
    opening: { ru: 'До́брый ве́чер! У вас есть бро́нь?', de: 'Guten Abend! Haben Sie eine Reservierung?' },
    keyPhrases: [
      { ru: 'Я хочу́ но́мер на две но́чи.', de: 'Ich möchte ein Zimmer für zwei Nächte.' },
      { ru: 'Есть свобо́дный но́мер?', de: 'Gibt es ein freies Zimmer?' },
      { ru: 'Во ско́лько за́втрак?', de: 'Um wie viel Uhr gibt es Frühstück?' },
    ],
  },
  {
    id: 'station',
    title: 'Am Bahnhof',
    glyph: '🚉',
    level: 'A1',
    goal: 'Fahrkarten kaufen, Gleis und Abfahrt erfragen.',
    opening: { ru: 'Здра́вствуйте! Куда́ вы е́дете?', de: 'Guten Tag! Wohin fahren Sie?' },
    keyPhrases: [
      { ru: 'Оди́н биле́т до Москвы́.', de: 'Eine Fahrkarte nach Moskau.' },
      { ru: 'С како́го платфо́рмы?', de: 'Von welchem Gleis?' },
      { ru: 'Когда́ по́езд?', de: 'Wann fährt der Zug?' },
    ],
  },
];

export const scenarioById: Record<string, Scenario> = Object.fromEntries(
  scenarios.map((scenario) => [scenario.id, scenario]),
);
