import type { Chapter, Exercise, Lesson } from '@/data/types';
import { advancedChapters, advancedLessons } from '@/data/advanced';

export const chapters: Chapter[] = [
  { id: 'c_a0_1', level: 'A0', title: 'Первые слова', subtitle: 'Begrüßen und vorstellen', glyph: '👋' },
  { id: 'c_a0_2', level: 'A0', title: 'Алфавит', subtitle: 'Kyrillisch lesen lernen', glyph: '🔤' },
  { id: 'c_a0_3', level: 'A0', title: 'Числа и вещи', subtitle: 'Zahlen und Alltagsdinge', glyph: '🔢' },
  { id: 'c_a1_1', level: 'A1', title: 'Мой день', subtitle: 'Tagesablauf und Verben', glyph: '☀️' },
  { id: 'c_a1_2', level: 'A1', title: 'В городе', subtitle: 'Unterwegs und einkaufen', glyph: '🏙️' },
  { id: 'c_a1_3', level: 'A1', title: 'Еда и кафе', subtitle: 'Bestellen und bezahlen', glyph: '🍽️' },
  ...advancedChapters,
];

const ex = {
  choice: (
    id: string,
    prompt: string,
    options: string[],
    answer: number,
    extra: { stimulus?: string; explain?: string } = {},
  ): Exercise => ({ kind: 'choice', id, prompt, options, answer, ...extra }),

  translate: (
    id: string,
    direction: 'ru-de' | 'de-ru',
    prompt: string,
    answers: string[],
    extra: { hint?: string; explain?: string } = {},
  ): Exercise => ({ kind: 'translate', id, direction, prompt, answers, ...extra }),

  type: (id: string, prompt: string, answers: string[], extra: { hint?: string; explain?: string } = {}): Exercise => ({
    kind: 'type',
    id,
    prompt,
    answers,
    ...extra,
  }),

  cloze: (
    id: string,
    sentence: string,
    answers: string[],
    extra: { translation?: string; options?: string[]; explain?: string } = {},
  ): Exercise => ({ kind: 'cloze', id, sentence, answers, ...extra }),

  match: (id: string, prompt: string, pairs: { left: string; right: string }[]): Exercise => ({
    kind: 'match',
    id,
    prompt,
    pairs,
  }),

  order: (id: string, prompt: string, words: string[], answer: string, translation?: string): Exercise => ({
    kind: 'order',
    id,
    prompt,
    words,
    answer,
    translation,
  }),

  listen: (
    id: string,
    audio: string,
    question: string,
    options: string[],
    answer: number,
    explain?: string,
  ): Exercise => ({ kind: 'listen', id, audio, question, options, answer, explain }),

  speak: (id: string, target: string, translation: string): Exercise => ({
    kind: 'speak',
    id,
    target,
    translation,
  }),
};

/**
 * The course is a single ordered list. Lessons unlock sequentially:
 * the first lesson is open, every further lesson requires the previous one.
 */
