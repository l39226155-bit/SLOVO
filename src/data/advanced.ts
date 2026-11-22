import type { Chapter, Exercise, GrammarTopic, Lesson, Vocab } from '@/data/types';

/**
 * A2–C1 extension of the course. Same schema as the base course, so lessons,
 * SRS cards, dictionary entries and statistics work without special cases.
 */

const v = (
  id: string,
  ru: string,
  de: string,
  transcription: string,
  type: Vocab['type'],
  level: Vocab['level'],
  exampleRu: string,
  exampleDe: string,
  extra: { gender?: Vocab['gender']; grammar?: string; tags?: string[] } = {},
): Vocab => ({
  id,
  ru,
  de,
  transcription,
  type,
  level,
  example: { ru: exampleRu, de: exampleDe },
  gender: extra.gender,
  grammar: extra.grammar,
  tags: extra.tags,
});

export const advancedVocab: Vocab[] = [
  // A2 · Reisen
  v('v_poezd', 'по́езд', 'Zug', 'pójest', 'noun', 'A2', 'По́езд отхо́дит в во́семь.', 'Der Zug fährt um acht ab.', { gender: 'm', grammar: 'pl. поезда́', tags: ['reisen'] }),
  v('v_bilet', 'биле́т', 'Fahrkarte', 'biljét', 'noun', 'A2', 'Оди́н биле́т до Москвы́, пожа́луйста.', 'Eine Fahrkarte nach Moskau, bitte.', { gender: 'm', grammar: 'pl. биле́ты', tags: ['reisen'] }),
  v('v_platforma', 'платфо́рма', 'Bahnsteig', 'platfórma', 'noun', 'A2', 'По́езд стои́т у тре́тьей платфо́рмы.', 'Der Zug steht an Bahnsteig drei.', { gender: 'f', grammar: 'pl. платфо́рмы', tags: ['reisen'] }),
  v('v_opazdyvat', 'опа́здывать', 'sich verspäten', 'apázdywat’', 'verb', 'A2', 'Я никогда́ не опа́здываю на по́езд.', 'Ich verspäte mich nie zum Zug.', { grammar: 'na + Akk.; я опа́здываю', tags: ['reisen'] }),
  v('v_raspisanie', 'расписа́ние', 'Fahrplan', 'raspisánije', 'noun', 'A2', 'Расписа́ние виси́т на ста́нции.', 'Der Fahrplan hängt im Bahnhof.', { gender: 'n', grammar: 'pl. расписа́ния', tags: ['reisen'] }),

  // A2 · Gesundheit
  v('v_bolno', 'бо́льно', 'es tut weh', 'ból’na', 'adverb', 'A2', 'У меня́ бо́льно в груди́.', 'Es tut mir in der Brust weh.', { tags: ['gesundheit'] }),
  v('v_temperatura', 'температу́ра', 'Fieber / Temperatur', 'temperatúra', 'noun', 'A2', 'У меня́ температу́ра три́дцать во́семь.', 'Ich habe 38 Grad Fieber.', { gender: 'f', tags: ['gesundheit'] }),
  v('v_lekarstvo', 'лека́рство', 'Medikament', 'lekárstva', 'noun', 'A2', 'Принима́йте лека́рство по́сле еды́.', 'Nehmen Sie das Medikament nach dem Essen.', { gender: 'n', grammar: 'pl. лека́рства', tags: ['gesundheit'] }),
  v('v_kashel', 'ка́шель', 'Husten', 'kášel’', 'noun', 'A2', 'У ребёнка си́льный ка́шель.', 'Das Kind hat starken Husten.', { gender: 'm', tags: ['gesundheit'] }),
  v('v_zdorove', 'здоро́вье', 'Gesundheit', 'zdaróv’je', 'noun', 'A2', 'Здоро́вье ва́жнее де́нег.', 'Gesundheit ist wichtiger als Geld.', { gender: 'n', tags: ['gesundheit'] }),

  // B1 · Arbeit
  v('v_opyit', 'о́пыт', 'Erfahrung', 'ópyt', 'noun', 'B1', 'У меня́ три го́да о́пыта в э́той сфе́ре.', 'Ich habe drei Jahre Erfahrung in diesem Bereich.', { gender: 'm', tags: ['arbeit'] }),
  v('v_sobesedovanie', 'собесе́дование', 'Vorstellungsgespräch', 'sabesédavanije', 'noun', 'B1', 'За́втра у меня́ собесе́дование.', 'Morgen habe ich ein Vorstellungsgespräch.', { gender: 'n', tags: ['arbeit'] }),
  v('v_rezyume', 'резюме́', 'Lebenslauf', 'rezjumɛ́', 'noun', 'B1', 'Отпра́вьте резюме́ по электро́нной по́чте.', 'Senden Sie den Lebenslauf per E-Mail.', { gender: 'n', grammar: 'indeklinabel', tags: ['arbeit'] }),
  v('v_navyik', 'на́вык', 'Fähigkeit / Fertigkeit', 'návyk', 'noun', 'B1', 'Э́тот на́вык ну́жен ка́ждый день.', 'Diese Fähigkeit braucht man jeden Tag.', { gender: 'm', grammar: 'pl. на́выки', tags: ['arbeit'] }),
  v('v_otvetstvennost', 'отве́тственность', 'Verantwortung', 'atvétstvennas’t’', 'noun', 'B1', 'Он несёт отве́тственность за прое́кт.', 'Er trägt die Verantwortung für das Projekt.', { gender: 'f', tags: ['arbeit'] }),

  // B1 · Meinung
  v('v_mnenie', 'мне́ние', 'Meinung', 'mnjénije', 'noun', 'B1', 'У меня́ друго́е мне́ние.', 'Ich habe eine andere Meinung.', { gender: 'n', grammar: 'pl. мне́ния', tags: ['diskussion'] }),
  v('v_soglasen', 'согла́сен', 'einverstanden', 'saglásen', 'adjective', 'B1', 'Я согла́сен с твои́м аргуме́нтом.', 'Ich stimme deinem Argument zu.', { grammar: 'f. согла́сна, pl. согла́сны', tags: ['diskussion'] }),
  v('v_vozrazhat', 'возража́ть', 'widersprechen', 'vazražát’', 'verb', 'B1', 'Я не хочу́ возража́ть без причины́.', 'Ich möchte nicht ohne Grund widersprechen.', { grammar: 'я возража́ю', tags: ['diskussion'] }),
  v('v_argument', 'аргуме́нт', 'Argument', 'argumjént', 'noun', 'B1', 'Э́тот аргуме́нт меня́ убеди́л.', 'Dieses Argument hat mich überzeugt.', { gender: 'm', tags: ['diskussion'] }),
  v('v_kompromiss', 'компроми́сс', 'Kompromiss', 'kampramíss', 'noun', 'B1', 'Мы нашли́ компроми́сс.', 'Wir haben einen Kompromiss gefunden.', { gender: 'm', tags: ['diskussion'] }),

  // B2 · Medien
  v('v_istochnik', 'исто́чник', 'Quelle', 'istóčnik', 'noun', 'B2', 'Проверя́йте исто́чник информа́ции.', 'Prüfen Sie die Quelle der Information.', { gender: 'm', tags: ['medien'] }),
  v('v_dostoverny', 'достове́рный', 'glaubwürdig', 'dastavérnyj', 'adjective', 'B2', 'Э́то достове́рный исто́чник.', 'Das ist eine glaubwürdige Quelle.', { grammar: 'f. достове́рная', tags: ['medien'] }),
  v('v_zagolovok', 'заголо́вок', 'Schlagzeile', 'zagalóvak', 'noun', 'B2', 'Заголо́вок вводи́т в заблужде́ние.', 'Die Schlagzeile ist irreführend.', { gender: 'm', grammar: 'pl. заголо́вки', tags: ['medien'] }),
  v('v_osveshchat', 'освеща́ть', 'beleuchten / berichten über', 'asveščát’', 'verb', 'B2', 'СМИ освеща́ют э́ту те́му по-ра́зному.', 'Die Medien berichten unterschiedlich über dieses Thema.', { grammar: 'я освеща́ю', tags: ['medien'] }),
  v('v_feyk', 'фейк', 'Fake', 'fɛjk', 'noun', 'B2', 'Э́то фейк, а не но́вость.', 'Das ist ein Fake, keine Nachricht.', { gender: 'm', tags: ['medien'] }),

  // B2 · Klima
  v('v_izmenenie', 'измене́ние', 'Veränderung', 'izmenjénije', 'noun', 'B2', 'Измене́ние кли́мата каса́ется всех.', 'Der Klimawandel betrifft alle.', { gender: 'n', tags: ['umwelt'] }),
  v('v_vyibros', 'вы́брос', 'Emission', 'výbras', 'noun', 'B2', 'Вы́бросы углеки́слого га́за растут.', 'Die CO₂-Emissionen steigen.', { gender: 'm', grammar: 'meist pl. вы́бросы', tags: ['umwelt'] }),
  v('v_pererabotka', 'перерабо́тка', 'Recycling / Verarbeitung', 'pererabótka', 'noun', 'B2', 'Перерабо́тка му́сора эконо́мит ресу́рсы.', 'Recycling von Müll spart Ressourcen.', { gender: 'f', tags: ['umwelt'] }),
  v('v_ustoychivy', 'усто́йчивый', 'nachhaltig / stabil', 'ustójčivyj', 'adjective', 'B2', 'Усто́йчивое разви́тие — э́то долги́й проце́сс.', 'Nachhaltige Entwicklung ist ein langer Prozess.', { tags: ['umwelt'] }),
  v('v_potreblenie', 'потребле́ние', 'Konsum', 'patreblénije', 'noun', 'B2', 'Мы должны́ сократи́ть потребле́ние.', 'Wir müssen den Konsum reduzieren.', { gender: 'n', tags: ['umwelt'] }),

  // C1 · Zeit und Erinnerung
  v('v_vospominanie', 'воспомина́ние', 'Erinnerung', 'vaspaminánije', 'noun', 'C1', 'Воспомина́ния меня́ются со вре́менем.', 'Erinnerungen verändern sich mit der Zeit.', { gender: 'n', tags: ['abstrakt'] }),
  v('v_soznanie', 'созна́ние', 'Bewusstsein', 'saznánije', 'noun', 'C1', 'Он пришёл в созна́ние.', 'Er kam wieder zu Bewusstsein.', { gender: 'n', tags: ['abstrakt'] }),
  v('v_techenie', 'тече́ние', 'Verlauf / Strömung', 'tečénije', 'noun', 'C1', 'В тече́ние го́да всё измени́лось.', 'Im Laufe eines Jahres hat sich alles verändert.', { gender: 'n', grammar: 'в тече́ние + Gen.', tags: ['abstrakt'] }),
  v('v_neprepryvno', 'непреры́вно', 'ununterbrochen', 'neprerývna', 'adverb', 'C1', 'Мы непреры́вно переосмы́сливаем про́шлое.', 'Wir reflektieren die Vergangenheit ununterbrochen.', { tags: ['abstrakt'] }),
  v('v_osmyislit', 'осмы́слить', 'begreifen / reflektieren', 'asmýslit’', 'verb', 'C1', 'Ей ну́жно вре́мя, что́бы осмы́слить э́то.', 'Sie braucht Zeit, um das zu verarbeiten.', { grammar: 'я осмы́слю', tags: ['abstrakt'] }),

  // C1 · Idiomatik
  v('v_bit_baklushi', 'бить баклу́ши', 'faulenzen (wörtl. Löffelrohlinge schlagen)', 'bit’ baklúši', 'phrase', 'C1', 'Он це́лый день бьёт баклу́ши.', 'Er faulenzt den ganzen Tag.', { tags: ['idiom'] }),
  v('v_vodit_za_nos', 'води́ть за́ нос', 'an der Nase herumführen', 'vadít’ zá nos', 'phrase', 'C1', 'Не во́ди меня́ за́ нос.', 'Führ mich nicht an der Nase herum.', { tags: ['idiom'] }),
  v('v_ni_puha_ni_pera', 'ни пу́ха ни пера́', 'Hals- und Beinbruch', 'ni púcha ni perá', 'phrase', 'C1', 'Ни пу́ха ни пера́ на экза́мене!', 'Viel Erfolg bei der Prüfung!', { tags: ['idiom'] }),
  v('v_sem_pyatnits', 'семь пя́тниц на неде́ле', 'wankelmütig sein', 'sjem’ pjátnic na nedéle', 'phrase', 'C1', 'У него́ семь пя́тниц на неде́ле.', 'Er ist sehr wankelmütig.', { tags: ['idiom'] }),
  v('v_derzhat_v_kurse', 'держа́ть в ку́рсе', 'auf dem Laufenden halten', 'deržát’ v kúrse', 'phrase', 'C1', 'Держи́ меня́ в ку́рсе.', 'Halte mich auf dem Laufenden.', { tags: ['idiom'] }),
];

