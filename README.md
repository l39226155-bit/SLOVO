# SLOVO — Russisch lernen

Eine Premium-Lern-App für Russisch (A0 → C1), gebaut mit Expo, React Native und TypeScript.
Dunkles, minimalistisches Design, echter A0/A1-Kurs, Vokabeltrainer mit Spaced Repetition,
Alphabet- und Grammatiktraining, Hörverständnis, Ausspracheübung und ein KI-Tutor über einen
eigenen Proxy.

![Platform](https://img.shields.io/badge/iOS%20%7C%20Android%20%7C%20Web-Expo-black)

---

## 1. Schnellstart

Auf diesem Rechner liegt Bun portabel unter `.tools/bun-windows-x64/bun.exe` (keine
Systeminstallation nötig). Wenn Bun global installiert ist, reicht `bun`.

```bash
# Abhängigkeiten (bereits installiert)
bun install

# Web-Vorschau (schnellster Weg, die App zu sehen)
bun run web            # http://localhost:8081

# iOS / Android (Expo Go oder Dev-Build)
bun run ios
bun run android

# Prüfungen
bun run typecheck                    # App (tsc)
bun scripts/verify-content.ts        # Inhaltskonsistenz
bunx tsc --noEmit -p tsconfig.server.json   # Server-Proxy
```

Mit dem portablen Bun:

```bash
.tools/bun-windows-x64/bun.exe run web
```

### KI-Tutor aktivieren

Der Tutor läuft **nicht** im Client, sondern über einen kleinen Proxy in `server/tutor-proxy.ts`.
Der API-Schlüssel bleibt dort. Ohne Konfiguration zeigt die App im Tutor-Bereich einen
transparenten Setup-Hinweis; alle anderen Bereiche funktionieren vollständig.

```bash
# Terminal 1 – Proxy (beliebiger OpenAI-kompatibler Anbieter)
OPENAI_API_KEY=sk-… bun run tutor
# optional: OPENAI_BASE_URL, TUTOR_MODEL (Default: gpt-4o-mini), PORT (Default: 8787)

# Terminal 2 – App mit Proxy-URL
EXPO_PUBLIC_TUTOR_API_URL=http://localhost:8787 bun run web
```

Der Proxy antwortet auf `POST /chat` mit `{ level, scenarioTitle, goal, messages }` und liefert
`{ reply }`. Er baut den System-Prompt serverseitig (Niveau, Rollenspiel, Korrekturformat) und
begrenzt Verlauf und Antwortlänge.

---

## 2. Was die App kann

| Bereich | Umsetzung |
| --- | --- |
| Onboarding | 7 Schritte: Sprache, Ziel, Einstufungstest (3 Fragen) oder Start bei null, Tagesziel, Name, Zusammenfassung |
| Dashboard | Begrüßung, Serie, Tagesziel, Wochenbalken, Empfehlungen, letzte Aktivitäten |
| Kurs | 14 Kapitel, 20 Lektionen (A0–C1), sequenzielle Freischaltung, Kapitel- und Gesamtfortschritt |
| Lektions-Player | 7 Übungstypen: Multiple Choice, Übersetzen (beide Richtungen), Lückentext, Zuordnung, Satzbau, Hören, Sprechen; Auswertung, XP, Wiederholung |
| Vokabeltrainer | 144 Wörter, Suche, Filter (fällig/gespeichert/schwierig), Detailansicht, Audio, Merkliste, SM-2-Wiederholung |
| Review-Session | 4 Modi (RU→DE, DE→RU, Multiple Choice, Hören), Bewertung in 4 Stufen, echte SRS-Planung |
| Alphabet | 33 Buchstaben, Lautschrift, Beispielwort, Audio, Quiz, Schreibfeld (Finger/Freihand), Wörter mit dem Buchstaben |
| Grammatik | 14 Themen inkl. aller sechs Fälle, Tabellen, Beispiele mit Audio, integrierte Übungen |
| Hören | 4 Dialoge/Geschichten, Zeile-für-Zeile-Audio, Untertitel und Übersetzung schaltbar, 3 Geschwindigkeiten, Verständnisfragen |
| Aussprache | Modell-Audio, Mikrofonaufnahme, Spracherkennung, Wort-für-Wort-Bewertung, Fehleranzeige |
| KI-Tutor | 9 Szenarien, niveauabhängiger Chat, Audioausgabe, Setup-Zustand transparent |
| Statistik | Heute/Woche/Monat, Serie, XP, Wörter, Trefferquote pro Bereich, Schwächenanalyse, Aktivitätsverlauf |
| Profil & Einstellungen | Name, Niveau, Ziel, Tagesziel, Audio, Transkription, Sprechgeschwindigkeit, Erinnerungen (Uhrzeit, Tage, Ziel, Typ), Fortschritt zurücksetzen |
| Lernplan | Gemessenes Niveau, Empfehlungen, Wissenslücken, Tagesplan, Schwierigkeitsanpassung |
| Tages-Challenges | Vier datumsabhängige Aufgaben, Fortschritt aus echten Aktivitäten, kleine XP-Belohnung |
| Eigene Vokabeln | Anlegen, bearbeiten, Kategorien, Favoriten, Sammlungen, Import/Export, Abfrage mit Schwierigkeits-sortierung |
| Russischer Alltag | 10 Situationen mit selbst formulierten Antworten, Musterlösung und Grammatikhinweis |
| Wörterbuch | 159 Einträge, Suche in Russisch/Deutsch, Teilbegriffe und Tippfehler, Wortformen, Betonung, Beispiele |
| Satztrainer | 7 Kategorien, alternative Formulierungen, Erklärung und typische Fehler |
| Schreibtraining | Abschreiben, Lücken, Sätze, freier Text mit Wortprüfung und Korrekturvorschlägen |
| Geschichten | 5 Texte mit Übersetzung, Satzaudio, antippbaren Wörtern und Fragen |
| Offline & Daten | Verbindungsstatus, Speicherübersicht, Fortschritts-Export |
| Einstufungstest | 20 Aufgaben aus Wortschatz, Grammatik, Lesen, Satzbau und Hören mit Niveauempfehlung |

Alle sichtbaren Werte stammen aus echten Aktivitäten (`store/useAppStore.ts` → `activities`),
es gibt keine hartcodierten Fortschrittsbalken.

### Inhalte

- 33 Buchstaben mit deutschen Lautbeschreibungen, Transkription und Beispielwort
- 184 Vokabeln (A0–C1) mit Betonung, Transkription, Wortart, Genus, Grammatikhinweis und Beispielsatz
- 20 Lektionen mit 5–7 Übungen, 6 Niveaus
- 14 Grammatikthemen, 6 davon die Fälle, jeweils mit Tabellen, Beispielen und 3–4 Übungen
- 4 Hörtexte mit 2–3 Verständnisfragen
- 9 Tutor-Szenarien (Café, Restaurant, Einkaufen, Reisen, Schule, Freunde, Alltag, Hotel, Bahnhof)

`bun scripts/verify-content.ts` prüft alle IDs, Antwortindizes und Verweise.

---

## 3. Architektur

```
app/                     Expo-Router-Routen (Datei = Route)
  (tabs)/                home · course · vocab · alphabet · more
  lesson/[id].tsx        Lektions-Player
  review.tsx             SRS-Session
  alphabet/[letter].tsx  Buchstaben-Detail + Schreibfeld
  grammar/               Übersicht + Thema mit Übungen
  listening/             Übersicht + Player
  tutor.tsx              KI-Chat
  speaking.tsx           Aussprachetraining
  stats.tsx              Statistiken
  settings.tsx           Profil & Einstellungen
  onboarding.tsx         7-Schritt-Flow
src/
  components/ui.tsx      Design-System (Text, Screen, Surface, Buttons, Progress, ListRow, Dialog …)
  theme/tokens.ts        Farben, Abstände, Radien, Typografie, Motion
  data/                  Inhalte + Typsystem + Kurslogik (Freischaltung, Fortschritt)
  services/              Audio-Manager (TTS), SRS (SM-2), Spracherkennung, Tutor-Client, Formatierung
  store/                 Zustand-Store (persistiert via AsyncStorage) + Selektoren
server/tutor-proxy.ts    Bun-Proxy für den KI-Tutor
scripts/verify-content.ts Inhalts-Validator
supabase/schema.sql      Vorlage für Cloud-Sync (noch nicht aktiv)
```

### Entscheidungen

- **Lokal-first statt Konto-Zwang.** Der Fortschritt liegt in AsyncStorage (Web: localStorage).
  Das erfüllt „vom ersten Start an funktionsfähig“ ohne Login-Hürde. Das Schema in
  `supabase/schema.sql` beschreibt die Tabellen und RLS-Policies, falls Konten und Synchronisierung
  später ergänzt werden sollen.
- **Kein API-Schlüssel im Client.** Der Tutor spricht ausschließlich mit dem eigenen Proxy.
- **Audio ohne Assets.** `expo-speech` nutzt die Systemstimmen (ru-RU). Ein zentraler Manager
  (`src/services/audio.ts`) verwaltet alles: genau ein Sprechvorgang, Token gegen verspätete
  Callbacks, Pause/Fortsetzen, Wiederholen, Stopp, Geschwindigkeit und Sequenzen für Hörtexte.
  Jeder Button läuft über `AudioButton` und zeigt idle/loading/playing/paused/error.
- **Stimme fehlt?** Das ist der einzige echte Fallstrick: Ist im System keine russische Stimme
  installiert, sagt die App das beim Antippen deutlich – sie spielt keine leere Animation ab.
  Windows: Einstellungen → Zeit und Sprache → Sprache und Region → Sprache hinzufügen →
  Русский (Sprachpaket) → Browser neu starten. iOS/Android bringen russische Stimmen mit;
  für bessere Qualität unter iOS Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen.
  Android: Einstellungen → System → Sprachen → Text-to-Speech-Ausgabe → Russisch installieren.
- **Spracherkennung.** Web nutzt die Web Speech API (`ru-RU`). Auf nativen Geräten gibt es ohne
  zusätzlichen STT-Dienst kein Transkript; die App sagt das offen und bietet Modell-Audio an.
- **Animationen** mit der RN-`Animated`-API statt Reanimated, um Web und Native ohne zusätzliche
  Babel-Konfiguration identisch zu halten.

---

## 4. Bewusste Lücken (ehrlich)

1. **A2–C1 sind strukturell vorbereitet, aber inhaltlich leer.** Kapitel, Typen und
   Freischaltlogik sind generisch; es fehlen die Kurstexte für diese Niveaus.
2. **Erinnerungen sind lokal und nur nativ.** Die Einstellungen planen echte lokale
   Benachrichtigungen (Uhrzeit, Wochentage, Ziel, Typ). Im Browser gibt es keine lokalen
   Notifications – die App sagt das offen, statt einen Schalter ohne Wirkung zu zeigen.
3. **Keine Konten, keine Cloud-Synchronisierung.** Schema liegt bereit, Client-Anbindung fehlt.
4. **Kein Bild-Zuordnungsmodus** im Vokabeltrainer (die übrigen sechs Modi sind umgesetzt).
5. **Aussprachebewertung** vergleicht erkannte Wörter, nicht Phoneme – gut für Betonung, kein
   Ersatz für eine Lehrkraft.
6. **Native Spracherkennung** erfordert einen zusätzlichen Dienst (z. B. über den Proxy).
7. **Keine automatisierten Tests.** Geprüft sind TypeScript (App + Server) und die
   Inhaltskonsistenz; UI-Flows wurden manuell im Browser durchlaufen.

---

## 5. Design

Farben, Abstände und Typografie kommen ausschließlich aus `src/theme/tokens.ts`. Es gibt einen
Akzent, neutrale Flächen und keine Verläufe:

| Rolle | Wert |
| --- | --- |
| Hintergrund | `#0A0B0D` |
| Fläche | `#111214` |
| Erhöhte Fläche | `#17191C` |
| Akzent | `#8B7BFF` |
| Text | `#F2F3F5` / `#9CA3AD` / `#6C737D` |
| Erfolg / Fehler / Warnung | `#5FBF94` / `#E2727F` / `#D9A75E` |

Abstände 4/8/12/16/24/32/48, Radien 8/12/16 (Pill nur für runde Buttons), Typo-Skala
11/13/15/17/22/28 px. Aufbau: `Screen` + `ScreenHeader` als Rahmen, `Surface` nur dort, wo eine
Fläche wirklich trennt, `ListRow`/`Divider` für Listen statt Kartenstapel. Keine Emojis, keine
Badges, keine dekorativen Icons.

Wiederverwendbare Bausteine: `Text`, `Button`, `IconButton`, `Input`, `Segmented`, `ProgressBar`,
`Metric`, `ListRow`, `Dialog`, `EmptyState` (`src/components/ui.tsx`) sowie `AudioButton` und
`AudioErrorToast` (`src/components/AudioButton.tsx`).