export const lessons: Lesson[] = [
  // ── Kapitel 1: Первые слова ─────────────────────────────────────────────
  {
    id: 'l_a0_1_1',
    chapterId: 'c_a0_1',
    title: 'Привет!',
    subtitle: 'Die wichtigsten Begrüßungen',
    minutes: 6,
    xp: 15,
    vocabIds: ['v_privet', 'v_zdravstvuyte', 'v_dobroe_utro', 'v_dobryy_den', 'v_do_svidaniya', 'v_poka'],
    exercises: [
      ex.choice(
        'e1',
        'Es ist 8 Uhr morgens. Wie begrüßt du jemanden höflich?',
        ['До́брое у́тро', 'До свида́ния', 'Спаси́бо', 'Пожа́луйста'],
        0,
        { explain: 'До́брое у́тро = „Guten Morgen“ – wörtlich „guter Morgen“.' },
      ),
      ex.translate('e2', 'de-ru', 'Guten Tag (formell)', ['Здра́вствуйте', 'Здравствуйте'], {
        hint: 'Das „в“ in здра́вствуйте wird nicht gesprochen.',
      }),
      ex.choice('e3', 'Was bedeutet „Приве́т“?', ['Hallo', 'Tschüss', 'Danke', 'Bitte'], 0, {
        stimulus: 'Приве́т',
        explain: 'Приве́т ist informell – unter Freunden. Formell: Здра́вствуйте.',
      }),
      ex.match('e4', 'Verbinde die Begrüßungen mit ihrer Bedeutung.', [
        { left: 'Приве́т', right: 'Hallo (informell)' },
        { left: 'Здра́вствуйте', right: 'Guten Tag (formell)' },
        { left: 'Пока́', right: 'Tschüss' },
        { left: 'До свида́ния', right: 'Auf Wiedersehen' },
      ]),
      ex.cloze('e5', '— ___, как дела́? — Хорошо́, спаси́бо!', ['Приве́т', 'Привет', 'Здра́вствуйте'], {
        translation: '— Hallo, wie geht’s? — Gut, danke!',
      }),
      ex.listen('e6', 'До́брый ве́чер!', 'Wann sagt man diesen Gruß?', ['Am Abend', 'Am Morgen', 'Mittags', 'Nachts'], 0),
      ex.speak('e7', 'Приве́т! Как дела́?', 'Hallo! Wie geht’s?'),
    ],
  },
  {
    id: 'l_a0_1_2',
    chapterId: 'c_a0_1',
    title: 'Как вас зовут?',
    subtitle: 'Sich vorstellen und höflich sein',
    minutes: 7,
    xp: 15,
    vocabIds: ['v_menya_zovut', 'v_kak_dela', 'v_ochen_priyatno', 'v_izvinite', 'v_spasibo', 'v_pozhaluysta', 'v_ya', 'v_vy'],
    exercises: [
      ex.choice(
        'e1',
        'Wie fragst du höflich nach dem Namen?',
        ['Как вас зову́т?', 'Как дела́?', 'Где туале́т?', 'Ско́лько сто́ит?'],
        0,
      ),
      ex.translate('e2', 'ru-de', 'Меня́ зову́т А́нна.', ['Ich heiße Anna', 'Ich heisse Anna'], {
        hint: 'зову́т = „man nennt“',
      }),
      ex.cloze('e3', 'Меня́ ___ Лу́кас.', ['зову́т', 'зовут'], { translation: 'Ich heiße Lukas.' }),
      ex.match('e4', 'Ordne die Höflichkeitsfloskeln zu.', [
        { left: 'Спаси́бо', right: 'Danke' },
        { left: 'Пожа́луйста', right: 'Bitte' },
        { left: 'Извини́те', right: 'Entschuldigung' },
        { left: 'О́чень прия́тно', right: 'Sehr erfreut' },
      ]),
      ex.choice('e5', 'Du möchtest sagen „Ich verstehe nicht“. Was sagst du?', [
        'Я не понима́ю',
        'Я не зна́ю',
        'Я не хочу́',
        'Я не ем',
      ], 0),
      ex.order('e6', 'Bilde den Satz: „Ich heiße Anna.“', ['Меня́', 'зову́т', 'А́нна'], 'Меня́ зову́т А́нна.'),
      ex.speak('e7', 'О́чень прия́тно!', 'Sehr erfreut!'),
    ],
  },

  // ── Kapitel 2: Алфавит ──────────────────────────────────────────────────
  {
    id: 'l_a0_2_1',
    chapterId: 'c_a0_2',
    title: 'Кириллица I',
    subtitle: 'Die ersten 12 Buchstaben',
    minutes: 8,
    xp: 20,
    vocabIds: ['v_dom', 'v_mama', 'v_papa', 'v_okno', 'v_stol', 'v_kniga'],
    exercises: [
      ex.choice('e1', 'Welcher Buchstabe klingt wie deutsches „w“?', ['В', 'Б', 'З', 'Н'], 0, {
        explain: 'В = w (wie in „Wasser“). Б = b. Das ist der klassische Fehler.',
      }),
      ex.choice('e2', 'Welcher Buchstabe sieht aus wie „P“, klingt aber wie „r“?', ['Р', 'П', 'Н', 'М'], 0),
      ex.match('e3', 'Ordne Buchstabe und Laut zu.', [
        { left: 'С', right: 's (scharf)' },
        { left: 'З', right: 's (stimmhaft)' },
        { left: 'Ж', right: 'j (wie Journal)' },
        { left: 'Х', right: 'ch (wie Bach)' },
      ]),
      ex.cloze('e4', 'Das Wort ___ bedeutet „Haus“.', ['дом', 'Дом'], { translation: 'дом = Haus' }),
      ex.choice('e5', 'Was bedeutet „кни́га“?', ['Buch', 'Tisch', 'Fenster', 'Mama'], 0, { stimulus: 'кни́га' }),
      ex.listen('e6', 'стол', 'Welches Wort hörst du?', ['стол', 'стул', 'соль', 'сын'], 0),
      ex.type('e7', 'Schreibe „Mama“ auf Russisch (Kyrillisch).', ['ма́ма', 'мама'], { hint: 'м-а-м-а' }),
    ],
  },
  {
    id: 'l_a0_2_2',
    chapterId: 'c_a0_2',
    title: 'Чтение',
    subtitle: 'Leseregeln und Betonung',
    minutes: 8,
    xp: 20,
    vocabIds: ['v_gorod', 'v_voda', 'v_moloko', 'v_khorosho', 'v_telefon'],
    exercises: [
      ex.choice(
        'e1',
        'Warum klingt „Москва́“ wie „Maskwá“?',
        ['Unbetontes „о“ wird wie „а“ gesprochen', '„о“ wird immer verschluckt', 'Das ist ein Tippfehler', '„М“ klingt wie „b“'],
        0,
        { explain: 'Die Regel heißt А́канье: unbetontes о → a. Betont bleibt es о.' },
      ),
      ex.choice('e2', 'Wie liest man „хорошо́“?', ['charašó', 'choroschó', 'horošo', 'karasó'], 0),
      ex.translate('e3', 'ru-de', 'вода́', ['Wasser'], { hint: 'Ein Grundnahrungsmittel …' }),
      ex.cloze('e4', 'Ein hartes Zeichen steht in ___ .', ['подъе́зд', 'подьезд'], {
        translation: 'подъе́зд = Hauseingang',
      }),
      ex.order('e5', 'Bilde den Satz: „Das ist ein Telefon.“', ['Э́то', 'телефо́н'], 'Э́то телефо́н.', 'Das ist ein Telefon.'),
      ex.listen('e6', 'молоко́', 'Was hörst du?', ['молоко́', 'магази́н', 'молодо́й', 'мало́'], 0),
      ex.speak('e7', 'Хорошо́, спаси́бо!', 'Gut, danke!'),
    ],
  },

  // ── Kapitel 3: Числа и вещи ─────────────────────────────────────────────
  {
    id: 'l_a0_3_1',
    chapterId: 'c_a0_3',
    title: 'Один, два, три',
    subtitle: 'Zahlen von 1 bis 10',
    minutes: 6,
    xp: 15,
    vocabIds: ['v_odin', 'v_dva', 'v_tri', 'v_chetyre', 'v_pyat', 'v_shest', 'v_sem', 'v_vosem', 'v_devyat', 'v_desyat'],
    exercises: [
      ex.choice('e1', 'Wie sagt man „drei“?', ['три', 'два', 'четы́ре', 'пять'], 0),
      ex.match('e2', 'Ordne die Zahlen zu.', [
        { left: 'оди́н', right: '1' },
        { left: 'пять', right: '5' },
        { left: 'во́семь', right: '8' },
        { left: 'де́сять', right: '10' },
      ]),
      ex.type('e3', 'Schreibe die Zahl 7 auf Russisch.', ['семь'], { hint: 's-e-m mit weichem Zeichen' }),
      ex.listen('e4', 'два ко́фе, пожа́луйста', 'Wie viele Kaffee werden bestellt?', ['Zwei', 'Drei', 'Einen', 'Vier'], 0),
      ex.cloze('e5', 'У меня́ ___ брат. (Ich habe einen Bruder.)', ['оди́н', 'один'], {
        translation: 'Bei männlichen Wörtern steht оди́н.',
      }),
      ex.order('e6', 'Bilde: „Drei Tickets, bitte.“', ['Три', 'биле́та', 'пожа́луйста'], 'Три биле́та, пожа́луйста.', 'Drei Tickets, bitte.'),
    ],
  },
  {
    id: 'l_a0_3_2',
    chapterId: 'c_a0_3',
    title: 'В доме',
    subtitle: 'Dinge im Alltag benennen',
    minutes: 7,
    xp: 15,
    vocabIds: ['v_stul', 'v_dver', 'v_mashina', 'v_dengi', 'v_magazin', 'v_apteka', 'v_yabloko', 'v_chay'],
    exercises: [
      ex.choice('e1', 'Was ist „стул“?', ['Stuhl', 'Tisch', 'Tür', 'Auto'], 0, { stimulus: 'стул' }),
      ex.translate('e2', 'de-ru', 'Apotheke', ['апте́ка', 'аптека']),
      ex.match('e3', 'Was gehört zusammen?', [
        { left: 'дверь', right: 'Tür' },
        { left: 'маши́на', right: 'Auto' },
        { left: 'де́ньги', right: 'Geld' },
        { left: 'я́блоко', right: 'Apfel' },
      ]),
      ex.cloze('e4', 'Я пью ___.', ['чай', 'ча́й'], { translation: 'Ich trinke Tee.' }),
      ex.listen('e5', 'Где магази́н?', 'Wonach fragt die Person?', ['Nach dem Geschäft', 'Nach dem Bahnhof', 'Nach dem Preis', 'Nach dem Wetter'], 0),
      ex.type('e6', 'Schreibe „Geld“ auf Russisch.', ['де́ньги', 'деньги']),
      ex.speak('e7', 'Ско́лько э́то сто́ит?', 'Wie viel kostet das?'),
    ],
  },

  // ── Kapitel 4: Мой день ─────────────────────────────────────────────────
  {
    id: 'l_a1_1_1',
    chapterId: 'c_a1_1',
    title: 'Мой день',
    subtitle: 'Verben im Präsens (я, ты, он/она)',
    minutes: 8,
    xp: 20,
    vocabIds: ['v_rabotat', 'v_govorit', 'v_ponimat', 'v_chitat', 'v_pisat', 'v_slushat', 'v_smotret', 'v_zhit'],
    grammarSlugs: ['verben-praesens'],
    exercises: [
      ex.choice('e1', 'Welche Form ist korrekt? „Я ___ по-ру́сски.“', ['говорю́', 'говори́шь', 'говори́т', 'говори́м'], 0),
      ex.cloze('e2', 'Она́ ___ в ба́нке. (arbeiten)', ['рабо́тает', 'работает'], {
        translation: 'Sie arbeitet bei einer Bank.',
      }),
      ex.match('e3', 'Ordne die Verbformen zu.', [
        { left: 'я чита́ю', right: 'ich lese' },
        { left: 'ты чита́ешь', right: 'du liest' },
        { left: 'он чита́ет', right: 'er liest' },
        { left: 'мы чита́ем', right: 'wir lesen' },
      ]),
      ex.translate('e4', 'de-ru', 'Ich wohne in Berlin.', ['Я живу́ в Берли́не', 'Я живу в Берлине']),
      ex.choice('e5', 'Was bedeutet „Я не понима́ю“?', ['Ich verstehe nicht', 'Ich weiß nicht', 'Ich will nicht', 'Ich lese nicht'], 0),
      ex.listen('e6', 'Я слу́шаю му́зыку.', 'Was macht die Person?', ['Musik hören', 'Musik machen', 'Fernsehen', 'Lesen'], 0),
      ex.order('e7', 'Bilde: „Wir schauen einen Film.“', ['Мы', 'смо́трим', 'фильм'], 'Мы смо́трим фильм.', 'Wir schauen einen Film.'),
    ],
  },
  {
    id: 'l_a1_1_2',
    chapterId: 'c_a1_1',
    title: 'Утро и вечер',
    subtitle: 'Tageszeiten und „хотеть / мочь“',
    minutes: 8,
    xp: 20,
    vocabIds: ['v_utro', 'v_vecher', 'v_segodnya', 'v_zavtra', 'v_seychas', 'v_khotet', 'v_moch', 'v_spat'],
    grammarSlugs: ['verben-praesens'],
    exercises: [
      ex.choice('e1', 'Wie sagt man „morgens“?', ['у́тром', 'ве́чером', 'но́чью', 'днём'], 0, {
        explain: 'Zeitangaben auf -ом: у́тром, днём, ве́чером, но́чью.',
      }),
      ex.cloze('e2', 'Я ___ ко́фе. (ich möchte)', ['хочу́', 'хочу'], { translation: 'Ich möchte einen Kaffee.' }),
      ex.choice('e3', 'Welche Form ist richtig? „Вы ___ мне помо́чь?“', ['мо́жете', 'мо́жет', 'могу́', 'мо́жешь'], 0),
      ex.translate('e4', 'ru-de', 'Сего́дня я до́ма.', ['Heute bin ich zu Hause', 'Heute bin ich zuhause']),
      ex.match('e5', 'Zeitangaben zuordnen.', [
        { left: 'сего́дня', right: 'heute' },
        { left: 'за́втра', right: 'morgen' },
        { left: 'вчера́', right: 'gestern' },
        { left: 'сейча́с', right: 'jetzt' },
      ]),
      ex.listen('e6', 'Он спит.', 'Was tut er?', ['Er schläft', 'Er isst', 'Er liest', 'Er arbeitet'], 0),
      ex.speak('e7', 'Я хочу́ чай, пожа́луйста.', 'Ich möchte Tee, bitte.'),
    ],
  },

  // ── Kapitel 5: В городе ─────────────────────────────────────────────────
  {
    id: 'l_a1_2_1',
    chapterId: 'c_a1_2',
    title: 'Где это?',
    subtitle: 'Nach dem Weg fragen',
    minutes: 8,
    xp: 20,
    vocabIds: ['v_vokzal', 'v_aeroport', 'v_otel', 'v_ulitsa', 'v_gde', 'v_zdes', 'v_tam', 'v_gde_tualet'],
    exercises: [
      ex.choice('e1', 'Wie fragst du „Wo ist der Bahnhof?“', ['Где вокза́л?', 'Когда́ вокза́л?', 'Что вокза́л?', 'Кто вокза́л?'], 0),
      ex.translate('e2', 'de-ru', 'Wo ist die Toilette?', ['Где туале́т?', 'Где туалет?']),
      ex.cloze(
        'e3',
        '— Извини́те, где оте́ль? — ___, на у́лице Ле́нина.',
        ['Там', 'Здесь'],
        { translation: '— Entschuldigung, wo ist das Hotel? — Dort, in der Lenin-Straße.' },
      ),
      ex.match('e4', 'Orte zuordnen.', [
        { left: 'вокза́л', right: 'Bahnhof' },
        { left: 'аэропо́рт', right: 'Flughafen' },
        { left: 'оте́ль', right: 'Hotel' },
        { left: 'у́лица', right: 'Straße' },
      ]),
      ex.listen('e5', 'Как дое́хать до аэропо́рта?', 'Was möchte die Person wissen?', ['Wie man zum Flughafen kommt', 'Wann der Zug fährt', 'Was das Ticket kostet', 'Wo das Hotel ist'], 0),
      ex.order('e6', 'Bilde: „Ich wohne in dieser Straße.“', ['Я', 'живу́', 'на', 'э́той', 'у́лице'], 'Я живу́ на э́той у́лице.', 'Ich wohne in dieser Straße.'),
    ],
  },
  {
    id: 'l_a1_2_2',
    chapterId: 'c_a1_2',
    title: 'В магазине',
    subtitle: 'Preise, Mengen und Bezahlen',
    minutes: 7,
    xp: 18,
    vocabIds: ['v_skolko', 'v_skolko_stoit', 'v_skolko_eto', 'v_magazin', 'v_dengi', 'v_platit', 'v_mozhno_kartoy', 'v_kupit'],
    exercises: [
      ex.choice('e1', 'Wie fragst du nach dem Preis?', ['Ско́лько э́то сто́ит?', 'Где э́то?', 'Когда́ э́то?', 'Кто э́то?'], 0),
      ex.cloze('e2', 'Мо́жно ___ ка́ртой?', ['плати́ть', 'платить'], { translation: 'Kann man mit Karte zahlen?' }),
      ex.translate('e3', 'ru-de', 'Э́то сли́шком до́рого.', ['Das ist zu teuer']),
      ex.match('e4', 'Einkaufen.', [
        { left: 'магази́н', right: 'Geschäft' },
        { left: 'де́ньги', right: 'Geld' },
        { left: 'купи́ть', right: 'kaufen' },
        { left: 'плати́ть', right: 'zahlen' },
      ]),
      ex.listen('e5', 'Ско́лько сто́ит биле́т?', 'Was wird gefragt?', ['Der Preis des Tickets', 'Der Ort des Tickets', 'Die Zeit des Zuges', 'Die Anzahl der Tickets'], 0),
      ex.speak('e6', 'Мо́жно плати́ть ка́ртой?', 'Kann man mit Karte zahlen?'),
    ],
  },

  // ── Kapitel 6: Еда и кафе ───────────────────────────────────────────────
  {
    id: 'l_a1_3_1',
    chapterId: 'c_a1_3',
    title: 'В кафе',
    subtitle: 'Bestellen und höflich fragen',
    minutes: 7,
    xp: 18,
    vocabIds: ['v_kafe', 'v_restoran', 'v_kofe', 'v_chay', 'v_voda', 'v_ya_khochu', 'v_pozhaluysta', 'v_schet_pozhaluysta'],
    exercises: [
      ex.choice('e1', 'Wie bestellst du höflich einen Kaffee?', ['Ко́фе, пожа́луйста', 'Ко́фе, спаси́бо', 'Ко́фе, извини́те', 'Ко́фе, пока́'], 0),
      ex.cloze('e2', 'Я хочу́ ___.', ['во́ду', 'воду'], { translation: 'Ich möchte Wasser. (Akkusativ)' }),
      ex.translate('e3', 'de-ru', 'Die Rechnung, bitte.', ['Счёт, пожа́луйста', 'Счет, пожалуйста']),
      ex.match('e4', 'Im Café.', [
        { left: 'кафе́', right: 'Café' },
        { left: 'рестора́н', right: 'Restaurant' },
        { left: 'чай', right: 'Tee' },
        { left: 'вода́', right: 'Wasser' },
      ]),
      ex.listen('e5', 'Оди́н ко́фе, пожа́луйста.', 'Was wird bestellt?', ['Ein Kaffee', 'Ein Tee', 'Zwei Kaffee', 'Ein Wasser'], 0),
      ex.order('e6', 'Bilde: „Ich möchte Tee, bitte.“', ['Я', 'хочу́', 'чай,', 'пожа́луйста'], 'Я хочу́ чай, пожа́луйста.', 'Ich möchte Tee, bitte.'),
      ex.speak('e7', 'Счёт, пожа́луйста.', 'Die Rechnung, bitte.'),
    ],
  },
  {
    id: 'l_a1_3_2',
    chapterId: 'c_a1_3',
    title: 'Что вы любите?',
    subtitle: 'Vorlieben ausdrücken',
    minutes: 8,
    xp: 20,
    vocabIds: ['v_lyubit', 'v_est', 'v_pit', 'v_myaso', 'v_ryba', 'v_ovoshchi', 'v_frukty', 'v_vkusnyy', 'v_yabloko'],
    grammarSlugs: ['akkusativ'],
    exercises: [
      ex.choice('e1', 'Welcher Satz ist korrekt?', ['Я люблю́ ры́бу.', 'Я люблю́ ры́ба.', 'Я лю́бит ры́бу.', 'Я люблю́ ры́бы.'], 0, {
        explain: 'Nach люби́ть steht der Akkusativ: ры́ба → ры́бу.',
      }),
      ex.cloze('e2', 'Я не ем ___. (Fleisch)', ['мя́со', 'мясо'], { translation: 'Ich esse kein Fleisch.' }),
      ex.translate('e3', 'ru-de', 'О́чень вку́сный суп.', ['Eine sehr leckere Suppe', 'Sehr leckere Suppe']),
      ex.match('e4', 'Lebensmittel.', [
        { left: 'мя́со', right: 'Fleisch' },
        { left: 'ры́ба', right: 'Fisch' },
        { left: 'о́вощи', right: 'Gemüse' },
        { left: 'фру́кты', right: 'Obst' },
      ]),
      ex.listen('e5', 'Я пью чай.', 'Was trinkt die Person?', ['Tee', 'Kaffee', 'Wasser', 'Milch'], 0),
      ex.type('e6', 'Schreibe „lecker“ (männlich) auf Russisch.', ['вку́сный', 'вкусный']),
      ex.speak('e7', 'Я люблю́ ру́сский язы́к.', 'Ich liebe die russische Sprache.'),
    ],
  },
  ...advancedLessons,
];

