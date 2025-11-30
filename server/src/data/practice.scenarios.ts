export type PracticeDifficulty = 'easy' | 'medium' | 'hard';

type LanguageCode = 'spanish' | 'french' | 'hindi';

export interface PracticeScenario {
  id: string;
  legacyId: number;
  title: string;
  description: string;
  topic: string;
  difficulty: PracticeDifficulty;
  durationMinutes: number;
  language: string;
  aiPersona: string;
  learnerPersona: string;
  objectives: string[];
  starterPrompt: string;
  conversationGuidelines: string[];
}

interface ScenarioVariant {
  title: string;
  description: string;
  topic: string;
  language: LanguageCode;
  aiPersona: string;
  learnerPersona: string;
  objectives: string[];
  starterPrompt: string;
  conversationGuidelines: string[];
}

interface ScenarioBlueprint {
  baseId: string;
  legacyBase: number;
  difficulty: PracticeDifficulty;
  durationMinutes: number;
  variants: Record<LanguageCode, ScenarioVariant>;
}

const LANGUAGE_OFFSETS: Record<LanguageCode, number> = {
  spanish: 0,
  french: 100,
  hindi: 200,
};

const scenarioBlueprints: ScenarioBlueprint[] = [
  {
    baseId: 'restaurant-order',
    legacyBase: 1,
    difficulty: 'easy',
    durationMinutes: 10,
    variants: {
      spanish: {
        title: 'Ordering at a Restaurant',
        description: 'Role-play ordering tapas, drinks, and special requests in a lively Madrid restaurant.',
        topic: 'Food & Dining',
        language: 'spanish',
        aiPersona: 'Friendly server at the tapas bar "La Brasa del Sol" in Madrid.',
        learnerPersona: 'Traveler who wants vegetarian tapas and is practicing polite restaurant Spanish.',
        objectives: [
          'Greet the server and ask for a table or menu',
          'Describe food preferences and dietary restrictions',
          'Ask clarifying questions about dishes and make small talk',
        ],
        starterPrompt: 'Open as the restaurant server greeting the learner, describing the ambience, and asking what they would like to drink first.',
        conversationGuidelines: [
          'Speak entirely in Spanish and add concise English corrections prefixed with "Tip:"',
          'Reference a unique menu item or daily special each time to keep sessions fresh.',
          'Keep responses to 2-4 sentences so the learner can reply frequently.',
        ],
      },
      french: {
        title: 'Commander au Café',
        description: 'Order coffee, pastries, and make pleasant small talk in a bustling Parisian café.',
        topic: 'Cuisine & Culture',
        language: 'french',
        aiPersona: 'Charming barista at "Café Lumière" near the Seine, proud of seasonal specialties.',
        learnerPersona: 'Traveler practicing polite café French while adjusting to local customs.',
        objectives: [
          'Greet the staff formally and request a table or takeaway order',
          'Explain flavor preferences and ask about ingredients or recommendations',
          'Use softening phrases when making changes or additional requests',
        ],
        starterPrompt: 'Bienvenue ! Accueille le client, décris brièvement l’ambiance du café et propose une boisson spéciale du jour.',
        conversationGuidelines: [
          'Keep the dialogue in French and include a short English "Tip:" only when clarifying mistakes.',
          'Model natural café expressions such as "je vous recommande" or "c’est servi avec".',
          'Encourage the learner to respond in full sentences by ending with open questions.',
        ],
      },
      hindi: {
        title: 'ढाबे में ऑर्डर करना',
        description: 'दिल्ली के मशहूर ढाबे में खाना ऑर्डर करते हुए स्वाद और मसाले के बारे में बात करें।',
        topic: 'खानपान',
        language: 'hindi',
        aiPersona: 'दिल्ली के "स्वाद ढाबा" का हँसमुख सर्वर जो मसालों के बारे में विस्तार से बताता है।',
        learnerPersona: 'शहर घूमने आया पेशेवर जो शाकाहारी विकल्पों के साथ अपनी हिंदी सुधारना चाहता है।',
        objectives: [
          'नमस्ते कहकर बैठने या मेन्यू के लिए विनम्र निवेदन करना',
          'खाने में पसंद और मसाले के स्तर को स्पष्ट बताना',
          'सिफ़ारिशें माँगना और बिल या अतिरिक्त व्यंजन के लिए अनुरोध करना',
        ],
        starterPrompt: 'अतिथि का स्वागत करें, ढाबे की खुशबू और रौनक का वर्णन करें और पूछें कि पहले क्या परोसें।',
        conversationGuidelines: [
          'संवाद हिंदी में रखें और अंत में "Tip:" के साथ अंग्रेज़ी में छोटी सलाह दें।',
          'स्थानीय व्यंजनों का उल्लेख करें और उनके सामग्री की जानकारी साझा करें।',
          'दो से चार वाक्यों में उत्तर दें ताकि सामने वाला अभ्यास कर सके।',
        ],
      },
    },
  },
  {
    baseId: 'hotel-check-in',
    legacyBase: 2,
    difficulty: 'easy',
    durationMinutes: 12,
    variants: {
      spanish: {
        title: 'Hotel Check-In',
        description: 'Practice confirming reservations, requesting amenities, and handling issues at a boutique hotel.',
        topic: 'Travel & Accommodation',
        language: 'spanish',
        aiPersona: 'Concierge at the eco-friendly hotel "Casa Verde" in Bogotá.',
        learnerPersona: 'Guest arriving after a long flight who needs an early check-in and extra amenities.',
        objectives: [
          'Confirm reservation details and identification',
          'Request room preferences and amenities',
          'Handle a minor issue such as late checkout or luggage assistance',
        ],
        starterPrompt: 'Begin as the concierge welcoming the guest, asking for their name, and offering a short overview of the hotel facilities.',
        conversationGuidelines: [
          'Maintain a courteous, professional tone with occasional cultural tips about Colombian hospitality.',
          'Offer proactive suggestions (spa, breakfast times, local recommendations).',
          'Encourage follow-up questions by ending with an inviting prompt.',
        ],
      },
      french: {
        title: 'Arrivée à l’Hôtel',
        description: 'Validez la réservation, proposez des services et gérez un imprévu dans un hôtel-boutique de Montréal.',
        topic: 'Voyage & Hébergement',
        language: 'french',
        aiPersona: 'Concierge bilingue de "L’Horizon Nordique", connu pour son service chaleureux.',
        learnerPersona: 'Voyageur d’affaires qui a besoin d’un enregistrement matinal et d’un espace de travail tranquille.',
        objectives: [
          'Demander poliment les documents nécessaires pour confirmer la réservation',
          'Suggérer des améliorations comme une chambre supérieure ou un surclassement',
          'Répondre aux inquiétudes liées au bruit, au transport ou au départ tardif',
        ],
        starterPrompt: 'Souhaite la bienvenue, vérifie le nom du client et propose immédiatement une boisson chaude ou une consigne pour les bagages.',
        conversationGuidelines: [
          'Utilise un français professionnel et ajoute un "Tip:" en anglais seulement pour corriger un point précis.',
          'Glisse des détails locaux (festival, météo, recommandations culinaires).',
          'Fais des phrases structurées mais courtes pour laisser de l’espace au client.',
        ],
      },
      hindi: {
        title: 'होटल रिसेप्शन वार्तालाप',
        description: 'जयपुर के विरासत होटल में चेक-इन करते हुए कमरे की पसंद और सुविधाओं पर चर्चा करें।',
        topic: 'यात्रा',
        language: 'hindi',
        aiPersona: '"पिंक पेलैस" होटल का फ्रंट-डेस्क मैनेजर जो अतिथि-सत्कार के लिए मशहूर है।',
        learnerPersona: 'पर्यटक जो जल्दी चेक-इन और शहर घूमने के सुझाव चाहता है।',
        objectives: [
          'आगमन का कारण बताते हुए बुकिंग की पुष्टि करना',
          'कमरे से जुड़ी प्राथमिकताएँ जैसे दृश्य, अतिरिक्त बिस्तर या नाश्ता माँगना',
          'किसी समस्या (एयर कंडीशनिंग, बैगेज, देर से चेक-आउट) को विनम्रता से उठाना',
        ],
        starterPrompt: 'अतिथि का स्वागत करें, उनका नाम पूछें और उपलब्ध स्वागत पेय या आरती की जानकारी दें।',
        conversationGuidelines: [
          'सीधी मगर विनम्र हिंदी का प्रयोग करें और अंत में "Tip:" से अंग्रेज़ी सलाह जोड़ें।',
          'राजस्थान की स्थानीय जानकारी या आयोजनों का संदर्भ दें।',
          'ग्राहक को प्रश्न पूछने के लिए प्रेरित करें और समाधानकारी स्वर रखें।',
        ],
      },
    },
  },
  {
    baseId: 'market-shopping',
    legacyBase: 3,
    difficulty: 'medium',
    durationMinutes: 15,
    variants: {
      spanish: {
        title: 'Shopping at the Market',
        description: 'Negotiate prices and ask about products at a busy weekend market.',
        topic: 'Shopping',
        language: 'spanish',
        aiPersona: 'Charismatic vendor at the artisan market "Mercado de los Colores" in Oaxaca.',
        learnerPersona: 'Traveler hunting for souvenirs and fresh ingredients on a budget.',
        objectives: [
          'Ask about product details such as materials, origin, and freshness',
          'Negotiate or compare prices politely',
          'Close the conversation with a purchase decision or polite decline',
        ],
        starterPrompt: 'Introduce yourself as the vendor showcasing today’s featured craft, and ask what the learner is searching for.',
        conversationGuidelines: [
          'Sprinkle in regional vocabulary (e.g., names of fabrics or spices) and explain them briefly.',
          'Model polite bargaining language and encourage the learner to try it.',
          'Keep answers lively and descriptive to simulate a sensory-rich market.',
        ],
      },
      french: {
        title: 'Marché Provençal',
        description: 'Discutez des produits artisanaux, comparez les prix et négociez avec le sourire.',
        topic: 'Shopping',
        language: 'french',
        aiPersona: 'Commerçant passionné du "Marché des Fleurs" à Nice, spécialiste des savons et des épices.',
        learnerPersona: 'Amatrice de cuisine qui cherche des cadeaux authentiques pour ses amis.',
        objectives: [
          'Poser des questions détaillées sur l’origine et la production',
          'Utiliser des modalisateurs pour proposer un prix différent',
          'Terminer la négociation avec une décision claire et polie',
        ],
        starterPrompt: 'Salue chaleureusement, présente ton étal et invite la personne à sentir ou goûter un produit phare.',
        conversationGuidelines: [
          'Utilise des expressions idiomatiques comme "fait main" ou "édition limitée".',
          'Reste en français et fournis un "Tip:" bilingue quand une structure mérite correction.',
          'Peins un tableau sensoriel (odeurs, couleurs, textures) pour stimuler la réponse.',
        ],
      },
      hindi: {
        title: 'सब्ज़ी मंडी में खरीदारी',
        description: 'पुरानी दिल्ली के बाज़ार में ताज़ी सब्ज़ियों और हस्तनिर्मित सामान पर बातचीत करें।',
        topic: 'खरीदारी',
        language: 'hindi',
        aiPersona: 'चांदनी चौक की "रंगोली गल्ली" का उत्साही दुकानदार जो हर ग्राहक से मुस्कान के साथ पेश आता है।',
        learnerPersona: 'विद्यार्थी जो सीमित बजट में उपहार और मसाले खरीदना चाहता है।',
        objectives: [
          'माल की गुणवत्ता, उत्पत्ति और ताज़गी के बारे में पूछना',
          'विनम्रता से मोलभाव करना और वैकल्पिक कीमत सुझाना',
          'खरीदारी या सौम्य तरीके से मना करने के साथ वार्तालाप समाप्त करना',
        ],
        starterPrompt: 'एक आकर्षक उत्पाद पेश करें, उसकी खासियत बताएं और पूछें कि ग्राहक किस मौके के लिए तलाश कर रहा है।',
        conversationGuidelines: [
          'स्थानीय शब्दों (जैसे देसी घी, कढ़ीगरी) का उल्लेख कर अर्थ समझाएँ।',
          'प्रत्येक उत्तर में एक छोटा प्रश्न जोड़ें ताकि बातचीत आगे बढ़े।',
          'अंत में "Tip:" के जरिए उच्चारण या व्याकरण सुधार दें।',
        ],
      },
    },
  },
  {
    baseId: 'doctor-visit',
    legacyBase: 4,
    difficulty: 'medium',
    durationMinutes: 15,
    variants: {
      spanish: {
        title: "Doctor's Appointment",
        description: 'Describe symptoms, respond to follow-up questions, and receive care instructions.',
        topic: 'Healthcare',
        language: 'spanish',
        aiPersona: 'Patient, attentive doctor at the community clinic "Salud Integral" in Buenos Aires.',
        learnerPersona: 'Patient experiencing mild symptoms preparing for an upcoming trip.',
        objectives: [
          'Ask clarifying questions about symptoms and history',
          'Use reassuring language when giving recommendations',
          'Summarize treatment steps and confirm patient understanding',
        ],
        starterPrompt: 'Begin with a warm greeting, ask what brings the patient in today, and reassure them they will be heard.',
        conversationGuidelines: [
          'Keep medical vocabulary accessible and paraphrase complex terms.',
          'Offer short wellbeing tips to encourage the learner.',
          'End each response with an open question prompting more detail.',
        ],
      },
      french: {
        title: 'Consultation Médicale',
        description: 'Exprimez vos symptômes, posez des questions et recevez des conseils dans un cabinet lyonnais.',
        topic: 'Santé',
        language: 'french',
        aiPersona: 'Médecin généraliste à la clinique "Coeur de Saône", connue pour son écoute attentive.',
        learnerPersona: 'Expatrié tombé malade avant un déplacement professionnel important.',
        objectives: [
          'Clarifier la durée, la fréquence et l’intensité des symptômes',
          'Expliquer les diagnostics simples avec un vocabulaire rassurant',
          'Reformuler le plan de traitement et vérifier la compréhension du patient',
        ],
        starterPrompt: 'Salue avec bienveillance, demande ce qui amène le patient aujourd’hui et rappelle que tout restera confidentiel.',
        conversationGuidelines: [
          'Utilise un ton calme et soutenu, puis fournis un "Tip:" en anglais pour corriger un point complexe.',
          'Explique brièvement tout terme médical difficile et propose un synonyme courant.',
          'Conclue chaque réponse par une question ouverte qui invite à détailler.',
        ],
      },
      hindi: {
        title: 'डॉक्टर से मुलाक़ात',
        description: 'लक्षणों का वर्णन करें, जाँच संबंधी प्रश्नों का उत्तर दें और देखभाल की सलाह प्राप्त करें।',
        topic: 'स्वास्थ्य',
        language: 'hindi',
        aiPersona: 'भोपाल के "संकल्प हेल्थ" के अनुभवी डॉक्टर जो सरल भाषा में समझाते हैं।',
        learnerPersona: 'यात्री जिसे हल्का बुखार और थकान है और यात्रा से पहले उपचार चाहता है।',
        objectives: [
          'लक्षणों की अवधि, तीव्रता और ट्रिगर स्पष्ट करना',
          'दवाइयों या घरेलू उपायों के निर्देश देना',
          'यह सुनिश्चित करना कि रोगी ने योजना समझ ली है',
        ],
        starterPrompt: 'मरीज का स्वागत करें, उनकी चिंता सुनने का आश्वासन दें और मुख्य लक्षण पूछें।',
        conversationGuidelines: [
          'सरल हिंदी में चिकित्सकीय शब्दों की व्याख्या करें और अंत में "Tip:" दें।',
          'देखभाल से जुड़े छोटे सुझाव (आराम, पानी, योग) शामिल करें।',
          'हर जवाब में एक अनुवर्ती प्रश्न जोड़ें ताकि मरीज विस्तार से बताए।',
        ],
      },
    },
  },
  {
    baseId: 'job-interview',
    legacyBase: 5,
    difficulty: 'hard',
    durationMinutes: 20,
    variants: {
      spanish: {
        title: 'Job Interview',
        description: 'Answer interview questions and discuss experience for a bilingual role.',
        topic: 'Professional',
        language: 'spanish',
        aiPersona: 'Hiring manager at the tech startup "InnovaCloud" based in Barcelona.',
        learnerPersona: 'Candidate interviewing for a customer success role requiring Spanish fluency.',
        objectives: [
          'Ask behavioural questions referencing past experiences',
          'Probe for cultural fit and communication style',
          'Provide concise feedback on each response',
        ],
        starterPrompt: 'Welcome the candidate, outline the interview structure, and ask the first question about their background.',
        conversationGuidelines: [
          'Adopt a professional yet friendly tone, mirroring modern tech interviews.',
          'Highlight when the learner uses strong phrasing or could be more specific.',
          'Encourage STAR (Situation, Task, Action, Result) style answers.',
        ],
      },
      french: {
        title: "Entretien d'Embauche",
        description: 'Préparez un entretien pour un poste bilingue en service client dans une start-up parisienne.',
        topic: 'Professionnel',
        language: 'french',
        aiPersona: 'Responsable RH de la scale-up "NovaLiaison" à Paris, adepte des questions comportementales.',
        learnerPersona: 'Candidat qui a de l’expérience à l’international et veut démontrer son aisance en français.',
        objectives: [
          'Poser des questions STAR et demander des exemples précis',
          'Évaluer la capacité à gérer des clients francophones exigeants',
          'Donner un retour constructif après chaque réponse',
        ],
        starterPrompt: 'Remercie le candidat d’être ponctuel, explique le déroulé de l’entretien et pose une première question sur son parcours.',
        conversationGuidelines: [
          'Utilise un vocabulaire professionnel ("pilotage", "esprit d’équipe") et ajoute un "Tip:" en anglais pour les nuances.',
          'Invite le candidat à structurer ses réponses avec des connecteurs logiques.',
          'Fais ressortir les points forts tout en suggérant une amélioration concrète.',
        ],
      },
      hindi: {
        title: 'नौकरी का साक्षात्कार',
        description: 'द्विभाषी भूमिका के लिए साक्षात्कार प्रश्नों का उत्तर दें और अपने अनुभव को साझा करें।',
        topic: 'व्यवसाय',
        language: 'hindi',
        aiPersona: 'बेंगलुरु की ग्राहक-सफलता कंपनी "अनुराग टेक" का एचआर लीड।',
        learnerPersona: 'उम्मीदवार जिसने अंग्रेज़ी ग्राहकों के साथ काम किया है और अब हिंदी में आत्मविश्वास दिखाना चाहता है।',
        objectives: [
          'स्थितियों पर आधारित प्रश्न पूछना और जवाब में विवरण माँगना',
          'संचार शैली और टीम में सहयोग की क्षमता परखना',
          'प्रत्येक उत्तर पर संक्षिप्त प्रतिक्रिया देना',
        ],
        starterPrompt: 'साक्षात्कार की प्रक्रिया समझाएँ, उम्मीदवार से अपना परिचय देने को कहें और हाल की उपलब्धि पर सवाल पूछें।',
        conversationGuidelines: [
          'औपचारिक हिंदी का प्रयोग करें और अंत में "Tip:" के साथ सुझाव दें।',
          'STAR ढाँचे का उल्लेख करें और उम्मीदवार को उसी पैटर्न में उत्तर देने के लिए प्रेरित करें।',
          'यदि उत्तर अस्पष्ट हो तो परिशुद्ध उदाहरण माँगें।',
        ],
      },
    },
  },
  {
    baseId: 'phone-call',
    legacyBase: 6,
    difficulty: 'hard',
    durationMinutes: 18,
    variants: {
      spanish: {
        title: 'Making a Phone Call',
        description: 'Master telephone etiquette for business calls and quick check-ins.',
        topic: 'Communication',
        language: 'spanish',
        aiPersona: 'Operations coordinator at the logistics firm "Rutas Ágiles" in Mexico City.',
        learnerPersona: 'Colleague calling to confirm shipment details and schedule changes.',
        objectives: [
          'Practice formal greetings and identity verification',
          'Confirm or adjust logistics details clearly',
          'Close the call with next steps and appreciation',
        ],
        starterPrompt: 'Answer the phone as the coordinator, verify who is calling, and ask how you can assist.',
        conversationGuidelines: [
          'Keep responses concise, mirroring the rhythm of real phone calls.',
          'Prompt the learner to repeat key numbers or dates for clarity.',
          'Add subtle ambient cues (hold music, call transfers) to make it immersive.',
        ],
      },
      french: {
        title: 'Appel Professionnel',
        description: 'Confirmez des livraisons, clarifiez les horaires et laissez une impression courtoise.',
        topic: 'Communication',
        language: 'french',
        aiPersona: 'Coordinatrice logistique chez "Courant Express" à Lyon, experte en suivi d’expédition.',
        learnerPersona: 'Gestionnaire de projet qui doit annoncer un changement d’itinéraire à un client francophone.',
        objectives: [
          'Vérifier l’identité et résumer l’objet de l’appel en une phrase claire',
          'Confirmer des dates, numéros de colis et nouvelles instructions',
          'Clore l’appel avec des remerciements et les prochaines étapes',
        ],
        starterPrompt: 'Réponds comme si tu recevais l’appel, demande avec qui tu parles et invite la personne à expliquer la situation.',
        conversationGuidelines: [
          'Utilise un ton professionnel, insère des marqueurs comme "je vous écoute" ou "merci de patienter".',
          'Garde la conversation en français et ajoute un "Tip:" bilingue pour corriger les faux amis.',
          'Demande systématiquement une reformulation des informations critiques.',
        ],
      },
      hindi: {
        title: 'व्यावसायिक फोन कॉल',
        description: 'कार्य-संबंधी कॉल में शिष्टाचार, विवरण की पुष्टि और आगे की योजना पर अभ्यास करें।',
        topic: 'संचार',
        language: 'hindi',
        aiPersona: 'मुंबई की लॉजिस्टिक्स कंपनी "दूरी मिटाएँ" की संचालन अधिकारी।',
        learnerPersona: 'सप्लाई-चेन समन्वयक जिसे नई डिलीवरी तिथि साझा करनी है।',
        objectives: [
          'फ़ोन शिष्टाचार के साथ परिचय देना और पहचान सत्यापित करना',
          'दिनांक, मात्रा या मार्ग में बदलाव स्पष्ट करना',
          'कॉल समाप्त करने से पहले अगले कदम और संपर्क का तरीका तय करना',
        ],
        starterPrompt: 'कॉल उठाकर अभिवादन करें, कॉलर का नाम पूछें और जानें कि उन्हें किस सहायता की आवश्यकता है।',
        conversationGuidelines: [
          'वाक्यों को संक्षिप्त रखें और महत्त्वपूर्ण विवरण दोहरवाएँ।',
          'कॉल के माहौल को दर्शाने वाले शब्द (होल्ड, ट्रांसफर) शामिल करें।',
          'अंत में "Tip:" के साथ उच्चारण या व्याकरण सुधार की सलाह दें।',
        ],
      },
    },
  },
];

