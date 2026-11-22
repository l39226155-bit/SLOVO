/**
 * Content integrity check — run with `bun scripts/verify-content.ts`.
 * Fails with a non-zero exit code if references or answers are inconsistent.
 */
import { alphabet } from '../src/data/alphabet';
import { chapters, lessons } from '../src/data/course';
import { grammarTopics } from '../src/data/grammar';
import { listeningItems } from '../src/data/listening';
import { scenarios } from '../src/data/scenarios';
import { vocabulary, vocabById } from '../src/data/vocabulary';
import type { Exercise } from '../src/data/types';

const problems: string[] = [];
const warn = (message: string) => problems.push(message);

/* ids ------------------------------------------------------------------ */
const vocabIds = new Set<string>();
vocabulary.forEach((entry) => {
  if (vocabIds.has(entry.id)) warn(`doppelte Vokabel-ID: ${entry.id}`);
  vocabIds.add(entry.id);
  if (!entry.ru || !entry.de || !entry.transcription) warn(`unvollständige Vokabel: ${entry.id}`);
  if (!entry.example?.ru || !entry.example?.de) warn(`fehlender Beispielsatz: ${entry.id}`);
});

const chapterIds = new Set(chapters.map((chapter) => chapter.id));
const lessonIds = new Set<string>();
const grammarSlugs = new Set(grammarTopics.map((topic) => topic.slug));

/* exercises ------------------------------------------------------------ */
function checkExercise(exercise: Exercise, where: string) {
  switch (exercise.kind) {
    case 'choice':
      if (exercise.options.length < 2) warn(`${where}: zu wenige Optionen (${exercise.id})`);
      if (exercise.answer < 0 || exercise.answer >= exercise.options.length)
        warn(`${where}: Antwortindex außerhalb (${exercise.id})`);
      if (new Set(exercise.options).size !== exercise.options.length) warn(`${where}: doppelte Optionen (${exercise.id})`);
      break;
    case 'listen':
      if (exercise.answer < 0 || exercise.answer >= exercise.options.length)
        warn(`${where}: Antwortindex außerhalb (${exercise.id})`);
      if (!exercise.audio) warn(`${where}: kein Audio (${exercise.id})`);
      break;
    case 'translate':
    case 'type':
    case 'cloze':
      if (!exercise.answers || exercise.answers.length === 0) warn(`${where}: keine Lösung (${exercise.id})`);
      break;
    case 'order':
      if (!exercise.words.length) warn(`${where}: keine Wörter (${exercise.id})`);
      break;
    case 'match':
      if (exercise.pairs.length < 2) warn(`${where}: zu wenige Paare (${exercise.id})`);
      break;
    case 'speak':
      if (!exercise.target || !exercise.translation) warn(`${where}: Sprechübung unvollständig (${exercise.id})`);
      break;
    default:
      break;
  }
}

lessons.forEach((lesson) => {
  if (lessonIds.has(lesson.id)) warn(`doppelte Lektions-ID: ${lesson.id}`);
  lessonIds.add(lesson.id);
  if (!chapterIds.has(lesson.chapterId)) warn(`${lesson.id}: unbekanntes Kapitel ${lesson.chapterId}`);
  if (lesson.exercises.length < 4) warn(`${lesson.id}: nur ${lesson.exercises.length} Übungen`);
  if (lesson.vocabIds.length === 0) warn(`${lesson.id}: keine Vokabeln`);
  lesson.vocabIds.forEach((id) => {
    if (!vocabById[id]) warn(`${lesson.id}: unbekannte Vokabel ${id}`);
  });
  lesson.grammarSlugs?.forEach((slug) => {
    if (!grammarSlugs.has(slug)) warn(`${lesson.id}: unbekannte Grammatik ${slug}`);
  });
  lesson.exercises.forEach((exercise) => checkExercise(exercise, lesson.id));
});

grammarTopics.forEach((topic) => {
  if (topic.sections.length === 0) warn(`Grammatik ${topic.slug}: keine Abschnitte`);
  if (topic.exercises.length === 0) warn(`Grammatik ${topic.slug}: keine Übungen`);
  topic.sections.forEach((section) => {
    if (!section.heading || !section.body) warn(`Grammatik ${topic.slug}: unvollständiger Abschnitt`);
  });
  topic.exercises.forEach((exercise) => checkExercise(exercise, `grammar:${topic.slug}`));
});

listeningItems.forEach((item) => {
  if (item.lines.length === 0) warn(`Hören ${item.id}: keine Zeilen`);
  if (item.questions.length === 0) warn(`Hören ${item.id}: keine Fragen`);
  item.questions.forEach((question, index) => {
    if (question.answer < 0 || question.answer >= question.options.length)
      warn(`Hören ${item.id}: Antwortindex außerhalb (Frage ${index + 1})`);
  });
});

scenarios.forEach((scenario) => {
  if (!scenario.opening.ru || scenario.keyPhrases.length === 0) warn(`Szenario ${scenario.id}: unvollständig`);
});

/* alphabet ------------------------------------------------------------- */
if (alphabet.length !== 33) warn(`Alphabet hat ${alphabet.length} statt 33 Buchstaben`);
alphabet.forEach((letter) => {
  if (!letter.upper || !letter.lower || !letter.example?.ru) warn(`Buchstabe unvollständig: ${letter.lower}`);
  if (letter.upper.toLowerCase() !== letter.lower.toLowerCase())
    warn(`Buchstabenpaar passt nicht: ${letter.upper}/${letter.lower}`);
});

/* stats ---------------------------------------------------------------- */
const counts = {
  lessons: lessons.length,
  chapters: chapters.length,
  vocabulary: vocabulary.length,
  grammar: grammarTopics.length,
  listening: listeningItems.length,
  scenarios: scenarios.length,
  alphabet: alphabet.length,
};

if (problems.length > 0) {
  console.error(`❌ ${problems.length} Probleme gefunden:`);
  problems.forEach((problem) => console.error(' -', problem));
  process.exit(1);
}

console.log('✅ Inhalte konsistent', counts);
