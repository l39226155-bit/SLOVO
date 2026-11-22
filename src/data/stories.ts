import type { Level } from '@/data/types';

export interface StorySentence {
  ru: string;
  de: string;
}

export interface StoryQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  level: Level;
  minutes: number;
  sentences: StorySentence[];
  /** Words that are not in the course vocabulary, keyed by lower-case form. */
  glossary: Record<string, string>;
  questions: StoryQuestion[];
}

export const stories: Story[] = [
  {
    id: 'st_moy_den',
    title: 'Мой день',
    subtitle: 'Ein Tag in Moskau',
    level: 'A0',
    minutes: 3,
    sentences: [
      { ru: 'Меня́ зову́т Ири́на.', de: 'Ich heiße Irina.' },
      { ru: 'Я живу́ в Москве́.', de: 'Ich wohne in Moskau.' },
      { ru: 'У́тром я пью ко́фе и ем хлеб.', de: 'Morgens trinke ich Kaffee und esse Brot.' },
      { ru: 'В во́семь часо́в я иду́ на рабо́ту.', de: 'Um acht Uhr gehe ich zur Arbeit.' },
      { ru: 'Я рабо́таю в шко́ле.', de: 'Ich arbeite in einer Schule.' },
      { ru: 'Ве́чером я чита́ю кни́гу и слу́шаю му́зыку.', de: 'Abends lese ich ein Buch und höre Musik.' },
      { ru: 'В суббо́ту мы гуля́ем в па́рке.', de: 'Am Samstag spazieren wir im Park.' },
      { ru: 'Я о́чень люблю́ Москву́.', de: 'Ich mag Moskau sehr.' },
    ],
    glossary: {
      'рабо́ту': 'Arbeit',
      'рабо́таю': 'ich arbeite',
      'хлеб': 'Brot',
      'па́рке': 'im Park',
      'гуля́ем': 'wir spazieren',
      'му́зыку': 'Musik',
      'ве́чером': 'abends',
      'у́тром': 'morgens',
    },
    questions: [
      { question: 'Wo wohnt Irina?', options: ['In Moskau', 'In Berlin', 'In Petersburg'], answer: 0 },
      { question: 'Was macht sie abends?', options: ['Sie liest und hört Musik', 'Sie arbeitet', 'Sie kocht'], answer: 0 },
      { question: 'Wann geht sie zur Arbeit?', options: ['Um acht', 'Um sechs', 'Um zehn'], answer: 0 },
    ],
  },
  {
    id: 'st_magazin',
    title: 'В магази́не',
    subtitle: 'Einkaufen mit Hindernissen',
    level: 'A0',
    minutes: 3,
    sentences: [
      { ru: 'Сего́дня я иду́ в магази́н.', de: 'Heute gehe ich in den Supermarkt.' },
      { ru: 'Мне нужны́ хлеб, молоко́ и я́блоки.', de: 'Ich brauche Brot, Milch und Äpfel.' },
      { ru: 'В магази́не мно́го люде́й.', de: 'Im Geschäft sind viele Menschen.' },
      { ru: 'Я спра́шиваю продавца́: «Где молоко́?»', de: 'Ich frage den Verkäufer: „Wo ist die Milch?“' },
      { ru: 'Он отвеча́ет: «Спра́ва, у окна́».', de: 'Er antwortet: „Rechts, am Fenster.“' },
      { ru: 'Я беру́ молоко́ и хлеб.', de: 'Ich nehme Milch und Brot.' },
      { ru: 'На ка́ссе я плачу́ ка́ртой.', de: 'An der Kasse zahle ich mit Karte.' },
      { ru: 'Дома я де́лаю бутербро́ды.', de: 'Zu Hause mache ich belegte Brote.' },
    ],
    glossary: {
      'магази́н': 'Geschäft',
      'нужны́': 'nötig / ich brauche',
      'я́блоки': 'Äpfel',
      'люде́й': 'Menschen',
      'спра́шиваю': 'ich frage',
      'продавца́': 'den Verkäufer',
      'отвеча́ет': 'er antwortet',
      'ка́ссе': 'an der Kasse',
      'плачу́': 'ich zahle',
      'бутербро́ды': 'belegte Brote',
    },
    questions: [
      { question: 'Was braucht die Person?', options: ['Brot, Milch und Äpfel', 'Nur Kaffee', 'Fleisch und Fisch'], answer: 0 },
      { question: 'Wo steht die Milch?', options: ['Rechts am Fenster', 'Links an der Tür', 'Im Keller'], answer: 0 },
      { question: 'Wie bezahlt sie?', options: ['Mit Karte', 'Bar', 'Mit einem Gutschein'], answer: 0 },
    ],
  },
  {
    id: 'st_peterburg',
    title: 'Пое́здка в Петербу́рг',
    subtitle: 'Mit dem Zug in den Norden',
    level: 'A1',
    minutes: 4,
    sentences: [
      { ru: 'В пя́тницу мы е́дем в Петербу́рг.', de: 'Am Freitag fahren wir nach Petersburg.' },
      { ru: 'По́езд отхо́дит с Моско́вского вокза́ла в семь ве́чера.', de: 'Der Zug fährt um sieben Uhr abends vom Moskauer Bahnhof ab.' },
      { ru: 'Мы купи́ли биле́ты туда́ и обра́тно.', de: 'Wir haben Hin- und Rückfahrkarten gekauft.' },
      { ru: 'В по́езде я чита́ю и смотрю́ в окно́.', de: 'Im Zug lese ich und schaue aus dem Fenster.' },
      { ru: 'Ночью мы приезжа́ем в го́род.', de: 'Nachts kommen wir in der Stadt an.' },
      { ru: 'Оте́ль нахо́дится недалеко́ от вокза́ла.', de: 'Das Hotel liegt nicht weit vom Bahnhof.' },
      { ru: 'У́тром мы идём гуля́ть по це́нтру.', de: 'Morgens gehen wir im Zentrum spazieren.' },
      { ru: 'Пого́да холо́дная, но го́род краси́вый.', de: 'Das Wetter ist kalt, aber die Stadt ist schön.' },
    ],
    glossary: {
      'пое́здка': 'Reise',
      'е́дем': 'wir fahren',
      'отхо́дит': 'fährt ab',
      'вокза́ла': 'vom Bahnhof',
      'купи́ли': 'wir haben gekauft',
      'окно́': 'Fenster',
      'ночью': 'nachts',
      'приезжа́ем': 'wir kommen an',
      'нахо́дится': 'liegt / befindet sich',
      'пого́да': 'Wetter',
      'холо́дная': 'kalt',
      'краси́вый': 'schön',
    },
    questions: [
      { question: 'Wann fährt der Zug ab?', options: ['Um sieben Uhr abends', 'Um sieben Uhr morgens', 'Um neun Uhr abends'], answer: 0 },
      { question: 'Wo liegt das Hotel?', options: ['Nicht weit vom Bahnhof', 'Am Flughafen', 'Außerhalb der Stadt'], answer: 0 },
      { question: 'Wie ist das Wetter?', options: ['Kalt, aber die Stadt ist schön', 'Warm und sonnig', 'Es regnet stark'], answer: 0 },
    ],
  },
  {
    id: 'st_pismo',
    title: 'Пи́сьмо дру́гу',
    subtitle: 'Eine Nachricht aus Berlin',
    level: 'A1',
    minutes: 4,
    sentences: [
      { ru: 'Приве́т, Са́ша!', de: 'Hallo Sascha!' },
      { ru: 'Как у тебя́ дела́?', de: 'Wie geht es dir?' },
      { ru: 'У меня́ всё хорошо́.', de: 'Mir geht es gut.' },
      { ru: 'Я мно́го рабо́таю и учу́ ру́сский язы́к.', de: 'Ich arbeite viel und lerne Russisch.' },
      { ru: 'По вечера́м я занима́юсь с преподава́телем.', de: 'Abends lerne ich mit einem Lehrer.' },
      { ru: 'В ию́не я хочу́ прие́хать в Москву́.', de: 'Im Juni möchte ich nach Moskau kommen.' },
      { ru: 'Мо́жешь показа́ть мне го́род?', de: 'Kannst du mir die Stadt zeigen?' },
      { ru: 'Напиши́, когда́ у тебя́ есть вре́мя.', de: 'Schreib mir, wann du Zeit hast.' },
      { ru: 'До встре́чи!', de: 'Bis bald!' },
    ],
    glossary: {
      'пи́сьмо': 'Brief',
      'дру́гу': 'an den Freund',
      'вечера́м': 'abends',
      'занима́юсь': 'ich lerne',
      'преподава́телем': 'mit einem Lehrer',
      'прие́хать': 'ankommen / herkommen',
      'показа́ть': 'zeigen',
      'напиши́': 'schreib',
      'вре́мя': 'Zeit',
    },
    questions: [
      { question: 'Was macht der Schreiber abends?', options: ['Er lernt mit einem Lehrer', 'Er geht ins Kino', 'Er arbeitet im Büro'], answer: 0 },
      { question: 'Wann will er nach Moskau?', options: ['Im Juni', 'Im Januar', 'Im September'], answer: 0 },
      { question: 'Worum bittet er Sascha?', options: ['Ihm die Stadt zu zeigen', 'Ein Hotel zu buchen', 'Ein Buch zu schicken'], answer: 0 },
    ],
  },
  {
    id: 'st_kniga',
    title: 'Ста́рая кни́га',
    subtitle: 'Ein Fund auf dem Dachboden',
    level: 'A1',
    minutes: 4,
    sentences: [
      { ru: 'Вчера́ я нашёл на чердаке́ ста́рую кни́гу.', de: 'Gestern fand ich auf dem Dachboden ein altes Buch.' },
      { ru: 'Она́ была́ в ко́жаной обло́жке.', de: 'Es hatte einen Ledereinband.' },
      { ru: 'На пе́рвой страни́це стоя́ло и́мя мое́й ба́бушки.', de: 'Auf der ersten Seite stand der Name meiner Großmutter.' },
      { ru: 'Ба́бушка у́чилась в шко́ле в сороковы́х года́х.', de: 'Meine Großmutter lernte in den vierziger Jahren in der Schule.' },
      { ru: 'В кни́ге бы́ли стихи́ и ма́ленькие рису́нки.', de: 'In dem Buch waren Gedichte und kleine Zeichnungen.' },
      { ru: 'Я показа́л кни́гу ма́ме.', de: 'Ich zeigte das Buch meiner Mutter.' },
      { ru: 'Она́ до́лго смотре́ла на страни́цы и улыба́лась.', de: 'Sie sah lange auf die Seiten und lächelte.' },
      { ru: 'Тепе́рь кни́га стои́т на моём столе́.', de: 'Jetzt steht das Buch auf meinem Tisch.' },
    ],
    glossary: {
      'нашёл': 'ich fand',
      'чердаке́': 'auf dem Dachboden',
      'ста́рую': 'alte',
      'ко́жаной': 'aus Leder',
      'обло́жке': 'Einband',
      'страни́це': 'auf der Seite',
      'ба́бушки': 'der Großmutter',
      'у́чилась': 'sie lernte',
      'стихи́': 'Gedichte',
      'рису́нки': 'Zeichnungen',
      'улыба́лась': 'sie lächelte',
      'стои́т': 'steht',
    },
    questions: [
      { question: 'Wo fand die Person das Buch?', options: ['Auf dem Dachboden', 'In der Schule', 'Im Geschäft'], answer: 0 },
      { question: 'Wessen Name stand im Buch?', options: ['Der Großmutter', 'Der Mutter', 'Eines Lehrers'], answer: 0 },
      { question: 'Was war außer Gedichten im Buch?', options: ['Kleine Zeichnungen', 'Fotos', 'Landkarten'], answer: 0 },
    ],
  },
];

export const storyById: Record<string, Story> = Object.fromEntries(stories.map((story) => [story.id, story]));

/** Flat list of story words, used by the dictionary and the reading glossary. */
export function storyGlossary(story: Story): { ru: string; de: string }[] {
  const seen = new Set<string>();
  const entries: { ru: string; de: string }[] = [];
  story.sentences.forEach((sentence) => {
    sentence.ru.split(/\s+/).forEach((raw) => {
      const word = raw.toLowerCase().replace(/[.,!?;:«»()]/g, '');
      if (!word || seen.has(word)) return;
      const meaning = story.glossary[word];
      if (meaning) {
        seen.add(word);
        entries.push({ ru: word, de: meaning });
      }
    });
  });
  return entries;
}
