export function buildTrickPrompt(trickName: string): string {
  return `Je bent een ervaren wakeboard-instructeur en schrijft voor wakeboard-nl.nl.

Genereer een complete, gedetailleerde beschrijving van de wakeboard-trick: "${trickName}"

Geef je antwoord als EXACT ÉÉN JSON-object met de volgende structuur. Schrijf alles in het Nederlands.

{
  "description": "Een duidelijke beschrijving van de trick in 2-4 zinnen. Leg uit wat de trick inhoudt en waarom deze populair is.",
  "category": "surface | ollie | invert | grab | rail | switch",
  "difficulty_level": 1-5,
  "direction": "regular | switch | both",
  "trick_type": "boot | cable | both",
  "prerequisites": {
    "tricks": ["Lijst van tricks die je eerst moet beheersen"],
    "physical": ["Fysieke vaardigheden die nodig zijn, bijv. 'Goede core-stabiliteit'"],
    "mental": ["Mentale vaardigheden, bijv. 'Durf om achterover te leunen'"]
  },
  "equipment": {
    "board_type": "Welk type board het beste werkt (bijv. 'Continuous rocker voor meer pop')",
    "fins": "Fin-setup aanbeveling",
    "protection": "Aanbevolen bescherming (helm, vest, etc.)",
    "speed": "Aanbevolen snelheid (boot in km/h of kabelsnelheid)",
    "line_length": "Aanbevolen lijnlengte (bij boot) of n.v.t.",
    "obstacle_type": "Type obstakel indien van toepassing (rail, kicker, etc.) of leeg"
  },
  "steps": {
    "approach": {
      "edge_type": "Type edge (heelside/toeside) en hoek",
      "speed_buildup": "Hoe je snelheid opbouwt",
      "body_position": "Lichaamspositie tijdens aanloop"
    },
    "takeoff": {
      "timing": "Wanneer en hoe je afzet",
      "weight_distribution": "Gewichtsverdeling bij afzet",
      "rotation": "Rotatie-initiatie (indien van toepassing)"
    },
    "air": {
      "focus_point": "Waar je naar kijkt in de lucht",
      "grab_timing": "Timing van de grab (indien van toepassing)",
      "knee_position": "Positie van de knieën"
    },
    "landing": {
      "board_position": "Hoe het board gepositioneerd moet zijn",
      "edge_choice": "Op welke edge je landt",
      "knee_absorption": "Hoe je de landing opvangt met je knieën",
      "ride_out": "Hoe je doorrijdt na de landing"
    }
  },
  "common_mistakes": [
    {
      "mistake": "Korte beschrijving van de fout",
      "explanation": "Waarom dit een fout is en hoe je het voorkomt"
    }
  ],
  "exercise_progression": [
    {
      "title": "Naam van de oefenstap",
      "description": "Wat je moet doen in deze stap"
    }
  ],
  "safety": {
    "injury_risks": ["Lijst van mogelijke blessures bij deze trick"],
    "safe_falling": "Hoe je veilig kunt vallen als de trick mislukt",
    "when_to_stop": "Wanneer je moet stoppen met oefenen (vermoeidheid, pijn, etc.)"
  },
  "variations": [
    {
      "name": "Naam van de variatie",
      "description": "Beschrijving van wat anders is"
    }
  ]
}

Regels:
- Geef minimaal 3 common_mistakes
- Geef minimaal 4 exercise_progression stappen (van makkelijk naar moeilijk)
- Geef minimaal 2 variations
- Geef minimaal 2 injury_risks
- Alle teksten in het Nederlands
- Wees specifiek en praktisch — dit is bedoeld als echte instructie
- Als een veld niet van toepassing is op deze trick, gebruik dan een lege string of leeg array
- Antwoord met ALLEEN het JSON-object, geen andere tekst ervoor of erna`
}