export const practiceScenarios: PracticeScenario[] = scenarioBlueprints.flatMap(({ baseId, legacyBase, difficulty, durationMinutes, variants }) =>
  (Object.keys(variants) as LanguageCode[]).map((language) => {
    const variant = variants[language];
    const languageSuffix = language === 'spanish' ? '' : `-${language}`;
    return {
      id: `${baseId}${languageSuffix}`,
      legacyId: legacyBase + LANGUAGE_OFFSETS[language],
      title: variant.title,
      description: variant.description,
      topic: variant.topic,
      difficulty,
      durationMinutes,
      language: variant.language,
      aiPersona: variant.aiPersona,
      learnerPersona: variant.learnerPersona,
      objectives: variant.objectives,
      starterPrompt: variant.starterPrompt,
      conversationGuidelines: variant.conversationGuidelines,
    } satisfies PracticeScenario;
  })
);

export function getPracticeScenarioById(id: string): PracticeScenario | undefined {
  if (!id) return undefined;
  return practiceScenarios.find((scenario) =>
    scenario.id === id || scenario.legacyId.toString() === id
  );
}

export function getPracticeScenarioSummary() {
  return practiceScenarios.map((scenario) => ({
    id: scenario.id,
    legacyId: scenario.legacyId,
    title: scenario.title,
    description: scenario.description,
    topic: scenario.topic,
    difficulty: scenario.difficulty,
    durationMinutes: scenario.durationMinutes,
    language: scenario.language,
  }));
}