export const advancedChapters: Chapter[] = [
  { id: 'c_a2_1', level: 'A2', title: 'Путешествия', subtitle: 'Bahnhof, Tickets, Verspätungen', glyph: '🚆' },
  { id: 'c_a2_2', level: 'A2', title: 'Здоровье', subtitle: 'Arztbesuch und Wohlbefinden', glyph: '🩺' },
  { id: 'c_b1_1', level: 'B1', title: 'Работа', subtitle: 'Bewerbung und Berufsalltag', glyph: '💼' },
  { id: 'c_b1_2', level: 'B1', title: 'Мнения', subtitle: 'Diskutieren und zustimmen', glyph: '💬' },
  { id: 'c_b2_1', level: 'B2', title: 'Медиа', subtitle: 'Nachrichten kritisch lesen', glyph: '📰' },
  { id: 'c_b2_2', level: 'B2', title: 'Экология', subtitle: 'Klima, Konsum, Stadt', glyph: '🌍' },
  { id: 'c_c1_1', level: 'C1', title: 'Память', subtitle: 'Zeit, Erinnerung, Bewusstsein', glyph: '🕰️' },
  { id: 'c_c1_2', level: 'C1', title: 'Идиомы', subtitle: 'Bilder und Nuancen', glyph: '🎭' },
];