/* ------------------------------------------------------------- helpers */

export const lessonById: Record<string, Lesson> = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));

export const chapterById: Record<string, Chapter> = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter]));

export const chapterLessons: Record<string, Lesson[]> = Object.fromEntries(
  chapters.map((chapter) => [chapter.id, lessons.filter((lesson) => lesson.chapterId === chapter.id)]),
);

export type LessonStatus = 'done' | 'current' | 'locked';

export interface CourseNode {
  lesson: Lesson;
  chapter: Chapter;
  status: LessonStatus;
  /** 1-based position inside the chapter. */
  indexInChapter: number;
  bestScore: number;
}

export function lessonStatus(lessonId: string, completed: Record<string, { bestScore: number }>): LessonStatus {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return 'locked';
  if (completed[lessonId]) return 'done';
  if (index === 0) return 'current';
  const previous = lessons[index - 1];
  return completed[previous.id] ? 'current' : 'locked';
}

export function buildCourseMap(completed: Record<string, { bestScore: number }>): CourseNode[] {
  return lessons.map((lesson) => {
    const chapter = chapterById[lesson.chapterId];
    const chapterList = chapterLessons[lesson.chapterId] ?? [];
    return {
      lesson,
      chapter,
      status: lessonStatus(lesson.id, completed),
      indexInChapter: chapterList.findIndex((item) => item.id === lesson.id) + 1,
      bestScore: completed[lesson.id]?.bestScore ?? 0,
    };
  });
}

export function nextLesson(completed: Record<string, { bestScore: number }>): Lesson | null {
  return lessons.find((lesson) => !completed[lesson.id] && lessonStatus(lesson.id, completed) === 'current') ?? null;
}

export function lastCompletedLesson(completed: Record<string, { bestScore: number }>): Lesson | null {
  const done = lessons.filter((lesson) => completed[lesson.id]);
  return done.length > 0 ? done[done.length - 1] : null;
}

export function courseProgress(completed: Record<string, { bestScore: number }>): { done: number; total: number; ratio: number } {
  const done = lessons.filter((lesson) => completed[lesson.id]).length;
  return { done, total: lessons.length, ratio: lessons.length === 0 ? 0 : done / lessons.length };
}

export function chapterProgress(chapterId: string, completed: Record<string, { bestScore: number }>) {
  const list = chapterLessons[chapterId] ?? [];
  const done = list.filter((lesson) => completed[lesson.id]).length;
  return { done, total: list.length, ratio: list.length === 0 ? 0 : done / list.length };
}
