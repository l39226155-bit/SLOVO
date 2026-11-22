import type { GrammarTopic } from '@/data/types';
import { advancedGrammar } from '@/data/advanced';

/** Grammar reference with examples and exercises. German explanations. */
export const grammarTopics: GrammarTopic[] = [
  {
    slug: 'personalpronomen',
    level: 'A0',
    title: 'Personalpronomen',
    summary: 'Я, ты, он … – die Grundlage jedes Satzes.',
    minutes: 5,
    sections: [
      {
        heading: 'Die Pronomen im Nominativ',
        body:
          'Russische Personalpronomen entsprechen weitgehend den deutschen. Wichtig: „вы“ ist sowohl die Höflichkeitsform (Sie) als auch die Mehrzahl von „ты“ (ihr).',
        table: {
          head: ['Russisch', 'Deutsch', 'Aussprache'],
          rows: [
            ['я', 'ich', 'ja'],
            ['ты', 'du', 'ty'],
            ['он / она́ / оно́', 'er / sie / es', 'on / aná / anó'],
            ['мы', 'wir', 'my'],
            ['вы', 'Sie / ihr', 'vy'],
            ['они́', 'sie (Plural)', 'aní'],
          ],
        },
      },
      {
        heading: 'Kein „sein“ im Präsens',
        body:
          'Im Russischen fehlt das Verb „sein“ in der Gegenwart. „Ich bin Student“ heißt einfach „Я студе́нт.“ – wörtlich „ich Student“. Das gilt auch für Ortsangaben: „Он до́ма“ = „Er ist zu Hause“.',
        examples: [
          { ru: 'Я из Герма́нии.', de: 'Ich bin aus Deutschland.' },
          { ru: 'Она́ учи́тельница.', de: 'Sie ist Lehrerin.' },
          { ru: 'Мы до́ма.', de: 'Wir sind zu Hause.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: 'Welches Pronomen bedeutet „wir“?',
        options: ['мы', 'вы', 'они́', 'ты'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Wie sagt man „Sie sind Student“ (höflich, ohne Verb)?',
        options: ['Вы студе́нт.', 'Ты студе́нт.', 'Мы студе́нт.', 'Он студе́нт.'],
        answer: 0,
        explain: 'Höflichkeitsform ist „вы“; das Verb „sein“ entfällt im Präsens.',
      },
      {
        kind: 'cloze',
        id: 'g3',
        sentence: '___ до́ма. (Wir sind zu Hause.)',
        answers: ['Мы', 'мы'],
      },
    ],
  },
  {
    slug: 'substantive-genus',
    level: 'A0',
    title: 'Substantive und Geschlecht',
    summary: 'Drei Genera – erkennbar an der Endung.',
    minutes: 6,
    sections: [
      {
        heading: 'Die Endungen verraten das Geschlecht',
        body:
          'Russisch kennt drei Geschlechter. Die Endung im Nominativ Singular gibt meist den Ausschlag. Ausnahmen lernt man mit dem Wort.',
        table: {
          head: ['Genus', 'Typische Endung', 'Beispiel'],
          rows: [
            ['maskulin', 'Konsonant, -й', 'дом, чай'],
            ['feminin', '-а, -я', 'кни́га, семья́'],
            ['neutrum', '-о, -е', 'окно́, мо́ре'],
            ['Sonderfall', '-ь', 'день (m), ночь (f)'],
          ],
        },
      },
      {
        heading: 'Warum das wichtig ist',
        body:
          'Adjektive, Pronomen und die Vergangenheitsform richten sich nach dem Geschlecht: „но́вый дом“ (m), „но́вая кни́га“ (f), „но́вое окно́“ (n).',
        examples: [
          { ru: 'Э́то но́вый дом.', de: 'Das ist ein neues Haus.' },
          { ru: 'Э́то но́вая кни́га.', de: 'Das ist ein neues Buch.' },
          { ru: 'Э́то но́вое окно́.', de: 'Das ist ein neues Fenster.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: 'Welches Geschlecht hat „кни́га“?',
        options: ['feminin', 'maskulin', 'neutrum', 'kein Geschlecht'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Welche Form ist korrekt?',
        options: ['но́вая кни́га', 'но́вый кни́га', 'но́вое кни́га', 'но́вые кни́га'],
        answer: 0,
        explain: 'кни́га ist feminin → Adjektiv auf -ая.',
      },
      {
        kind: 'cloze',
        id: 'g3',
        sentence: 'Э́то ___ окно́. (neu)',
        answers: ['но́вое', 'новое'],
      },
    ],
  },
  {
    slug: 'plural',
    level: 'A0',
    title: 'Singular und Plural',
    summary: 'Mehrzahl bilden: -ы/-и, -а/-я.',
    minutes: 6,
    sections: [
      {
        heading: 'Die Grundregeln',
        body:
          'Maskuline und feminine Wörter bekommen im Plural -ы oder -и, neutrale -а oder -я. Nach г, к, х, ж, ш, щ, ч schreibt man immer -и (Schreibregel, nicht Ausspracheregel).',
        table: {
          head: ['Singular', 'Plural', 'Deutsch'],
          rows: [
            ['стол', 'столы́', 'Tisch → Tische'],
            ['кни́га', 'кни́ги', 'Buch → Bücher'],
            ['окно́', 'о́кна', 'Fenster → Fenster'],
            ['друг', 'друзья́', 'Freund → Freunde'],
          ],
        },
      },
      {
        heading: 'Unregelmäßige und Sonderfälle',
        body:
          'Einige häufige Wörter ändern den Stamm: человек → лю́ди, ребёнок → де́ти, друг → друзья́. Nach 2, 3, 4 steht der Genitiv Singular (два стола́), nach 5 und mehr der Genitiv Plural (пять столо́в).',
        examples: [
          { ru: 'Три биле́та, пожа́луйста.', de: 'Drei Tickets, bitte.' },
          { ru: 'Пять мину́т.', de: 'Fünf Minuten.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: 'Wie lautet der Plural von „кни́га“?',
        options: ['кни́ги', 'кни́гы', 'кни́га', 'кни́го'],
        answer: 0,
      },
      {
        kind: 'cloze',
        id: 'g2',
        sentence: 'Здесь четы́ре ___. (стул)',
        answers: ['сту́ла', 'стула'],
        explain: 'Nach 2–4 steht der Genitiv Singular: четы́ре сту́ла.',
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Wie sagt man „fünf Minuten“?',
        options: ['пять мину́т', 'пять мину́ты', 'пять мину́та', 'пять мину́той'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'verben-praesens',
    level: 'A1',
    title: 'Verbkonjugation im Präsens',
    summary: 'Zwei große Konjugationen und ihre Endungen.',
    minutes: 8,
    sections: [
      {
        heading: 'Die erste Konjugation (-ешь-Typ)',
        body:
          'Verben auf -ать/-ять wie чита́ть, де́лать, рабо́тать nehmen die Endungen -ю/-у, -ешь, -ет, -ем, -ете, -ют. Der Stamm bleibt gleich.',
        table: {
          head: ['Person', 'чита́ть (lesen)', 'рабо́тать (arbeiten)'],
          rows: [
            ['я', 'чита́ю', 'рабо́таю'],
            ['ты', 'чита́ешь', 'рабо́таешь'],
            ['он/она́', 'чита́ет', 'рабо́тает'],
            ['мы', 'чита́ем', 'рабо́таем'],
            ['вы', 'чита́ете', 'рабо́таете'],
            ['они́', 'чита́ют', 'рабо́тают'],
          ],
        },
      },
      {
        heading: 'Die zweite Konjugation (-ишь-Typ)',
        body:
          'Verben auf -ить wie говори́ть, люби́ть, смотре́ть nehmen -ю/-у, -ишь, -ит, -им, -ите, -ят. Bei einigen ändert sich der Stamm: люби́ть → люблю́.',
        table: {
          head: ['Person', 'говори́ть (sprechen)'],
          rows: [
            ['я', 'говорю́'],
            ['ты', 'говори́шь'],
            ['он/она́', 'говори́т'],
            ['мы', 'говори́м'],
            ['вы', 'говори́те'],
            ['они́', 'говоря́т'],
          ],
        },
      },
      {
        heading: 'Unregelmäßige Klassiker',
        body:
          'хоте́ть (wollen) mischt beide Typen: хочу́, хо́чешь, хо́чет, хоти́м, хоти́те, хотя́т. мо́чь (können): могу́, мо́жешь, мо́жет, мо́жем, мо́жете, мо́гут.',
        examples: [
          { ru: 'Я хочу́ ко́фе.', de: 'Ich möchte einen Kaffee.' },
          { ru: 'Вы мо́жете мне помо́чь?', de: 'Können Sie mir helfen?' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: '„ты говори́ть“ → welche Form?',
        options: ['говори́шь', 'говори́ет', 'говори́ю', 'говори́м'],
        answer: 0,
      },
      {
        kind: 'cloze',
        id: 'g2',
        sentence: 'Мы ___ фильм. (смотре́ть)',
        answers: ['смо́трим', 'смотрим'],
      },
      {
        kind: 'cloze',
        id: 'g3',
        sentence: 'Они́ ___ по-ру́сски. (говори́ть)',
        answers: ['говоря́т', 'говорят'],
      },
      {
        kind: 'choice',
        id: 'g4',
        prompt: 'Welche Form von „хоте́ть“ passt: „Он ___ чай.“',
        options: ['хо́чет', 'хочу́', 'хоти́м', 'хотя́т'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'vergangenheit',
    level: 'A1',
    title: 'Vergangenheit',
    summary: 'Eine Form für alle – mit Genus im Singular.',
    minutes: 7,
    sections: [
      {
        heading: 'Bildung mit -л',
        body:
          'Die Vergangenheit wird aus dem Infinitivstamm + -л gebildet. Im Singular richtet sie sich nach dem Genus: он чита́л, она́ чита́ла, оно́ чита́ло; im Plural steht immer -ли.',
        table: {
          head: ['Subjekt', 'Form', 'Beispiel'],
          rows: [
            ['он / я (m)', '-л', 'чита́л'],
            ['она́ / я (f)', '-ла', 'чита́ла'],
            ['оно́', '-ло', 'чита́ло'],
            ['мы / вы / они́', '-ли', 'чита́ли'],
          ],
        },
      },
      {
        heading: '„Sein“ in der Vergangenheit',
        body:
          'быть bildet unregelmäßig: был (m), была́ (f), бы́ло (n), бы́ли (Pl.). Es wird gebraucht, wenn es kein anderes Verb gibt.',
        examples: [
          { ru: 'Вчера́ я был до́ма.', de: 'Gestern war ich zu Hause.' },
          { ru: 'Она́ была́ в Москве́.', de: 'Sie war in Moskau.' },
          { ru: 'Мы бы́ли в кафе́.', de: 'Wir waren im Café.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: '„Она́ чита́ть“ in der Vergangenheit?',
        options: ['чита́ла', 'чита́л', 'чита́ли', 'чита́ло'],
        answer: 0,
      },
      {
        kind: 'cloze',
        id: 'g2',
        sentence: 'Вчера́ мы ___ в теа́тре. (быть)',
        answers: ['бы́ли', 'были'],
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Welcher Satz ist korrekt?',
        options: ['Он рабо́тал в ба́нке.', 'Он рабо́тала в ба́нке.', 'Он рабо́тали в ба́нке.', 'Он рабо́тало в ба́нке.'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'faelle-ueberblick',
    level: 'A1',
    title: 'Die sechs Fälle im Überblick',
    summary: 'Nominativ, Genitiv, Dativ, Akkusativ, Instrumental, Präpositional.',
    minutes: 9,
    sections: [
      {
        heading: 'Wozu Fälle?',
        body:
          'Russisch markiert die Rolle eines Wortes im Satz durch die Endung, nicht durch die Wortstellung. Deshalb kann „Ма́ма лю́бит дочь“ und „Дочь лю́бит ма́му“ völlig Unterschiedliches bedeuten. Lerne jeden Fall mit seiner Leitfrage.',
        table: {
          head: ['Fall', 'Frage', 'кни́га (f)', 'стол (m)'],
          rows: [
            ['Nominativ', 'кто? что?', 'кни́га', 'стол'],
            ['Genitiv', 'кого? чего?', 'кни́ги', 'стола́'],
            ['Dativ', 'кому? чему?', 'кни́ге', 'столу́'],
            ['Akkusativ', 'кого? что?', 'кни́гу', 'стол'],
            ['Instrumental', 'кем? чем?', 'кни́гой', 'столо́м'],
            ['Präpositional', 'о ком? о чём?', 'о кни́ге', 'о столе́'],
          ],
        },
      },
      {
        heading: 'Merksatz',
        body:
          'Die Reihenfolge der Fälle im Russischen ist: Имени́тельный, Роди́тельный, Да́тельный, Вини́тельный, Твори́тельный, Предло́жный. In Wörterbüchern stehen die Fälle in dieser Ordnung.',
        examples: [
          { ru: 'Я чита́ю кни́гу.', de: 'Ich lese ein Buch. (Akkusativ)' },
          { ru: 'Я говорю́ о кни́ге.', de: 'Ich spreche über ein Buch. (Präpositional)' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: 'Welcher Fall beantwortet die Frage „кому?“ (wem)?',
        options: ['Dativ', 'Genitiv', 'Akkusativ', 'Instrumental'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'In welchem Fall steht „кни́гу“ in „Я чита́ю кни́гу“?',
        options: ['Akkusativ', 'Nominativ', 'Dativ', 'Präpositional'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Wie viele Fälle hat das Russische?',
        options: ['sechs', 'vier', 'fünf', 'sieben'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'akkusativ',
    level: 'A1',
    title: 'Der Akkusativ (Вини́тельный)',
    summary: 'Das direkte Objekt – und das Ziel einer Bewegung.',
    minutes: 8,
    sections: [
      {
        heading: 'Endungen',
        body:
          'Feminine Wörter auf -а/-я werden zu -у/-ю. Maskuline Wörter bleiben bei unbelebten Dingen unverändert, bei Personen übernehmen sie die Genitivform. Neutrale Wörter bleiben gleich.',
        table: {
          head: ['Genus', 'Nominativ', 'Akkusativ'],
          rows: [
            ['feminin', 'кни́га', 'кни́гу'],
            ['maskulin (Sache)', 'стол', 'стол'],
            ['maskulin (Person)', 'друг', 'дру́га'],
            ['neutrum', 'окно́', 'окно́'],
            ['Plural', 'кни́ги', 'кни́ги'],
          ],
        },
      },
      {
        heading: 'Bewegung mit в / на',
        body:
          'в und на stehen mit Akkusativ, wenn eine Richtung gemeint ist („wohin?“), mit Präpositional bei einem Ort („wo?“).',
        examples: [
          { ru: 'Я иду́ в шко́лу.', de: 'Ich gehe in die Schule. (wohin?)' },
          { ru: 'Я в шко́ле.', de: 'Ich bin in der Schule. (wo?)' },
          { ru: 'Я люблю́ ры́бу.', de: 'Ich mag Fisch.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'cloze',
        id: 'g1',
        sentence: 'Я чита́ю ___. (кни́га)',
        answers: ['кни́гу', 'книгу'],
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Welcher Satz ist korrekt?',
        options: ['Я иду́ в шко́лу.', 'Я иду́ в шко́ле.', 'Я иду́ в шко́ла.', 'Я иду́ в шко́лой.'],
        answer: 0,
        explain: 'Bewegung wohin → Akkusativ: шко́ла → шко́лу.',
      },
      {
        kind: 'cloze',
        id: 'g3',
        sentence: 'Он ви́дит ___. (А́нна)',
        answers: ['А́нну', 'Анну'],
      },
    ],
  },
  {
    slug: 'genitiv',
    level: 'A1',
    title: 'Der Genitiv (Роди́тельный)',
    summary: 'Besitz, Fehlen und Mengen.',
    minutes: 8,
    sections: [
      {
        heading: 'Endungen',
        body:
          'Maskulin und neutrum nehmen -а/-я, feminin -ы/-и. Nach den Zischlauten und к, г, х steht -и.',
        table: {
          head: ['Genus', 'Nominativ', 'Genitiv'],
          rows: [
            ['maskulin', 'стол', 'стола́'],
            ['maskulin', 'друг', 'дру́га'],
            ['feminin', 'кни́га', 'кни́ги'],
            ['feminin', 'семья́', 'семьи́'],
            ['neutrum', 'окно́', 'окна́'],
          ],
        },
      },
      {
        heading: 'Typische Verwendungen',
        body:
          'Genitiv steht nach „нет“ (es gibt nicht), nach Mengenwörtern und nach den Präpositionen из (aus), с (von), от (von), без (ohne), для (für), у (bei).',
        examples: [
          { ru: 'У меня́ нет вре́мени.', de: 'Ich habe keine Zeit.' },
          { ru: 'Он из Герма́нии.', de: 'Er kommt aus Deutschland.' },
          { ru: 'Ча́шка ча́я, пожа́луйста.', de: 'Eine Tasse Tee, bitte.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'cloze',
        id: 'g1',
        sentence: 'У меня́ нет ___. (де́ньги)',
        answers: ['де́нег', 'денег'],
        explain: 'де́ньги ist ein Pluralwort: Genitiv Plural де́нег.',
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Welcher Satz ist korrekt?',
        options: ['Он из Герма́нии.', 'Он из Герма́ния.', 'Он из Герма́нию.', 'Он из Герма́нией.'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Welche Präposition verlangt den Genitiv?',
        options: ['без', 'в', 'на', 'о'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'dativ',
    level: 'A1',
    title: 'Der Dativ (Да́тельный)',
    summary: 'Wem? – Empfänger, helfen, gefallen.',
    minutes: 7,
    sections: [
      {
        heading: 'Endungen',
        body: 'Maskulin und neutrum nehmen -у/-ю, feminin -е (bzw. -и nach -ия, -ья).',
        table: {
          head: ['Genus', 'Nominativ', 'Dativ'],
          rows: [
            ['maskulin', 'друг', 'дру́гу'],
            ['feminin', 'кни́га', 'кни́ге'],
            ['feminin', 'А́нна', 'А́нне'],
            ['Plural', 'друзья́', 'друзья́м'],
          ],
        },
      },
      {
        heading: 'Pronomen und typische Verben',
        body:
          'Die Dativpronomen lauten мне, тебе́, ему́, ей, нам, вам, им. Verben wie помога́ть (helfen), нра́виться (gefallen) und говори́ть кому́-то (zu jemandem sprechen) verlangen den Dativ.',
        examples: [
          { ru: 'Помоги́те мне, пожа́луйста.', de: 'Helfen Sie mir bitte.' },
          { ru: 'Мне нра́вится э́тот го́род.', de: 'Mir gefällt diese Stadt.' },
          { ru: 'Я звоню́ ма́ме.', de: 'Ich rufe Mama an.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'cloze',
        id: 'g1',
        sentence: 'Я помога́ю ___. (А́нна)',
        answers: ['А́нне', 'Анне'],
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Wie sagt man „Mir gefällt die Stadt“?',
        options: ['Мне нра́вится го́род.', 'Я нра́влюсь го́род.', 'Меня́ нра́вится го́род.', 'Мной нра́вится го́род.'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Welche Dativform von „ты“ ist korrekt?',
        options: ['тебе́', 'тебя́', 'тобо́й', 'ты'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'instrumental',
    level: 'A1',
    title: 'Der Instrumental (Твори́тельный)',
    summary: 'Womit? – Werkzeug, Begleitung, Beruf.',
    minutes: 8,
    sections: [
      {
        heading: 'Endungen',
        body:
          'Maskulin und neutrum nehmen -ом/-ем, feminin -ой/-ей. Nach Zischlauten steht bei Betonung der Endung -о́й, sonst -ей.',
        table: {
          head: ['Genus', 'Nominativ', 'Instrumental'],
          rows: [
            ['maskulin', 'стол', 'столо́м'],
            ['maskulin', 'учи́тель', 'учи́телем'],
            ['feminin', 'кни́га', 'кни́гой'],
            ['feminin', 'семья́', 'семьёй'],
            ['Plural', 'друзья́', 'друзья́ми'],
          ],
        },
      },
      {
        heading: 'Wofür man ihn braucht',
        body:
          'Der Instrumental steht nach „с“ (mit), bei Werkzeugen und Verkehrsmitteln (е́хать по́ездом) und nach „быть“ bei Berufen in der Vergangenheit/Zukunft.',
        examples: [
          { ru: 'Я пью чай с молоко́м.', de: 'Ich trinke Tee mit Milch.' },
          { ru: 'Он рабо́тает врачо́м.', de: 'Er arbeitet als Arzt.' },
          { ru: 'Я пишу́ ру́чкой.', de: 'Ich schreibe mit einem Stift.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'cloze',
        id: 'g1',
        sentence: 'Я пью чай с ___. (молоко́)',
        answers: ['молоко́м', 'молоком'],
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Welche Form ist Instrumental von „кни́га“?',
        options: ['кни́гой', 'кни́гу', 'кни́ге', 'кни́ги'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: '„Er arbeitet als Lehrer“ – welcher Fall steht nach рабо́тать?',
        options: ['Instrumental', 'Akkusativ', 'Dativ', 'Genitiv'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'praepositional',
    level: 'A1',
    title: 'Der Präpositional (Предло́жный)',
    summary: 'Worüber? Wo? – nur mit Präposition.',
    minutes: 7,
    sections: [
      {
        heading: 'Endungen und Regeln',
        body:
          'Der Präpositional steht nie allein, sondern immer nach einer Präposition – meist в, на oder о. Die Endung ist fast immer -е, nach -ия/-ие/-ья wird daraus -и.',
        table: {
          head: ['Genus', 'Nominativ', 'Präpositional'],
          rows: [
            ['maskulin', 'стол', 'на столе́'],
            ['feminin', 'кни́га', 'о кни́ге'],
            ['neutrum', 'окно́', 'в окне́'],
            ['feminin auf -ия', 'Росси́я', 'в Росси́и'],
          ],
        },
      },
      {
        heading: 'Ort statt Richtung',
        body:
          'в/на + Präpositional beantwortet „wo?“. Für „wohin?“ steht der Akkusativ. Vergleiche: „Я в шко́ле“ (ich bin in der Schule) vs. „Я иду́ в шко́лу“ (ich gehe in die Schule).',
        examples: [
          { ru: 'Мы говори́м о рабо́те.', de: 'Wir sprechen über die Arbeit.' },
          { ru: 'Кни́га на столе́.', de: 'Das Buch liegt auf dem Tisch.' },
          { ru: 'Он живёт в Москве́.', de: 'Er lebt in Moskau.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'cloze',
        id: 'g1',
        sentence: 'Кни́га на ___. (стол)',
        answers: ['столе́', 'столе'],
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Welcher Satz bedeutet „Ich bin in der Schule“?',
        options: ['Я в шко́ле.', 'Я в шко́лу.', 'Я иду́ в шко́лу.', 'Я из шко́лы.'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Welche Präposition steht NICHT mit dem Präpositional?',
        options: ['без', 'в', 'на', 'о'],
        answer: 0,
        explain: 'без verlangt den Genitiv.',
      },
    ],
  },
  {
    slug: 'adjektive',
    level: 'A1',
    title: 'Adjektive',
    summary: 'Endungen richten sich nach Genus, Zahl und Fall.',
    minutes: 8,
    sections: [
      {
        heading: 'Nominativ: die vier Formen',
        body:
          'Im Nominativ hat jedes Adjektiv vier Formen. Bei harten Stämmen: -ый/-ой (m), -ая (f), -ое (n), -ые (Pl.). Bei weichen Stämmen: -ий, -яя, -ее, -ие.',
        table: {
          head: ['Genus', 'но́вый (neu)', 'си́ний (blau)'],
          rows: [
            ['maskulin', 'но́вый дом', 'си́ний дом'],
            ['feminin', 'но́вая кни́га', 'си́няя кни́га'],
            ['neutrum', 'но́вое окно́', 'си́нее окно́'],
            ['Plural', 'но́вые дома́', 'си́ние дома́'],
          ],
        },
      },
      {
        heading: 'Kurzformen',
        body:
          'Prädikativ (nach „sein“) steht oft die Kurzform: дом большо́й, кни́га интере́сна, э́то вку́сно. Umgangssprachlich hört man aber auch die Langform.',
        examples: [
          { ru: 'Э́то о́чень вку́сно.', de: 'Das ist sehr lecker.' },
          { ru: 'Го́род краси́вый.', de: 'Die Stadt ist schön.' },
        ],
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: 'Welche Form passt zu „окно́“?',
        options: ['но́вое', 'но́вый', 'но́вая', 'но́вые'],
        answer: 0,
      },
      {
        kind: 'cloze',
        id: 'g2',
        sentence: 'Э́то ___ кни́га. (интере́сный)',
        answers: ['интере́сная', 'интересная'],
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Wie sagt man „schöne Stadt“?',
        options: ['краси́вый го́род', 'краси́вая го́род', 'краси́вое го́род', 'краси́вые го́род'],
        answer: 0,
      },
    ],
  },
  {
    slug: 'verben-aspekt',
    level: 'A1',
    title: 'Verbaspekt',
    summary: 'Unvollendet oder vollendet – eine russische Besonderheit.',
    minutes: 9,
    sections: [
      {
        heading: 'Zwei Verben für eine Handlung',
        body:
          'Fast jedes russische Verb existiert als Paar: imperfektiv (unvollendet, Verlauf/Wiederholung) und perfektiv (vollendet, Ergebnis). Deutsch hat dafür oft keine Entsprechung – deshalb muss man das Paar mitlernen.',
        table: {
          head: ['imperfektiv', 'perfektiv', 'Bedeutung'],
          rows: [
            ['чита́ть', 'прочита́ть', 'lesen / zu Ende lesen'],
            ['де́лать', 'сде́лать', 'machen / fertig machen'],
            ['покупа́ть', 'купи́ть', 'kaufen / einkaufen'],
            ['писа́ть', 'написа́ть', 'schreiben / fertig schreiben'],
          ],
        },
      },
      {
        heading: 'Wann welcher Aspekt?',
        body:
          'Imperfektiv: Prozess („Я чита́л кни́гу“ – ich las), Wiederholung („Я чита́ю ка́ждый день“), nach „нача́ть/продолжа́ть“. Perfektiv: einmaliges Ergebnis („Я прочита́л кни́гу“ – ich habe sie durchgelesen), Zukunft mit Ergebnis („Я прочита́ю“).',
        examples: [
          { ru: 'Я чита́л э́ту кни́гу.', de: 'Ich habe an diesem Buch gelesen.' },
          { ru: 'Я прочита́л э́ту кни́гу.', de: 'Ich habe dieses Buch (fertig) gelesen.' },
        ],
      },
      {
        heading: 'Perfektiv hat kein Präsens',
        body:
          'Perfektive Verben können keine Gegenwart ausdrücken – ihre „Präsensformen“ bedeuten Zukunft: „Я прочита́ю“ = „ich werde lesen/fertig lesen“.',
      },
    ],
    exercises: [
      {
        kind: 'choice',
        id: 'g1',
        prompt: 'Welches Verb ist perfektiv?',
        options: ['прочита́ть', 'чита́ть', 'писа́ть', 'говори́ть'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: '„Ich habe das Buch fertig gelesen“ – welches Verb?',
        options: ['прочита́л', 'чита́л', 'чита́ю', 'чита́ть'],
        answer: 0,
      },
      {
        kind: 'cloze',
        id: 'g3',
        sentence: 'Вчера́ я ___ хлеб. (купи́ть, Ergebnis)',
        answers: ['купи́л', 'купил'],
      },
    ],
  },
  {
    slug: 'satzstellung',
    level: 'A1',
    title: 'Satzstellung und Fragen',
    summary: 'Flexibel – aber nicht beliebig.',
    minutes: 6,
    sections: [
      {
        heading: 'Grundordnung',
        body:
          'Die neutrale Reihenfolge ist Subjekt – Prädikat – Objekt: „Я чита́ю кни́гу“. Weil die Fälle die Rolle markieren, kann man umstellen, um zu betonen: „Кни́гу я чита́ю“ (das Buch – das lese ich).',
      },
      {
        heading: 'Fragen ohne Hilfsverb',
        body:
          'Ja/Nein-Fragen entstehen nur durch Intonation oder Umstellung: „Ты говори́шь по-ру́сски?“ W-Fragen beginnen mit dem Fragewort: „Где вокза́л?“ – kein „do“ wie im Englischen, kein Hilfsverb.',
        examples: [
          { ru: 'Ты говори́шь по-ру́сски?', de: 'Sprichst du Russisch?' },
          { ru: 'Где вокза́л?', de: 'Wo ist der Bahnhof?' },
          { ru: 'Он не понима́ет.', de: 'Er versteht nicht.' },
        ],
      },
      {
        heading: 'Verneinung',
        body:
          'Die Verneinung ist einfach „не“ direkt vor dem Verb. Doppelte Verneinung ist im Russischen korrekt: „Я никогда́ не был в Москве́.“',
      },
    ],
    exercises: [
      {
        kind: 'order',
        id: 'g1',
        prompt: 'Bilde den Satz: „Ich lese ein Buch.“',
        words: ['Я', 'чита́ю', 'кни́гу'],
        answer: 'Я чита́ю кни́гу.',
        translation: 'Ich lese ein Buch.',
      },
      {
        kind: 'choice',
        id: 'g2',
        prompt: 'Wie verneint man „Он понима́ет“?',
        options: ['Он не понима́ет.', 'Он понима́ет не.', 'Не он понима́ет.', 'Он нет понима́ет.'],
        answer: 0,
      },
      {
        kind: 'choice',
        id: 'g3',
        prompt: 'Welches Wort fehlt in „___ ты живёшь?“ (Wo wohnst du?)',
        options: ['Где', 'Кто', 'Что', 'Когда́'],
        answer: 0,
      },
    ],
  },
  ...advancedGrammar,
];

export const grammarBySlug: Record<string, GrammarTopic> = Object.fromEntries(
  grammarTopics.map((topic) => [topic.slug, topic]),
);

export function getGrammar(slug: string): GrammarTopic | undefined {
  return grammarBySlug[slug];
}

/** Case topics in teaching order, used for the grammar overview. */
export const caseTopics = ['faelle-ueberblick', 'akkusativ', 'genitiv', 'dativ', 'instrumental', 'praepositional'];