const ex = {
  choice: (id: string, prompt: string, options: string[], answer: number, extra: { stimulus?: string; explain?: string } = {}): Exercise => ({ kind: 'choice', id, prompt, options, answer, ...extra }),
  translate: (id: string, direction: 'ru-de' | 'de-ru', prompt: string, answers: string[], extra: { hint?: string; explain?: string } = {}): Exercise => ({ kind: 'translate', id, direction, prompt, answers, ...extra }),
  cloze: (id: string, sentence: string, answers: string[], extra: { translation?: string; explain?: string } = {}): Exercise => ({ kind: 'cloze', id, sentence, answers, ...extra }),
  listen: (id: string, audio: string, question: string, options: string[], answer: number, explain?: string): Exercise => ({ kind: 'listen', id, audio, question, options, answer, explain }),
  speak: (id: string, target: string, translation: string): Exercise => ({ kind: 'speak', id, target, translation }),
  match: (id: string, prompt: string, pairs: { left: string; right: string }[]): Exercise => ({ kind: 'match', id, prompt, pairs }),
};

export const advancedLessons: Lesson[] = [
  {
    id: 'l_a2_1_1',
    chapterId: 'c_a2_1',
    title: 'На вокзале',
    subtitle: 'Tickets kaufen und Abfahrten verstehen',
    minutes: 9,
    xp: 25,
    vocabIds: ['v_poezd', 'v_bilet', 'v_platforma', 'v_opazdyvat', 'v_raspisanie'],
    grammarSlugs: ['verben-bewegung'],
    exercises: [
      ex.choice('a1', 'Где покупа́ют биле́т?', ['В ка́ссе', 'На платфо́рме', 'В расписа́нии', 'В по́езде'], 0, { explain: 'Die Kasse (ка́сса) verkauft Fahrkarten; am Bahnsteig steigt man ein.' }),
      ex.translate('a2', 'de-ru', 'Wann fährt der Zug ab?', ['Когда́ отхо́дит по́езд?', 'Когда отправляется поезд?'], { hint: 'отходи́ть = abfahren' }),
      ex.cloze('a3', 'По́езд ___ в 18:40.', ['отхо́дит', 'отходит'], { translation: 'Der Zug fährt um 18:40 ab.' }),
      ex.listen('a4', 'Ваш по́езд отправля́ется с тре́тьей платфо́рмы.', 'Von welcher Plattform fährt der Zug?', ['Von der dritten', 'Von der zweiten', 'Von der ersten', 'Von Gleis elf'], 0),
      ex.speak('a5', 'Извини́те, где ка́сса?', 'Entschuldigung, wo ist die Kasse?'),
      ex.match('a6', 'Verbinde die Wörter mit ihrer Bedeutung.', [
        { left: 'расписа́ние', right: 'Fahrplan' },
        { left: 'опа́здывать', right: 'sich verspäten' },
        { left: 'платфо́рма', right: 'Bahnsteig' },
        { left: 'биле́т', right: 'Fahrkarte' },
      ]),
    ],
  },
  {
    id: 'l_a2_2_1',
    chapterId: 'c_a2_2',
    title: 'У врача',
    subtitle: 'Symptome beschreiben und Ratschläge verstehen',
    minutes: 9,
    xp: 25,
    vocabIds: ['v_bolno', 'v_temperatura', 'v_lekarstvo', 'v_kashel', 'v_zdorove'],
    grammarSlugs: ['verben-praesens'],
    exercises: [
      ex.choice('b1', 'У меня́ температу́ра и ка́шель. Что де́лать?', ['Идти́ к врачу́', 'Идти́ на рабо́ту', 'Пить ко́фе', 'Занима́ться спо́ртом'], 0),
      ex.translate('b2', 'de-ru', 'Ich habe Husten und Fieber.', ['У меня́ ка́шель и температу́ра.', 'У меня кашель и температура.'], { hint: 'у меня́ = ich habe (wörtl. bei mir ist)' }),
      ex.cloze('b3', 'Принима́йте ___ три ра́за в день.', ['лека́рство', 'лекарство'], { translation: 'Nehmen Sie das Medikament dreimal täglich.' }),
      ex.listen('b4', 'Вам ну́жно отдыха́ть и пить бо́льше воды́.', 'Was rät der Arzt?', ['Ausruhen und viel trinken', 'Mehr arbeiten', 'Sport machen', 'Weniger schlafen'], 0),
      ex.speak('b5', 'Я пло́хо себя́ чу́вствую.', 'Mir geht es schlecht.'),
      ex.match('b6', 'Verbinde Symptome und Begriffe.', [
        { left: 'ка́шель', right: 'Husten' },
        { left: 'температу́ра', right: 'Fieber' },
        { left: 'бо́льно', right: 'es tut weh' },
        { left: 'здоро́вье', right: 'Gesundheit' },
      ]),
    ],
  },
  {
    id: 'l_b1_1_1',
    chapterId: 'c_b1_1',
    title: 'Собеседование',
    subtitle: 'Erfahrung, Stärken und nächste Schritte',
    minutes: 11,
    xp: 35,
    vocabIds: ['v_opyit', 'v_sobesedovanie', 'v_rezyume', 'v_navyik', 'v_otvetstvennost'],
    grammarSlugs: ['konjunktiv-by'],
    exercises: [
      ex.choice('c1', 'Что обы́чно беру́т на собесе́дование?', ['Резюме́', 'Па́спорт', 'Биле́т', 'Расписа́ние'], 0),
      ex.translate('c2', 'de-ru', 'Ich habe drei Jahre Erfahrung.', ['У меня́ три го́да о́пыта.', 'У меня три года опыта.'], { hint: 'о́пыт + Genitiv: о́пыта' }),
      ex.cloze('c3', 'Расскажи́те о своём ___ рабо́ты.', ['о́пыте', 'опыте'], { translation: 'Erzählen Sie von Ihrer Berufserfahrung.' }),
      ex.listen('c4', 'Мы свя́жемся с ва́ми в тече́ние неде́ли.', 'Wann meldet sich die Firma?', ['Innerhalb einer Woche', 'In einem Monat', 'Morgen', 'Nie'], 0),
      ex.speak('c5', 'Я отве́тственный и бы́стро учу́сь.', 'Ich bin verantwortungsvoll und lerne schnell.'),
      ex.match('c6', 'Verbinde die Bewerbungsbegriffe.', [
        { left: 'о́пыт', right: 'Erfahrung' },
        { left: 'на́вык', right: 'Fertigkeit' },
        { left: 'отве́тственность', right: 'Verantwortung' },
        { left: 'резюме́', right: 'Lebenslauf' },
      ]),
    ],
  },
  {
    id: 'l_b1_2_1',
    chapterId: 'c_b1_2',
    title: 'Спор и согласие',
    subtitle: 'Höflich widersprechen und Kompromisse finden',
    minutes: 11,
    xp: 35,
    vocabIds: ['v_mnenie', 'v_soglasen', 'v_vozrazhat', 'v_argument', 'v_kompromiss'],
    grammarSlugs: ['konjunktiv-by'],
    exercises: [
      ex.choice('d1', 'Wie widerspricht man höflich?', ['Я понима́ю, но у меня́ друго́е мне́ние.', 'Нет, ты непра́в.', 'Мне всё равно́.', 'Не говори́ со мной.'], 0),
      ex.translate('d2', 'de-ru', 'Ich bin anderer Meinung.', ['У меня́ друго́е мне́ние.', 'У меня другое мнение.']),
      ex.cloze('d3', 'Дава́й найдём ___.', ['компроми́сс', 'компромисс'], { translation: 'Lass uns einen Kompromiss finden.' }),
      ex.listen('d4', 'Я согла́сен с тобо́й, но есть одно́ «но».', 'Was sagt die Person?', ['Zustimmung mit Einschränkung', 'Klare Ablehnung', 'Sie hat keine Meinung', 'Sie wechselt das Thema'], 0),
      ex.speak('d5', 'Мне ка́жется, э́то пра́вильное реше́ние.', 'Ich finde, das ist die richtige Entscheidung.'),
      ex.match('d6', 'Verbinde die Diskussionswörter.', [
        { left: 'мне́ние', right: 'Meinung' },
        { left: 'аргуме́нт', right: 'Argument' },
        { left: 'возража́ть', right: 'widersprechen' },
        { left: 'согла́сен', right: 'einverstanden' },
      ]),
    ],
  },
  {
    id: 'l_b2_1_1',
    chapterId: 'c_b2_1',
    title: 'Новости и медиа',
    subtitle: 'Quellen prüfen und Schlagzeilen einordnen',
    minutes: 12,
    xp: 45,
    vocabIds: ['v_istochnik', 'v_dostoverny', 'v_zagolovok', 'v_osveshchat', 'v_feyk'],
    grammarSlugs: ['partizipien'],
    exercises: [
      ex.choice('e1', 'Что зна́чит «достове́рный исто́чник»?', ['Glaubwürdige Quelle', 'Schnelle Nachricht', 'Werbung', 'Anonymes Gerücht'], 0),
      ex.translate('e2', 'de-ru', 'Diese Schlagzeile ist irreführend.', ['Э́тот заголо́вок вводи́т в заблужде́ние.', 'Этот заголовок вводит в заблуждение.']),
      ex.cloze('e3', 'Проверя́йте ___, пре́жде чем дели́ться но́востью.', ['исто́чник', 'источник'], { translation: 'Prüfen Sie die Quelle, bevor Sie die Nachricht teilen.' }),
      ex.listen('e4', 'СМИ освеща́ют э́ту те́му по-ра́зному.', 'Wie berichten die Medien?', ['Unterschiedlich', 'Gar nicht', 'Nur positiv', 'Nur im Radio'], 0),
      ex.speak('e5', 'Не всё, что напи́сано в интерне́те, пра́вда.', 'Nicht alles, was im Internet steht, ist wahr.'),
      ex.match('e6', 'Verbinde die Medienbegriffe.', [
        { left: 'заголо́вок', right: 'Schlagzeile' },
        { left: 'исто́чник', right: 'Quelle' },
        { left: 'фейк', right: 'Fake' },
        { left: 'достове́рный', right: 'glaubwürdig' },
      ]),
    ],
  },
  {
    id: 'l_b2_2_1',
    chapterId: 'c_b2_2',
    title: 'Климат и город',
    subtitle: 'Umwelt, Konsum und nachhaltige Entscheidungen',
    minutes: 12,
    xp: 45,
    vocabIds: ['v_izmenenie', 'v_vyibros', 'v_pererabotka', 'v_ustoychivy', 'v_potreblenie'],
    grammarSlugs: ['partizipien'],
    exercises: [
      ex.choice('f1', 'Что зна́чит «усто́йчивый»?', ['nachhaltig', 'teuer', 'schnell', 'laut'], 0),
      ex.translate('f2', 'de-ru', 'Wir müssen unseren Konsum reduzieren.', ['Мы должны́ сократи́ть потребле́ние.', 'Мы должны сократить потребление.']),
      ex.cloze('f3', '___ углеки́слого га́за растут.', ['Вы́бросы', 'Выбросы'], { translation: 'Die CO₂-Emissionen steigen.' }),
      ex.listen('f4', 'Го́род перераба́тывает бо́льше му́сора, чем ра́ньше.', 'Was macht die Stadt?', ['Sie recycelt mehr Müll', 'Sie baut mehr Straßen', 'Sie schließt Parks', 'Sie kauft mehr Autos'], 0),
      ex.speak('f5', 'Измене́ние кли́мата каса́ется всех.', 'Der Klimawandel betrifft alle.'),
      ex.match('f6', 'Verbinde die Umweltbegriffe.', [
        { left: 'измене́ние', right: 'Veränderung' },
        { left: 'перерабо́тка', right: 'Recycling' },
        { left: 'потребле́ние', right: 'Konsum' },
        { left: 'вы́брос', right: 'Emission' },
      ]),
    ],
  },
  {
    id: 'l_c1_1_1',
    chapterId: 'c_c1_1',
    title: 'Время и память',
    subtitle: 'Abstrakte Zusammenhänge präzise ausdrücken',
    minutes: 14,
    xp: 55,
    vocabIds: ['v_vospominanie', 'v_soznanie', 'v_techenie', 'v_neprepryvno', 'v_osmyislit'],
    grammarSlugs: ['stil-idiome'],
    exercises: [
      ex.choice('g1', 'Что зна́чит «осмы́слить»?', ['gedanklich durchdringen', 'schnell vergessen', 'laut sagen', 'aufschreiben'], 0),
      ex.translate('g2', 'de-ru', 'Erinnerungen verändern sich mit der Zeit.', ['Воспомина́ния меня́ются со вре́менем.', 'Воспоминания меняются со временем.']),
      ex.cloze('g3', 'Мы ___ переосмы́сливаем про́шлое.', ['непреры́вно', 'непрерывно'], { translation: 'Wir reflektieren die Vergangenheit ununterbrochen.' }),
      ex.listen('g4', 'Воспомина́ние — э́то не запи́сь, а живой проце́сс.', 'Wie wird Erinnerung beschrieben?', ['Als lebendiger Prozess', 'Als Datei', 'Als Foto', 'Als Zahl'], 0),
      ex.speak('g5', 'Вре́мя меня́ет на́ше восприя́тие про́шлого.', 'Die Zeit verändert unsere Wahrnehmung der Vergangenheit.'),
      ex.match('g6', 'Verbinde die abstrakten Begriffe.', [
        { left: 'воспомина́ние', right: 'Erinnerung' },
        { left: 'созна́ние', right: 'Bewusstsein' },
        { left: 'тече́ние', right: 'Verlauf' },
        { left: 'осмы́слить', right: 'reflektieren' },
      ]),
    ],
  },
  {
    id: 'l_c1_2_1',
    chapterId: 'c_c1_2',
    title: 'Идиомы и нюансы',
    subtitle: 'Bildhafte Sprache verstehen und selbst nutzen',
    minutes: 14,
    xp: 55,
    vocabIds: ['v_bit_baklushi', 'v_vodit_za_nos', 'v_ni_puha_ni_pera', 'v_sem_pyatnits', 'v_derzhat_v_kurse'],
    grammarSlugs: ['stil-idiome'],
    exercises: [
      ex.choice('h1', '«Бить баклу́ши» bedeutet …', ['faulenzen', 'arbeiten', 'kochen', 'reisen'], 0, { explain: 'Wörtlich „Löffelrohlinge schlagen“ – ein altes Handwerk, das als einfach galt.' }),
      ex.translate('h2', 'de-ru', 'Hals- und Beinbruch!', ['Ни пу́ха ни пера́!', 'Ни пуха ни пера!']),
      ex.cloze('h3', 'Он во́дит меня́ за́ ___.', ['нос'], { translation: 'Er führt mich an der Nase herum.' }),
      ex.listen('h4', 'Держи́ меня́ в ку́рсе, пожа́луйста.', 'Was möchte die Person?', ['Auf dem Laufenden bleiben', 'Allein gelassen werden', 'Schneller sprechen', 'Etwas kaufen'], 0),
      ex.speak('h5', 'Не во́ди меня́ за́ нос.', 'Führ mich nicht an der Nase herum.'),
      ex.match('h6', 'Verbinde die Redewendungen.', [
        { left: 'бить баклу́ши', right: 'faulenzen' },
        { left: 'води́ть за́ нос', right: 'an der Nase herumführen' },
        { left: 'ни пу́ха ни пера́', right: 'Hals- und Beinbruch' },
        { left: 'держа́ть в ку́рсе', right: 'auf dem Laufenden halten' },
      ]),
    ],
  },
];

