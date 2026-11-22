import type { ListeningItem } from '@/data/types';

/** Listening library — every line is read by the TTS in Russian. */
export const listeningItems: ListeningItem[] = [
  {
    id: 'li_cafe',
    level: 'A0',
    kind: 'dialogue',
    title: 'В кафе́',
    summary: 'Zwei Personen bestellen Kaffee und Kuchen.',
    minutes: 2,
    lines: [
      { speaker: 'Официа́нт', ru: 'До́брый день! Что вы хоти́те?', de: 'Guten Tag! Was möchten Sie?' },
      { speaker: 'А́нна', ru: 'Оди́н ко́фе и чай, пожа́луйста.', de: 'Einen Kaffee und Tee, bitte.' },
      { speaker: 'Официа́нт', ru: 'С молоко́м?', de: 'Mit Milch?' },
      { speaker: 'А́нна', ru: 'Да, с молоко́м. Спаси́бо.', de: 'Ja, mit Milch. Danke.' },
      { speaker: 'Официа́нт', ru: 'Пожа́луйста. С вас пятьсо́т рубле́й.', de: 'Bitte. Das macht 500 Rubel.' },
    ],
    questions: [
      {
        question: 'Was bestellt Anna?',
        options: ['Einen Kaffee und Tee', 'Zwei Kaffee', 'Nur Tee', 'Wasser und Kuchen'],
        answer: 0,
      },
      {
        question: 'Wie möchte sie den Kaffee?',
        options: ['Mit Milch', 'Ohne Milch', 'Mit Zucker', 'Sehr heiß'],
        answer: 0,
      },
      {
        question: 'Wie viel kostet es?',
        options: ['500 Rubel', '50 Rubel', '1500 Rubel', '100 Rubel'],
        answer: 0,
      },
    ],
  },
  {
    id: 'li_bahnhof',
    level: 'A1',
    kind: 'dialogue',
    title: 'На вокза́ле',
    summary: 'Nach dem Weg zum Bahnhof und nach dem Ticket fragen.',
    minutes: 3,
    lines: [
      { speaker: 'Тури́ст', ru: 'Извини́те, где вокза́л?', de: 'Entschuldigung, wo ist der Bahnhof?' },
      { speaker: 'Ме́стный', ru: 'Вокза́л там, на у́лице Ле́нина.', de: 'Der Bahnhof ist dort, in der Lenin-Straße.' },
      { speaker: 'Тури́ст', ru: 'Э́то далеко́?', de: 'Ist das weit?' },
      { speaker: 'Ме́стный', ru: 'Нет, пять мину́т пешко́м.', de: 'Nein, fünf Minuten zu Fuß.' },
      { speaker: 'Тури́ст', ru: 'Спаси́бо большо́е!', de: 'Vielen Dank!' },
    ],
    questions: [
      {
        question: 'Wo ist der Bahnhof?',
        options: ['In der Lenin-Straße', 'Am Flughafen', 'Im Hotel', 'Im Café'],
        answer: 0,
      },
      {
        question: 'Wie lange dauert der Weg?',
        options: ['Fünf Minuten zu Fuß', 'Zehn Minuten mit dem Bus', 'Eine Stunde', 'Zwei Minuten'],
        answer: 0,
      },
    ],
  },
  {
    id: 'li_alltag',
    level: 'A1',
    kind: 'story',
    title: 'Мой день',
    summary: 'Ein kurzer Tagesablauf einer Studentin.',
    minutes: 3,
    lines: [
      { ru: 'Меня́ зову́т Мари́я. Я студе́нтка.', de: 'Ich heiße Maria. Ich bin Studentin.' },
      { ru: 'У́тром я пью ко́фе и чита́ю кни́гу.', de: 'Morgens trinke ich Kaffee und lese ein Buch.' },
      { ru: 'Днём я учу́сь в университе́те.', de: 'Tagsüber studiere ich an der Universität.' },
      { ru: 'Ве́чером я гуля́ю и слу́шаю му́зыку.', de: 'Abends gehe ich spazieren und höre Musik.' },
      { ru: 'Ночью я сплю. Я люблю́ ти́хие вечера́.', de: 'Nachts schlafe ich. Ich mag ruhige Abende.' },
    ],
    questions: [
      {
        question: 'Was macht Maria morgens?',
        options: ['Kaffee trinken und lesen', 'Sport machen', 'Arbeiten', 'Einkaufen'],
        answer: 0,
      },
      {
        question: 'Wo ist sie tagsüber?',
        options: ['An der Universität', 'Im Café', 'Zu Hause', 'Im Museum'],
        answer: 0,
      },
      {
        question: 'Was macht sie abends?',
        options: ['Spazieren und Musik hören', 'Arbeiten', 'Kochen', 'Fernsehen'],
        answer: 0,
      },
    ],
  },
  {
    id: 'li_einkaufen',
    level: 'A1',
    kind: 'dialogue',
    title: 'В магази́не',
    summary: 'Obst kaufen und mit Karte bezahlen.',
    minutes: 2,
    lines: [
      { speaker: 'Продаве́ц', ru: 'Здра́вствуйте! Что вы хоти́те?', de: 'Guten Tag! Was möchten Sie?' },
      { speaker: 'Покупа́тель', ru: 'Килогра́мм я́блок, пожа́луйста.', de: 'Ein Kilo Äpfel, bitte.' },
      { speaker: 'Продаве́ц', ru: 'Пожа́луйста. Мо́жно плати́ть ка́ртой?', de: 'Bitte. Kann man mit Karte zahlen?' },
      { speaker: 'Покупа́тель', ru: 'Да, коне́чно.', de: 'Ja, natürlich.' },
    ],
    questions: [
      {
        question: 'Was kauft die Person?',
        options: ['Ein Kilo Äpfel', 'Zwei Kilo Tomaten', 'Brot', 'Milch'],
        answer: 0,
      },
      {
        question: 'Wie möchte die Person bezahlen?',
        options: ['Mit Karte', 'Bar', 'Mit Dollar', 'Gar nicht'],
        answer: 0,
      },
    ],
  },
];

export const listeningById: Record<string, ListeningItem> = Object.fromEntries(
  listeningItems.map((item) => [item.id, item]),
);
