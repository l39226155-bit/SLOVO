import type { Gender, Level, Vocab, WordType } from '@/data/types';
import { advancedVocab } from '@/data/advanced';

type Extra = { gender?: Gender; grammar?: string; tags?: string[]; note?: string };

const w = (
  id: string,
  ru: string,
  de: string,
  transcription: string,
  type: WordType,
  level: Level,
  exampleRu: string,
  exampleDe: string,
  extra: Extra = {},
): Vocab => ({
  id,
  ru,
  de,
  transcription,
  type,
  level,
  example: { ru: exampleRu, de: exampleDe, note: extra.note },
  gender: extra.gender,
  grammar: extra.grammar,
  tags: extra.tags,
});

/** A0/A1 core vocabulary — greetings, people, everyday objects, verbs, adjectives. */
const baseVocabulary: Vocab[] = [
  // --- Begrüßung & Höflichkeit -------------------------------------------
  w('v_privet', 'приве́т', 'hallo (informell)', 'priwjét', 'phrase', 'A0', 'Приве́т, как дела́?', 'Hallo, wie geht’s?', { tags: ['begrüßung'] }),
  w('v_zdravstvuyte', 'здра́вствуйте', 'guten Tag (formell)', 'sdrástwujte', 'phrase', 'A0', 'Здра́вствуйте, меня́ зову́т А́нна.', 'Guten Tag, ich heiße Anna.', { tags: ['begrüßung'], note: 'Das „в“ wird nicht gesprochen.' }),
  w('v_dobroe_utro', 'до́брое у́тро', 'guten Morgen', 'dóbraje útra', 'phrase', 'A0', 'До́брое у́тро! Как вы?', 'Guten Morgen! Wie geht es Ihnen?', { tags: ['begrüßung'] }),
  w('v_dobryy_den', 'до́брый день', 'guten Tag', 'dóbryj den’', 'phrase', 'A0', 'До́брый день, Ири́на!', 'Guten Tag, Irina!', { tags: ['begrüßung'] }),
  w('v_dobryy_vecher', 'до́брый ве́чер', 'guten Abend', 'dóbryj véčer', 'phrase', 'A0', 'До́брый ве́чер, да́мы и господа́.', 'Guten Abend, meine Damen und Herren.', { tags: ['begrüßung'] }),
  w('v_do_svidaniya', 'до свида́ния', 'auf Wiedersehen', 'da svidánija', 'phrase', 'A0', 'До свида́ния, до за́втра!', 'Auf Wiedersehen, bis morgen!', { tags: ['abschied'] }),
  w('v_poka', 'пока́', 'tschüss', 'paká', 'phrase', 'A0', 'Пока́! Уви́димся!', 'Tschüss! Bis später!', { tags: ['abschied'] }),
  w('v_spasibo', 'спаси́бо', 'danke', 'spassíba', 'phrase', 'A0', 'Спаси́бо большо́е!', 'Vielen Dank!', { tags: ['höflichkeit'] }),
  w('v_pozhaluysta', 'пожа́луйста', 'bitte / gern', 'pažálusta', 'phrase', 'A0', 'Пожа́луйста, вот ваш ко́фе.', 'Bitte, hier ist Ihr Kaffee.', { tags: ['höflichkeit'] }),
  w('v_izvinite', 'извини́те', 'entschuldigen Sie', 'isviníte', 'phrase', 'A0', 'Извини́те, я не понима́ю.', 'Entschuldigung, ich verstehe nicht.', { tags: ['höflichkeit'] }),
  w('v_da', 'да', 'ja', 'da', 'phrase', 'A0', 'Да, я понима́ю.', 'Ja, ich verstehe.', { tags: ['grundlagen'] }),
  w('v_net', 'нет', 'nein / nicht', 'njet', 'phrase', 'A0', 'Нет, спаси́бо.', 'Nein, danke.', { tags: ['grundlagen'] }),
  w('v_kak_dela', 'как дела́?', 'wie geht’s?', 'kak delá', 'phrase', 'A0', 'Приве́т! Как дела́?', 'Hallo! Wie geht’s?', { tags: ['smalltalk'] }),
  w('v_menya_zovut', 'меня́ зову́т …', 'ich heiße …', 'menjá zovút', 'phrase', 'A0', 'Меня́ зову́т Лу́кас.', 'Ich heiße Lukas.', { tags: ['smalltalk'] }),
  w('v_ochen_priyatno', 'о́чень прия́тно', 'sehr erfreut', 'óčen’ prijátna', 'phrase', 'A0', 'О́чень прия́тно познако́миться!', 'Sehr erfreut, Sie kennenzulernen!', { tags: ['smalltalk'] }),

  // --- Pronomen -----------------------------------------------------------
  w('v_ya', 'я', 'ich', 'ja', 'pronoun', 'A0', 'Я из Герма́нии.', 'Ich komme aus Deutschland.', { grammar: 'я → мне, меня́, мной' }),
  w('v_ty', 'ты', 'du', 'ty', 'pronoun', 'A0', 'Ты говори́шь по-ру́сски?', 'Sprichst du Russisch?', { grammar: 'informell, nur mit Vertrauten' }),
  w('v_vy', 'вы', 'Sie / ihr', 'vy', 'pronoun', 'A0', 'Вы говори́те по-англи́йски?', 'Sprechen Sie Englisch?', { grammar: 'Höflichkeitsform; auch „ihr“' }),
  w('v_on', 'он', 'er', 'on', 'pronoun', 'A0', 'Он студе́нт.', 'Er ist Student.', {}),
  w('v_ona', 'она́', 'sie', 'aná', 'pronoun', 'A0', 'Она́ учи́тельница.', 'Sie ist Lehrerin.', {}),
  w('v_my', 'мы', 'wir', 'my', 'pronoun', 'A0', 'Мы до́ма.', 'Wir sind zu Hause.', {}),
  w('v_oni', 'они́', 'sie (Plural)', 'aní', 'pronoun', 'A0', 'Они́ в шко́ле.', 'Sie sind in der Schule.', {}),

  // --- Zahlen -------------------------------------------------------------
  w('v_odin', 'оди́н', 'eins', 'adín', 'numeral', 'A0', 'У меня́ оди́н брат.', 'Ich habe einen Bruder.', { grammar: 'оди́н / одна́ / одно́' }),
  w('v_dva', 'два', 'zwei', 'dva', 'numeral', 'A0', 'Два ко́фе, пожа́луйста.', 'Zwei Kaffee, bitte.', { grammar: 'два / две' }),
  w('v_tri', 'три', 'drei', 'tri', 'numeral', 'A0', 'Три биле́та, пожа́луйста.', 'Drei Tickets, bitte.', {}),
  w('v_chetyre', 'четы́ре', 'vier', 'četýre', 'numeral', 'A0', 'Здесь четы́ре сту́ла.', 'Hier sind vier Stühle.', {}),
  w('v_pyat', 'пять', 'fünf', 'pjat’', 'numeral', 'A0', 'Пять мину́т, пожа́луйста.', 'Fünf Minuten, bitte.', {}),
  w('v_shest', 'шесть', 'sechs', 'šest’', 'numeral', 'A0', 'Шесть утра́.', 'Sechs Uhr morgens.', {}),
  w('v_sem', 'семь', 'sieben', 'sem’', 'numeral', 'A0', 'Семь дней в неде́ле.', 'Sieben Tage in der Woche.', {}),
  w('v_vosem', 'во́семь', 'acht', 'vósem’', 'numeral', 'A0', 'Во́семь часо́в.', 'Acht Uhr.', {}),
  w('v_devyat', 'де́вять', 'neun', 'dévjat’', 'numeral', 'A0', 'Де́вять студе́нтов.', 'Neun Studenten.', {}),
  w('v_desyat', 'де́сять', 'zehn', 'désjat’', 'numeral', 'A0', 'Де́сять рубле́й.', 'Zehn Rubel.', {}),

  // --- Alltag & Dinge -----------------------------------------------------
  w('v_dom', 'дом', 'Haus', 'dom', 'noun', 'A0', 'Э́то мой дом.', 'Das ist mein Haus.', { gender: 'm', grammar: 'Pl. дома́' }),
  w('v_kvartira', 'кварти́ра', 'Wohnung', 'kvartíra', 'noun', 'A0', 'У нас больша́я кварти́ра.', 'Wir haben eine große Wohnung.', { gender: 'f', grammar: 'Pl. кварти́ры' }),
  w('v_gorod', 'го́род', 'Stadt', 'górat', 'noun', 'A0', 'Москва́ – большо́й го́род.', 'Moskau ist eine große Stadt.', { gender: 'm', grammar: 'Pl. города́; am Ende wie „t“' }),
  w('v_strana', 'страна́', 'Land', 'straná', 'noun', 'A0', 'Росси́я – больша́я страна́.', 'Russland ist ein großes Land.', { gender: 'f', grammar: 'Pl. стра́ны' }),
  w('v_rabota', 'рабо́та', 'Arbeit', 'rabóta', 'noun', 'A0', 'Я иду́ на рабо́ту.', 'Ich gehe zur Arbeit.', { gender: 'f' }),
  w('v_uchitel', 'учи́тель', 'Lehrer', 'učítel’', 'noun', 'A0', 'Он учи́тель.', 'Er ist Lehrer.', { gender: 'm', grammar: 'f. учи́тельница' }),
  w('v_student', 'студе́нт', 'Student', 'studént', 'noun', 'A0', 'Я студе́нт.', 'Ich bin Student.', { gender: 'm', grammar: 'f. студе́нтка' }),
  w('v_voda', 'вода́', 'Wasser', 'vadá', 'noun', 'A0', 'Воду́, пожа́луйста.', 'Wasser, bitte.', { gender: 'f', grammar: 'Akk. во́ду' }),
  w('v_khleb', 'хлеб', 'Brot', 'chleb', 'noun', 'A0', 'Све́жий хлеб, пожа́луйста.', 'Frisches Brot, bitte.', { gender: 'm' }),
  w('v_chay', 'чай', 'Tee', 'čaj', 'noun', 'A0', 'Я пью чай.', 'Ich trinke Tee.', { gender: 'm', grammar: 'Akk. чай (unverändert)' }),
  w('v_kofe', 'ко́фе', 'Kaffee', 'kófe', 'noun', 'A0', 'Оди́н ко́фе, пожа́луйста.', 'Einen Kaffee, bitte.', { gender: 'm', grammar: 'indeklinabel' }),
  w('v_moloko', 'молоко́', 'Milch', 'malakó', 'noun', 'A0', 'Молоко́ в холоди́льнике.', 'Die Milch ist im Kühlschrank.', { gender: 'n' }),
  w('v_yabloko', 'я́блоко', 'Apfel', 'jáblaka', 'noun', 'A0', 'Э́то кра́сное я́блоко.', 'Das ist ein roter Apfel.', { gender: 'n', grammar: 'Pl. я́блоки' }),
  w('v_myaso', 'мя́со', 'Fleisch', 'mjása', 'noun', 'A0', 'Я не ем мя́со.', 'Ich esse kein Fleisch.', { gender: 'n' }),
  w('v_ryba', 'ры́ба', 'Fisch', 'rýba', 'noun', 'A0', 'Ры́ба о́чень вку́сная.', 'Der Fisch ist sehr lecker.', { gender: 'f' }),
  w('v_ovoshchi', 'о́вощи', 'Gemüse', 'óvašči', 'noun', 'A0', 'Я покупа́ю о́вощи.', 'Ich kaufe Gemüse.', { grammar: 'Pluralwort' }),
  w('v_frukty', 'фру́кты', 'Obst', 'frúkty', 'noun', 'A0', 'Фру́кты на столе́.', 'Das Obst ist auf dem Tisch.', { grammar: 'Pluralwort' }),
  w('v_den', 'день', 'Tag', 'den’', 'noun', 'A0', 'Хоро́шего дня!', 'Einen schönen Tag!', { gender: 'm', grammar: 'Pl. дни' }),
  w('v_noch', 'ночь', 'Nacht', 'noč’', 'noun', 'A0', 'До́брой но́чи!', 'Gute Nacht!', { gender: 'f', grammar: 'Pl. но́чи' }),
  w('v_utro', 'у́тро', 'Morgen', 'útro', 'noun', 'A0', 'У́тром я пью ко́фе.', 'Morgens trinke ich Kaffee.', { gender: 'n' }),
  w('v_vecher', 'ве́чер', 'Abend', 'véčer', 'noun', 'A0', 'Ве́чером мы до́ма.', 'Abends sind wir zu Hause.', { gender: 'm' }),
  w('v_vremya', 'вре́мя', 'Zeit', 'vrémja', 'noun', 'A0', 'У меня́ нет вре́мени.', 'Ich habe keine Zeit.', { gender: 'n', grammar: 'Gen. вре́мени' }),
  w('v_god', 'год', 'Jahr', 'got', 'noun', 'A0', 'Мне два́дцать лет.', 'Ich bin zwanzig Jahre alt.', { gender: 'm', grammar: 'Pl. го́ды; nach 2–4 „го́да“' }),
  w('v_mama', 'ма́ма', 'Mama', 'máma', 'noun', 'A0', 'Э́то моя́ ма́ма.', 'Das ist meine Mama.', { gender: 'f' }),
  w('v_papa', 'па́па', 'Papa', 'pápa', 'noun', 'A0', 'Мой па́па до́ма.', 'Mein Papa ist zu Hause.', { gender: 'm' }),
  w('v_semya', 'семья́', 'Familie', 'sem’já', 'noun', 'A0', 'У меня́ больша́я семья́.', 'Ich habe eine große Familie.', { gender: 'f', grammar: 'Pl. се́мьи' }),
  w('v_drug', 'друг', 'Freund', 'druk', 'noun', 'A0', 'Он мой друг.', 'Er ist mein Freund.', { gender: 'm', grammar: 'Pl. друзья́' }),
  w('v_kniga', 'кни́га', 'Buch', 'kníga', 'noun', 'A0', 'Э́то интере́сная кни́га.', 'Das ist ein interessantes Buch.', { gender: 'f', grammar: 'Pl. кни́ги' }),
  w('v_stol', 'стол', 'Tisch', 'stol', 'noun', 'A0', 'Кни́га на столе́.', 'Das Buch liegt auf dem Tisch.', { gender: 'm', grammar: 'Präp. на столе́' }),
  w('v_stul', 'стул', 'Stuhl', 'stul', 'noun', 'A0', 'Ся́дьте на стул, пожа́луйста.', 'Setzen Sie sich bitte auf den Stuhl.', { gender: 'm', grammar: 'Pl. сту́лья' }),
  w('v_okno', 'окно́', 'Fenster', 'aknó', 'noun', 'A0', 'Откро́йте окно́, пожа́луйста.', 'Öffnen Sie bitte das Fenster.', { gender: 'n', grammar: 'Pl. о́кна' }),
  w('v_dver', 'дверь', 'Tür', 'dver’', 'noun', 'A0', 'Дверь откры́та.', 'Die Tür ist offen.', { gender: 'f' }),
  w('v_mashina', 'маши́на', 'Auto', 'mašína', 'noun', 'A0', 'Э́то но́вая маши́на.', 'Das ist ein neues Auto.', { gender: 'f' }),
  w('v_telefon', 'телефо́н', 'Telefon', 'telifón', 'noun', 'A0', 'Где мой телефо́н?', 'Wo ist mein Telefon?', { gender: 'm' }),
  w('v_dengi', 'де́ньги', 'Geld', 'dén’gi', 'noun', 'A0', 'У меня́ нет де́нег.', 'Ich habe kein Geld.', { grammar: 'Pluralwort' }),
  w('v_magazin', 'магази́н', 'Geschäft', 'magazín', 'noun', 'A0', 'Магази́н закры́т.', 'Das Geschäft ist geschlossen.', { gender: 'm' }),
  w('v_apteka', 'апте́ка', 'Apotheke', 'aptéka', 'noun', 'A0', 'Апте́ка там.', 'Die Apotheke ist dort.', { gender: 'f' }),
  w('v_vokzal', 'вокза́л', 'Bahnhof', 'vakzál', 'noun', 'A1', 'Поезда́ ухо́дят с вокза́ла.', 'Die Züge fahren vom Bahnhof ab.', { gender: 'm' }),
  w('v_aeroport', 'аэропо́рт', 'Flughafen', 'aerapórt', 'noun', 'A1', 'Как дое́хать до аэропо́рта?', 'Wie komme ich zum Flughafen?', { gender: 'm' }),
  w('v_otel', 'оте́ль', 'Hotel', 'atél’', 'noun', 'A1', 'У вас есть свобо́дный но́мер в оте́ле?', 'Haben Sie ein freies Zimmer im Hotel?', { gender: 'm' }),
  w('v_restoran', 'рестора́н', 'Restaurant', 'restarán', 'noun', 'A1', 'Э́то хоро́ший рестора́н.', 'Das ist ein gutes Restaurant.', { gender: 'm' }),
  w('v_kafe', 'кафе́', 'Café', 'kafé', 'noun', 'A1', 'Дава́йте встре́тимся в кафе́.', 'Treffen wir uns im Café.', { gender: 'n', grammar: 'indeklinabel' }),
  w('v_ulitsa', 'у́лица', 'Straße', 'úlitsa', 'noun', 'A1', 'Я живу́ на э́той у́лице.', 'Ich wohne in dieser Straße.', { gender: 'f' }),
  w('v_pogoda', 'пого́да', 'Wetter', 'pagóda', 'noun', 'A1', 'Сего́дня хоро́шая пого́да.', 'Heute ist gutes Wetter.', { gender: 'f' }),
  w('v_solntse', 'со́лнце', 'Sonne', 'sólnce', 'noun', 'A1', 'Со́лнце све́тит.', 'Die Sonne scheint.', { gender: 'n', grammar: 'Das „л“ wird nicht gesprochen.' }),
  w('v_dozhd', 'дождь', 'Regen', 'došt’', 'noun', 'A1', 'Идёт дождь.', 'Es regnet.', { gender: 'm' }),
  w('v_sneg', 'снег', 'Schnee', 'snek', 'noun', 'A1', 'Зимо́й здесь снег.', 'Im Winter gibt es hier Schnee.', { gender: 'm' }),
  w('v_zima', 'зима́', 'Winter', 'zimá', 'noun', 'A0', 'Зима́ холо́дная.', 'Der Winter ist kalt.', { gender: 'f' }),
  w('v_leto', 'ле́то', 'Sommer', 'léta', 'noun', 'A0', 'Ле́том мы е́дем на мо́ре.', 'Im Sommer fahren wir ans Meer.', { gender: 'n' }),

  // --- Verben -------------------------------------------------------------
  w('v_byt', 'быть', 'sein', 'byt’', 'verb', 'A0', 'Я бу́ду до́ма.', 'Ich werde zu Hause sein.', { grammar: 'Präsens meist unausgedrückt; Fut. бу́ду, бу́дешь' }),
  w('v_zhit', 'жить', 'leben / wohnen', 'žit’', 'verb', 'A0', 'Я живу́ в Берли́не.', 'Ich wohne in Berlin.', { grammar: 'живу́, живёшь, живёт, живём, живёте, живу́т' }),
  w('v_rabotat', 'рабо́тать', 'arbeiten', 'rabótat’', 'verb', 'A0', 'Она́ рабо́тает в ба́нке.', 'Sie arbeitet bei einer Bank.', { grammar: 'рабо́таю, рабо́таешь …' }),
  w('v_uchit', 'учи́ть', 'lernen / lehren', 'učít’', 'verb', 'A1', 'Я учу́ ру́сский язы́к.', 'Ich lerne Russisch.', { grammar: 'учу́, у́чишь, у́чит' }),
  w('v_uchitsya', 'учи́ться', 'studieren', 'učíca', 'verb', 'A1', 'Он у́чится в университе́те.', 'Er studiert an der Universität.', { grammar: 'reflexiv: учу́сь, у́чишься' }),
  w('v_govorit', 'говори́ть', 'sprechen', 'gavarít’', 'verb', 'A1', 'Вы говори́те по-ру́сски?', 'Sprechen Sie Russisch?', { grammar: 'говорю́, говори́шь, говори́т' }),
  w('v_ponimat', 'понима́ть', 'verstehen', 'panimát’', 'verb', 'A0', 'Я не понима́ю.', 'Ich verstehe nicht.', { grammar: 'понима́ю, понима́ешь …' }),
  w('v_znat', 'знать', 'wissen / kennen', 'znat’', 'verb', 'A1', 'Я зна́ю э́то сло́во.', 'Ich kenne dieses Wort.', { grammar: 'зна́ю, зна́ешь …' }),
  w('v_chitat', 'чита́ть', 'lesen', 'čitát’', 'verb', 'A1', 'Я чита́ю кни́гу.', 'Ich lese ein Buch.', { grammar: 'чита́ю, чита́ешь …' }),
  w('v_pisat', 'писа́ть', 'schreiben', 'pisát’', 'verb', 'A1', 'Он пи́шет письмо́.', 'Er schreibt einen Brief.', { grammar: 'пишу́, пи́шешь, пи́шет' }),
  w('v_slushat', 'слу́шать', 'hören / zuhören', 'slúšat’', 'verb', 'A1', 'Я слу́шаю му́зыку.', 'Ich höre Musik.', { grammar: 'слу́шаю, слу́шаешь …' }),
  w('v_smotret', 'смотре́ть', 'schauen', 'smatrét’', 'verb', 'A1', 'Мы смо́трим фильм.', 'Wir schauen einen Film.', { grammar: 'смотрю́, смо́тришь, смо́трит' }),
  w('v_est', 'есть', 'essen', 'jest’', 'verb', 'A0', 'Я ем я́блоко.', 'Ich esse einen Apfel.', { grammar: 'ем, ешь, ест, еди́м, еди́те, едя́т' }),
  w('v_pit', 'пить', 'trinken', 'pit’', 'verb', 'A0', 'Он пьёт чай.', 'Er trinkt Tee.', { grammar: 'пью, пьёшь, пьёт' }),
  w('v_idti', 'идти́', 'gehen (zu Fuß)', 'idtí', 'verb', 'A1', 'Я иду́ в шко́лу.', 'Ich gehe zur Schule.', { grammar: 'иду́, идёшь, идёт; unregelmäßig' }),
  w('v_ehat', 'е́хать', 'fahren', 'jéchat’', 'verb', 'A1', 'Мы е́дем в Москву́.', 'Wir fahren nach Moskau.', { grammar: 'е́ду, е́дешь, е́дет' }),
  w('v_khotet', 'хоте́ть', 'wollen', 'chatét’', 'verb', 'A1', 'Я хочу́ ко́фе.', 'Ich möchte einen Kaffee.', { grammar: 'хочу́, хо́чешь, хо́чет, хоти́м, хоти́те, хотя́т' }),
  w('v_moch', 'мочь', 'können', 'moč’', 'verb', 'A1', 'Вы мо́жете мне помо́чь?', 'Können Sie mir helfen?', { grammar: 'могу́, мо́жешь, мо́жет, мо́жем, мо́жете, мо́гут' }),
  w('v_lyubit', 'люби́ть', 'lieben / mögen', 'ljubít’', 'verb', 'A1', 'Я люблю́ ру́сский язы́к.', 'Ich liebe die russische Sprache.', { grammar: 'люблю́, лю́бишь, лю́бит' }),
  w('v_dumat', 'ду́мать', 'denken', 'dúmat’', 'verb', 'A1', 'Я ду́маю, э́то пра́вильно.', 'Ich denke, das ist richtig.', { grammar: 'ду́маю, ду́маешь …' }),
  w('v_delat', 'де́лать', 'machen', 'délat’', 'verb', 'A0', 'Что ты де́лаешь?', 'Was machst du?', { grammar: 'де́лаю, де́лаешь …' }),
  w('v_kupit', 'купи́ть', 'kaufen', 'kupít’', 'verb', 'A1', 'Я хочу́ купи́ть хлеб.', 'Ich möchte Brot kaufen.', { grammar: 'perfektiv; imperf. покупа́ть' }),
  w('v_platit', 'плати́ть', 'zahlen', 'platít’', 'verb', 'A1', 'Мо́жно плати́ть ка́ртой?', 'Kann man mit Karte zahlen?', { grammar: 'плачу́, пла́тишь' }),
  w('v_zhdat', 'ждать', 'warten', 'ždat’', 'verb', 'A1', 'Я жду авто́бус.', 'Ich warte auf den Bus.', { grammar: 'жду, ждёшь, ждёт' }),
  w('v_spat', 'спать', 'schlafen', 'spat’', 'verb', 'A1', 'Он спит.', 'Er schläft.', { grammar: 'сплю, спишь, спит' }),
  w('v_otdykhat', 'отдыха́ть', 'sich erholen', 'atdyhát’', 'verb', 'A1', 'В о́тпуске мы отдыха́ем.', 'Im Urlaub erholen wir uns.', { grammar: 'отдыха́ю, отдыха́ешь …' }),
  w('v_gulyat', 'гуля́ть', 'spazieren', 'gulját’', 'verb', 'A1', 'Мы гуля́ем по го́роду.', 'Wir spazieren durch die Stadt.', { grammar: 'гуля́ю, гуля́ешь …' }),
  w('v_pomogat', 'помога́ть', 'helfen', 'pamagát’', 'verb', 'A1', 'Он всегда́ помога́ет мне.', 'Er hilft mir immer.', { grammar: '+ Dativ: помога́ю тебе́' }),
  w('v_otkryt', 'откры́ть', 'öffnen', 'atkrýt’', 'verb', 'A1', 'Откро́йте дверь, пожа́луйста.', 'Öffnen Sie bitte die Tür.', { grammar: 'perfektiv; imperf. открыва́ть' }),

  // --- Adjektive ----------------------------------------------------------
  w('v_khoroshiy', 'хоро́ший', 'gut', 'charóšij', 'adjective', 'A0', 'Э́то хоро́ший день.', 'Das ist ein guter Tag.', { grammar: 'хоро́шая, хоро́шее, хоро́шие' }),
  w('v_plokhoy', 'плохо́й', 'schlecht', 'plachój', 'adjective', 'A0', 'Плохо́й план.', 'Ein schlechter Plan.', { grammar: 'плоха́я, плохо́е, плохи́е' }),
  w('v_bolshoy', 'большо́й', 'groß', 'bal’šój', 'adjective', 'A0', 'Большо́й дом.', 'Ein großes Haus.', { grammar: 'больша́я, большо́е, больши́е' }),
  w('v_malenkiy', 'ма́ленький', 'klein', 'málen’kij', 'adjective', 'A0', 'Ма́ленькая кварти́ра.', 'Eine kleine Wohnung.', { grammar: 'ма́ленькая, ма́ленькое, ма́ленькие' }),
  w('v_novyy', 'но́вый', 'neu', 'nóvyj', 'adjective', 'A0', 'Но́вый телефо́н.', 'Ein neues Telefon.', { grammar: 'но́вая, но́вое, но́вые' }),
  w('v_staryy', 'ста́рый', 'alt', 'stáryj', 'adjective', 'A0', 'Ста́рый дом.', 'Ein altes Haus.', { grammar: 'ста́рая, ста́рое, ста́рые' }),
  w('v_krasivyy', 'краси́вый', 'schön', 'krasívyj', 'adjective', 'A1', 'Краси́вый го́род.', 'Eine schöne Stadt.', { grammar: 'краси́вая, краси́вое, краси́вые' }),
  w('v_dorogoy', 'дорого́й', 'teuer / lieb', 'daragój', 'adjective', 'A1', 'Э́то сли́шком до́рого.', 'Das ist zu teuer.', { grammar: 'до́рого (Adverb)' }),
  w('v_vkusnyy', 'вку́сный', 'lecker', 'fkúsnyj', 'adjective', 'A1', 'О́чень вку́сный суп.', 'Eine sehr leckere Suppe.', { grammar: 'вку́сная, вку́сное, вку́сные' }),
  w('v_teplyy', 'тёплый', 'warm', 'tjóplyj', 'adjective', 'A1', 'Тёплый ве́чер.', 'Ein warmer Abend.', { grammar: 'тёплая, тёплое, тёплые' }),

  // --- Adverbien & Fragewörter --------------------------------------------
  w('v_segodnya', 'сего́дня', 'heute', 'sivódnja', 'adverb', 'A0', 'Сего́дня я до́ма.', 'Heute bin ich zu Hause.', {}),
  w('v_zavtra', 'за́втра', 'morgen', 'záftra', 'adverb', 'A0', 'До за́втра!', 'Bis morgen!', {}),
  w('v_vchera', 'вчера́', 'gestern', 'fčerá', 'adverb', 'A1', 'Вчера́ был дождь.', 'Gestern hat es geregnet.', {}),
  w('v_seychas', 'сейча́с', 'jetzt', 'sejčás', 'adverb', 'A0', 'Я сейча́с занят.', 'Ich bin jetzt beschäftigt.', {}),
  w('v_zdes', 'здесь', 'hier', 'zdes’', 'adverb', 'A0', 'Я здесь.', 'Ich bin hier.', {}),
  w('v_tam', 'там', 'dort', 'tam', 'adverb', 'A0', 'Магази́н там.', 'Das Geschäft ist dort.', {}),
  w('v_ochen', 'о́чень', 'sehr', 'óčen’', 'adverb', 'A0', 'О́чень прия́тно.', 'Sehr erfreut.', {}),
  w('v_nemnogo', 'немно́го', 'ein bisschen', 'nimnóga', 'adverb', 'A1', 'Я немно́го говорю́ по-ру́сски.', 'Ich spreche ein bisschen Russisch.', {}),
  w('v_khorosho', 'хорошо́', 'gut (Adverb)', 'charašó', 'adverb', 'A0', 'Хорошо́, договори́лись.', 'Gut, abgemacht.', {}),
  w('v_plokho', 'пло́хо', 'schlecht (Adverb)', 'plócha', 'adverb', 'A0', 'Я пло́хо сплю.', 'Ich schlafe schlecht.', {}),
  w('v_skolko', 'ско́лько', 'wie viel', 'skól’ka', 'adverb', 'A0', 'Ско́лько э́то сто́ит?', 'Wie viel kostet das?', {}),
  w('v_gde', 'где', 'wo', 'gde', 'adverb', 'A0', 'Где вокза́л?', 'Wo ist der Bahnhof?', {}),
  w('v_kogda', 'когда́', 'wann', 'kagdá', 'adverb', 'A1', 'Когда́ ты придёшь?', 'Wann kommst du?', {}),
  w('v_pochemu', 'почему́', 'warum', 'pačemú', 'adverb', 'A1', 'Почему́ ты не ешь?', 'Warum isst du nicht?', {}),
  w('v_kak', 'как', 'wie', 'kak', 'adverb', 'A0', 'Как вас зову́т?', 'Wie heißen Sie?', {}),

  // --- Reisephrasen -------------------------------------------------------
  w('v_skolko_stoit', 'ско́лько сто́ит?', 'was kostet das?', 'skól’ka stóit', 'phrase', 'A0', 'Ско́лько сто́ит биле́т?', 'Was kostet das Ticket?', { tags: ['reisen'] }),
  w('v_gde_tualet', 'где туале́т?', 'wo ist die Toilette?', 'gde tualét', 'phrase', 'A0', 'Извини́те, где туале́т?', 'Entschuldigung, wo ist die Toilette?', { tags: ['reisen'] }),
  w('v_ya_ne_ponimayu', 'я не понима́ю', 'ich verstehe nicht', 'ja ne panimáju', 'phrase', 'A0', 'Извини́те, я не понима́ю.', 'Entschuldigung, ich verstehe nicht.', { tags: ['reisen'] }),
  w('v_vy_govorite_po_nemetski', 'вы говори́те по-неме́цки?', 'sprechen Sie Deutsch?', 'vy gavaríte pa-nemécki', 'phrase', 'A0', 'Вы говори́те по-неме́цки?', 'Sprechen Sie Deutsch?', { tags: ['reisen'] }),
  w('v_pomogite', 'помоги́те!', 'Hilfe!', 'pamagíte', 'phrase', 'A0', 'Помоги́те, пожа́луйста!', 'Helfen Sie bitte!', { tags: ['notfall'] }),
  w('v_skolko_eto', 'э́то ско́лько?', 'wie viel ist das?', 'éta skól’ka', 'phrase', 'A1', 'Э́то ско́лько вме́сте?', 'Wie viel ist das zusammen?', { tags: ['einkaufen'] }),
  w('v_mozhno_kartoy', 'мо́жно ка́ртой?', 'kann man mit Karte zahlen?', 'móžna kártaj', 'phrase', 'A1', 'Мо́жно плати́ть ка́ртой?', 'Kann man mit Karte zahlen?', { tags: ['einkaufen'] }),
  w('v_schet_pozhaluysta', 'счёт, пожа́луйста', 'die Rechnung, bitte', 'ščot pažálusta', 'phrase', 'A1', 'Официа́нт, счёт, пожа́луйста.', 'Herr Ober, die Rechnung bitte.', { tags: ['restaurant'] }),
  w('v_ya_khochu', 'я хочу́', 'ich möchte', 'ja chačú', 'phrase', 'A0', 'Я хочу́ во́ду.', 'Ich möchte Wasser.', { tags: ['restaurant'] }),
];

/** Base course words plus the A2–C1 extension. */
export const vocabulary: Vocab[] = [...baseVocabulary, ...advancedVocab];

export const vocabById: Record<string, Vocab> = Object.fromEntries(
  vocabulary.map((entry) => [entry.id, entry]),
);

export function getVocab(id: string): Vocab | undefined {
  return vocabById[id];
}

export function vocabByLevel(level: Vocab['level']): Vocab[] {
  return vocabulary.filter((entry) => entry.level === level);
}

/** Random distractor pool for multiple-choice exercises. */
export function distractorTranslations(correctId: string, count = 3): string[] {
  const correct = vocabById[correctId];
  if (!correct) return [];
  const pool = vocabulary.filter((entry) => entry.id !== correctId && entry.type === correct.type);
  const fallback = vocabulary.filter((entry) => entry.id !== correctId);
  const source = pool.length >= count ? pool : fallback;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((entry) => entry.de);
}

export function distractorWords(correctId: string, count = 3): string[] {
  const correct = vocabById[correctId];
  if (!correct) return [];
  const shuffled = vocabulary
    .filter((entry) => entry.id !== correctId)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  return shuffled.map((entry) => entry.ru);
}