export const advancedGrammar: GrammarTopic[] = [
  {
    slug: 'verben-bewegung',
    level: 'A2',
    title: 'Verben der Bewegung',
    summary: 'идти́ und е́хать, ihre Präfixe und die Richtung.',
    minutes: 8,
    sections: [
      {
        heading: 'идти́ oder е́хать?',
        body: 'идти́ benutzt man für Bewegung zu Fuß, е́хать für Bewegung mit einem Fahrzeug. Beide sind unvollendet; die vollendete Entsprechung ist пойти́ bzw. пое́хать.',
        table: {
          head: ['Person', 'идти́', 'е́хать'],
          rows: [
            ['я', 'иду́', 'е́ду'],
            ['ты', 'идёшь', 'е́дешь'],
            ['он / она́', 'идёт', 'е́дет'],
            ['мы', 'идём', 'е́дем'],
            ['вы', 'идёте', 'е́дете'],
            ['они́', 'иду́т', 'е́дут'],
          ],
        },
        examples: [
          { ru: 'Я иду́ в парк.', de: 'Ich gehe in den Park.' },
          { ru: 'Мы е́дем на по́езде в Москву́.', de: 'Wir fahren mit dem Zug nach Moskau.' },
        ],
      },
      {
        heading: 'Präfixe ändern die Richtung',
        body: 'по- = losgehen, при- = ankommen, у- = weggehen, вы- = hinausgehen, до- = bis ans Ziel gehen. Das Präfix macht die Bewegung oft vollendet.',
        examples: [
          { ru: 'По́езд прихо́дит в 8 Uhr.', de: 'Der Zug kommt um 8 an.' },
          { ru: 'Он ушёл домо́й.', de: 'Er ist nach Hause gegangen.' },
        ],
      },
    ],
    exercises: [
      { kind: 'choice', id: 'vm1', prompt: 'Wir fahren mit dem Auto. Welches Verb?', options: ['е́дем', 'идём', 'идёшь', 'е́дете'], answer: 0 },
      { kind: 'cloze', id: 'vm2', sentence: 'Я ___ в университе́т пешко́м.', answers: ['иду́', 'иду'], translation: 'Ich gehe zu Fuß zur Universität.' },
    ],
  },
  {
    slug: 'konjunktiv-by',
    level: 'B1',
    title: 'Wünsche und Höflichkeit mit бы',
    summary: 'Der Konjunktiv mit бы für Wünsche, Ratschläge und höfliche Bitten.',
    minutes: 9,
    sections: [
      {
        heading: 'бы + Vergangenheitsform',
        body: 'бы steht direkt nach dem Verb oder nach der Konjunktion. Die Form bleibt in Geschlecht und Zahl beim Verb: я бы сказа́л / сказа́ла.',
        examples: [
          { ru: 'Я бы хоте́л учи́ться в Москве́.', de: 'Ich würde gern in Moskau studieren.' },
          { ru: 'Что бы ты сде́лал?', de: 'Was würdest du tun?' },
        ],
      },
      {
        heading: 'Höfliche Bitten und Ratschläge',
        body: 'Mit бы klingen Bitten und Ratschläge weniger direkt. что́бы leitet einen Nebensatz mit Zweck ein.',
        examples: [
          { ru: 'Вы не могли́ бы говори́ть ме́дленнее?', de: 'Könnten Sie bitte langsamer sprechen?' },
          { ru: 'Я хочу́, что́бы мы нашли́ компроми́сс.', de: 'Ich möchte, dass wir einen Kompromiss finden.' },
        ],
      },
    ],
    exercises: [
      { kind: 'choice', id: 'kb1', prompt: 'Wie sagt man „Ich würde gern mitkommen“?', options: ['Я бы хоте́л пойти́ с ва́ми.', 'Я хочу́ пойти́ с ва́ми.', 'Я шёл с ва́ми.', 'Я пойду́ с ва́ми.'], answer: 0 },
      { kind: 'cloze', id: 'kb2', sentence: 'Что́бы ты мне посове́товал?', answers: ['посове́товал', 'посоветовал'], translation: 'Was würdest du mir raten?' },
    ],
  },
  {
    slug: 'partizipien',
    level: 'B2',
    title: 'Partizipien',
    summary: 'Aktive und passive Partizipien für präzise schriftliche Sprache.',
    minutes: 10,
    sections: [
      {
        heading: 'Aktive Partizipien',
        body: 'Sie beschreiben eine Person oder Sache, die die Handlung ausführt: чита́ющий (lesend), прочита́вший (gelesen habend). In der gesprochenen Sprache ersetzt man sie oft durch der/die + Verb.',
        examples: [
          { ru: 'Челове́к, чита́ющий кни́гу, сиди́т у окна́.', de: 'Der Mensch, der ein Buch liest, sitzt am Fenster.' },
        ],
      },
      {
        heading: 'Passive Partizipien',
        body: 'Sie beschreiben das Ergebnis einer Handlung: прочи́танная кни́га (das gelesene Buch). Sie werden wie Adjektive dekliniert.',
        examples: [
          { ru: 'Э́то хорошо́ напи́санная статья́.', de: 'Das ist ein gut geschriebener Artikel.' },
        ],
      },
    ],
    exercises: [
      { kind: 'choice', id: 'pt1', prompt: 'Welche Form bedeutet „das gelesene Buch“?', options: ['прочи́танная кни́га', 'чита́ющая кни́га', 'чита́ть кни́гу', 'прочита́в кни́гу'], answer: 0 },
      { kind: 'cloze', id: 'pt2', sentence: 'Э́то достове́рный исто́чник, ___ журнали́стами.', answers: ['прове́ренный', 'проверенный'], translation: 'Das ist eine von Journalisten geprüfte, glaubwürdige Quelle.' },
    ],
  },
  {
    slug: 'stil-idiome',
    level: 'C1',
    title: 'Stil und Idiomatik',
    summary: 'Register, Bildhaftigkeit und typische C1-Wendungen.',
    minutes: 10,
    sections: [
      {
        heading: 'Register bewusst wählen',
        body: 'Formelle Texte vermeiden umgangssprachliche Partikeln wie ну, вот, вообще́. Schriftlich nutzt man чаще, сле́довательно, тем не ме́нее. Idiome wirken nur, wenn sie zum Kontext passen.',
        examples: [
          { ru: 'Тем не ме́нее, результа́ты остаю́тся спорными.', de: 'Dennoch bleiben die Ergebnisse umstritten.' },
          { ru: 'Он, как говори́тся, бьёт баклу́ши.', de: 'Er faulenzt, wie man so sagt.' },
        ],
      },
      {
        heading: 'Idiome richtig einsetzen',
        body: 'Viele Idiome haben eine feste Form und oft eine umgangssprachliche Färbung. «Ни пу́ха ни пера́» wünscht Erfolg, «води́ть за́ нос» kritisiert Unehrlichkeit.',
        examples: [
          { ru: 'Ни пу́ха ни пера́ тебе́ на собесе́довании!', de: 'Viel Erfolg bei deinem Vorstellungsgespräch!' },
        ],
      },
    ],
    exercises: [
      { kind: 'choice', id: 'si1', prompt: 'Welche Wendung passt zu „jemanden hinhalten“?', options: ['води́ть за́ нос', 'держа́ть в ку́рсе', 'ни пу́ха ни пера́', 'бить баклу́ши'], answer: 0 },
      { kind: 'cloze', id: 'si2', sentence: 'Он обеща́л, но э́то о́чевидно: он во́дит нас за́ ___.', answers: ['нос'], translation: 'Er hat es versprochen, aber offensichtlich hält er uns hin.' },
    ],
  },
];
