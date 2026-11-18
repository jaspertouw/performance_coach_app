# Form — Performance Coach

Een lokale, offline-first trainingsapp voor weekschema's, mobiliteitsroutines en voortgang. Alle persoonlijke gegevens blijven in IndexedDB op het apparaat waarop je de app gebruikt.

## Garmin en handmatige sessies

De app gebruikt één gezamenlijke geschiedenis met drie bronnen:

- **Garmin:** objectieve activiteitgegevens zoals afstand, duur, hartslag, zones en Training Effect.
- **Handmatig:** je planning, ervaren inspanning, notities en kniepijn.
- **Mobility:** routines die geen Garmin-activiteit nodig hebben.

Bij Garmin-import probeert de app alleen een koppeling te maken wanneer op dezelfde datum precies één nog openstaande training van dezelfde sport staat. De training blijft open totdat je zelf feedback invult. Daarna verschijnen Garmin-metingen en je eigen feedback als één sessie, zonder dubbeltelling.

De knop **Garmin-activiteiten importeren** accepteert een JSON-array of een object met een `activities`-array. Zie [het voorbeeldbestand](./examples/garmin-import.example.json). Activiteit-ID en starttijd zijn verplicht; overige velden zijn optioneel. Dit is de eerste lokale integratiestap. Later kan Codex zo'n bestand uit de bestaande Garmin-workflow genereren of kan er automatische synchronisatie worden toegevoegd.

## Weekplannen

Een weekplan wordt op de laptop met Codex gemaakt en als `plans/current.json` gepubliceerd. Gebruik in de app **Gegevens → Nieuwste weekplan ophalen**. De preview toont hoeveel trainingen nieuw, gewijzigd of beschermd zijn. Handmatige bestandsimport blijft als terugvaloptie beschikbaar.

Alleen het openbare weekschema komt in de repository. Voltooide feedback, Garmin-data, pijnscores en back-ups blijven lokaal en horen niet in `plans/current.json`.

- Nieuwe workout-ID: training wordt toegevoegd.
- Bestaand ID van een openstaande training: planning wordt bijgewerkt.
- Bestaand ID van een voltooide training: resultaat en planning blijven ongewijzigd.
- Weggelaten trainingen worden niet automatisch verwijderd.

Het planformaat gebruikt `type: "form-week-plan"`, `schemaVersion: 1`, een ISO-week-ID en een lijst `workouts`. In de lokale coachmap staat een compleet voorbeeld.

## Lokaal starten

Open Terminal in deze map en start een eenvoudige webserver:

```sh
python3 -m http.server 4173
```

Open daarna `http://localhost:4173`. Een webserver is nodig omdat service workers en ES modules niet betrouwbaar vanaf een los `file://`-adres werken.

## Back-ups

Open rechtsboven het menu met de drie puntjes. Download daar een volledige JSON-back-up of een CSV-bestand voor Excel. Bij import toont de app eerst hoeveel nieuwe items worden toegevoegd. Bestaande items met hetzelfde ID worden niet overschreven.

## GitHub Pages

Deze map is voorbereid als zelfstandige openbare repository. De workflow in `.github/workflows/pages.yml` publiceert de volledige app automatisch zodra wijzigingen naar `main` worden gepusht. Activeer in de repository onder **Settings → Pages** bij **Source** de optie **GitHub Actions**.

## iPhone

Open de gepubliceerde URL in Safari, tik op **Deel** en kies **Zet op beginscherm**. Open de app eenmaal met internet zodat de offline bestanden worden opgeslagen. Exporteer regelmatig een back-up naar je laptop.
