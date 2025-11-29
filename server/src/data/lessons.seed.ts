import { Lesson } from '../models/index.js';

const spanishLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'basic-greetings-introductions',
    description: 'Learn how to greet people in Spanish and introduce yourself. This lesson covers common phrases like "Hola", "Buenos días", and "Mucho gusto".',
    topic: 'Speaking & Listening',
    language: 'spanish',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Spanish pronunciation',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Spanish Greetings',
        content: 'Spanish is a warm and expressive language. Greetings vary based on the time of day and formality level. In this lesson, you\'ll learn the most common ways to greet people and introduce yourself.',
        audioText: 'Spanish is a warm and expressive language. Greetings vary based on the time of day and formality level.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: 'Hola. Buenos días. Buenas tardes. Buenas noches.',
        vocabulary: [
          {
            word: 'Hola',
            translation: 'Hello / Hi',
            pronunciation: 'OH-lah',
            example: '¡Hola! ¿Cómo estás?',
            exampleTranslation: 'Hello! How are you?',
          },
          {
            word: 'Buenos días',
            translation: 'Good morning',
            pronunciation: 'BWEH-nohs DEE-ahs',
            example: 'Buenos días, señora García.',
            exampleTranslation: 'Good morning, Mrs. García.',
          },
          {
            word: 'Buenas tardes',
            translation: 'Good afternoon',
            pronunciation: 'BWEH-nahs TAHR-dehs',
            example: 'Buenas tardes, ¿cómo está usted?',
            exampleTranslation: 'Good afternoon, how are you?',
          },
          {
            word: 'Buenas noches',
            translation: 'Good evening / Good night',
            pronunciation: 'BWEH-nahs NOH-chehs',
            example: 'Buenas noches, hasta mañana.',
            exampleTranslation: 'Good night, see you tomorrow.',
          },
          {
            word: 'Mucho gusto',
            translation: 'Nice to meet you',
            pronunciation: 'MOO-choh GOOS-toh',
            example: 'Mucho gusto, me llamo Carlos.',
            exampleTranslation: 'Nice to meet you, my name is Carlos.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `María: ¡Hola! Buenos días.
Juan: Buenos días. ¿Cómo te llamas?
María: Me llamo María. ¿Y tú?
Juan: Me llamo Juan. Mucho gusto.
María: Igualmente. ¿De dónde eres?
Juan: Soy de México. ¿Y tú?
María: Soy de España. Encantada de conocerte.`,
        audioText: 'Hola! Buenos días. Buenos días. ¿Cómo te llamas? Me llamo María. ¿Y tú? Me llamo Juan. Mucho gusto. Igualmente. ¿De dónde eres? Soy de México. ¿Y tú? Soy de España. Encantada de conocerte.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Spanish?',
        options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hola'],
        correctAnswer: 'Buenos días',
        explanation: '"Buenos días" is used in the morning until around noon.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "Mucho gusto" mean?',
        options: ['Goodbye', 'Thank you', 'Nice to meet you', 'How are you?'],
        correctAnswer: 'Nice to meet you',
        explanation: '"Mucho gusto" literally means "much pleasure" and is used when meeting someone.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Me _____ María. (My name is María)',
        correctAnswer: 'llamo',
        explanation: '"Me llamo" means "I call myself" or "My name is".',
      },
      {
        type: 'translation',
        question: 'Translate to Spanish: "Hello, how are you?"',
        correctAnswer: 'Hola, ¿cómo estás?',
        explanation: 'This is the informal way to ask how someone is doing.',
      },
      {
        type: 'listening',
        question: 'Listen and select what you hear:',
        options: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Hola'],
        correctAnswer: 'Buenos días',
        audioText: 'Buenos días',
        explanation: 'Practice listening to Spanish greetings.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'numbers-1-100',
    description: 'Master Spanish numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Spanish.',
    topic: 'Vocabulary',
    language: 'spanish',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Spanish',
      'Recognize and use numbers in context',
      'Tell prices and phone numbers',
      'Understand number patterns in Spanish',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Spanish Numbers',
        content: 'Numbers are essential for everyday life - from telling time to shopping. Spanish numbers follow patterns that make them easier to learn once you understand the basics.',
        audioText: 'Numbers are essential for everyday life. Spanish numbers follow patterns that make them easier to learn.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'These are the foundation for all Spanish numbers:',
        audioText: 'uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez',
        vocabulary: [
          { word: 'uno', translation: 'one', pronunciation: 'OO-noh', example: 'Tengo un libro.', exampleTranslation: 'I have one book.' },
          { word: 'dos', translation: 'two', pronunciation: 'dohs', example: 'Hay dos gatos.', exampleTranslation: 'There are two cats.' },
          { word: 'tres', translation: 'three', pronunciation: 'trehs', example: 'Tres cafés, por favor.', exampleTranslation: 'Three coffees, please.' },
          { word: 'cuatro', translation: 'four', pronunciation: 'KWAH-troh', example: 'Son las cuatro.', exampleTranslation: 'It\'s four o\'clock.' },
          { word: 'cinco', translation: 'five', pronunciation: 'SEEN-koh', example: 'Cinco euros.', exampleTranslation: 'Five euros.' },
          { word: 'seis', translation: 'six', pronunciation: 'says', example: 'Tengo seis años.', exampleTranslation: 'I\'m six years old.' },
          { word: 'siete', translation: 'seven', pronunciation: 'SYEH-teh', example: 'Siete días.', exampleTranslation: 'Seven days.' },
          { word: 'ocho', translation: 'eight', pronunciation: 'OH-choh', example: 'A las ocho.', exampleTranslation: 'At eight o\'clock.' },
          { word: 'nueve', translation: 'nine', pronunciation: 'NWEH-veh', example: 'Nueve personas.', exampleTranslation: 'Nine people.' },
          { word: 'diez', translation: 'ten', pronunciation: 'dyehs', example: 'Diez minutos.', exampleTranslation: 'Ten minutes.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Number Patterns (11-100)',
        content: `11-15: once, doce, trece, catorce, quince
16-19: diez + y + number (dieciséis, diecisiete, dieciocho, diecinueve)
20: veinte
21-29: veinti + number (veintiuno, veintidós, veintitrés...)
30, 40, 50...: treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa
31-99: tens + y + ones (treinta y uno, cuarenta y dos...)
100: cien`,
        audioText: 'once, doce, trece, catorce, quince. veinte. treinta. cuarenta. cincuenta. sesenta. setenta. ochenta. noventa. cien.',
        grammarPoints: [
          'Numbers 16-19 and 21-29 are written as one word',
          'From 31 onwards, use "y" (and) between tens and ones',
          '"Uno" becomes "un" before masculine nouns',
          '"Cien" is used for exactly 100',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Spanish?',
        options: ['catorce', 'quince', 'dieciséis', 'trece'],
        correctAnswer: 'quince',
        explanation: '"Quince" is 15 in Spanish. Numbers 11-15 have unique names.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you say "42" in Spanish?',
        options: ['cuarenta dos', 'cuarenta y dos', 'cuarentados', 'cuatro y dos'],
        correctAnswer: 'cuarenta y dos',
        explanation: 'From 31-99, use "y" between the tens and ones.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: veinti_____ (25)',
        correctAnswer: 'cinco',
        explanation: '21-29 combine "veinti" with the ones digit: veinticinco = 25.',
      },
      {
        type: 'translation',
        question: 'Translate: "I have seventy-three books"',
        correctAnswer: 'Tengo setenta y tres libros',
        explanation: 'Setenta (70) + y + tres (3) = setenta y tres (73).',
      },
    ],
    isActive: true,
  },
  {
    title: 'Present Tense Regular Verbs',
    slug: 'present-tense-regular-verbs',
    description: 'Master the present tense in Spanish. Understand verb conjugations for regular -AR, -ER, and -IR verbs with real-world examples.',
    topic: 'Grammar',
    language: 'spanish',
    level: 'beginner',
    duration: 18,
    order: 3,
    objectives: [
      'Conjugate regular -AR verbs in present tense',
      'Conjugate regular -ER verbs in present tense',
      'Conjugate regular -IR verbs in present tense',
      'Use present tense verbs in sentences',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Spanish Verbs',
        content: 'Spanish verbs change their endings based on who is doing the action. This is called conjugation. Regular verbs follow predictable patterns, making them easier to learn.',
        audioText: 'Spanish verbs change their endings based on who is doing the action. This is called conjugation.',
      },
      {
        type: 'grammar',
        title: '-AR Verb Conjugation',
        content: `Let's use HABLAR (to speak) as our example:
yo hablo - I speak
tú hablas - you speak (informal)
él/ella/usted habla - he/she/you (formal) speaks
nosotros hablamos - we speak
vosotros habláis - you all speak (Spain)
ellos/ellas/ustedes hablan - they/you all speak`,
        audioText: 'yo hablo, tú hablas, él habla, nosotros hablamos, vosotros habláis, ellos hablan',
        grammarPoints: [
          'Remove -AR and add: -o, -as, -a, -amos, -áis, -an',
          'Common -AR verbs: trabajar, estudiar, caminar, comprar, cocinar',
        ],
      },
      {
        type: 'grammar',
        title: '-ER Verb Conjugation',
        content: `Let's use COMER (to eat) as our example:
yo como - I eat
tú comes - you eat (informal)
él/ella/usted come - he/she/you (formal) eats
nosotros comemos - we eat
vosotros coméis - you all eat (Spain)
ellos/ellas/ustedes comen - they/you all eat`,
        audioText: 'yo como, tú comes, él come, nosotros comemos, vosotros coméis, ellos comen',
        grammarPoints: [
          'Remove -ER and add: -o, -es, -e, -emos, -éis, -en',
          'Common -ER verbs: beber, leer, correr, aprender, vender',
        ],
      },
      {
        type: 'grammar',
        title: '-IR Verb Conjugation',
        content: `Let's use VIVIR (to live) as our example:
yo vivo - I live
tú vives - you live (informal)
él/ella/usted vive - he/she/you (formal) lives
nosotros vivimos - we live
vosotros vivís - you all live (Spain)
ellos/ellas/ustedes viven - they/you all live`,
        audioText: 'yo vivo, tú vives, él vive, nosotros vivimos, vosotros vivís, ellos viven',
        grammarPoints: [
          'Remove -IR and add: -o, -es, -e, -imos, -ís, -en',
          'Common -IR verbs: escribir, abrir, recibir, decidir, describir',
        ],
      },
      {
        type: 'vocabulary',
        title: 'Common Regular Verbs',
        content: 'Practice with these frequently used verbs:',
        audioText: 'trabajar, estudiar, comer, beber, vivir, escribir',
        vocabulary: [
          { word: 'trabajar', translation: 'to work', pronunciation: 'trah-bah-HAR', example: 'Yo trabajo en una oficina.', exampleTranslation: 'I work in an office.' },
          { word: 'estudiar', translation: 'to study', pronunciation: 'ehs-too-DYAR', example: 'Ella estudia español.', exampleTranslation: 'She studies Spanish.' },
          { word: 'comer', translation: 'to eat', pronunciation: 'koh-MEHR', example: 'Nosotros comemos a las dos.', exampleTranslation: 'We eat at two o\'clock.' },
          { word: 'beber', translation: 'to drink', pronunciation: 'beh-BEHR', example: 'Ellos beben agua.', exampleTranslation: 'They drink water.' },
          { word: 'vivir', translation: 'to live', pronunciation: 'bee-BEER', example: 'Yo vivo en Madrid.', exampleTranslation: 'I live in Madrid.' },
          { word: 'escribir', translation: 'to write', pronunciation: 'ehs-kree-BEER', example: 'Tú escribes una carta.', exampleTranslation: 'You write a letter.' },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is the correct form of "hablar" for "yo"?',
        options: ['hablo', 'hablas', 'habla', 'hablamos'],
        correctAnswer: 'hablo',
        explanation: 'For "yo" (I), -AR verbs end in -o: habl + o = hablo.',
      },
      {
        type: 'multiple-choice',
        question: 'Complete: Nosotros _____ en un restaurante. (comer)',
        options: ['como', 'comes', 'come', 'comemos'],
        correctAnswer: 'comemos',
        explanation: 'For "nosotros" (we), -ER verbs end in -emos: com + emos = comemos.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Ella _____ en Barcelona. (vivir)',
        correctAnswer: 'vive',
        explanation: 'For "ella" (she), -IR verbs end in -e: viv + e = vive.',
      },
      {
        type: 'translation',
        question: 'Translate: "They study Spanish"',
        correctAnswer: 'Ellos estudian español',
        explanation: 'Estudiar conjugated for "ellos" is "estudian".',
      },
      {
        type: 'multiple-choice',
        question: 'Which ending is used for "tú" with -IR verbs?',
        options: ['-o', '-es', '-e', '-imos'],
        correctAnswer: '-es',
        explanation: 'For "tú", -IR verbs use -es: viv + es = vives.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSONS
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'ordering-food-restaurant',
    description: 'Learn vocabulary and phrases for ordering food. Practice reading menus and communicating dietary preferences in Spanish.',
    topic: 'Practical Scenarios',
    language: 'spanish',
    level: 'intermediate',
    duration: 20,
    order: 1,
    objectives: [
      'Order food and drinks at a restaurant',
      'Ask about menu items and ingredients',
      'Express dietary restrictions and preferences',
      'Request the bill and handle payment',
    ],
    contents: [
      {
        type: 'text',
        title: 'Dining Out in Spanish-Speaking Countries',
        content: 'Dining is a social experience in Spanish-speaking cultures. Meals often last longer than in other countries, and the atmosphere is relaxed. Knowing the right phrases will help you navigate menus and communicate with servers confidently.',
        audioText: 'Dining is a social experience in Spanish-speaking cultures. Meals often last longer, and the atmosphere is relaxed.',
      },
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining out:',
        audioText: 'el menú, la carta, el camarero, la cuenta, la propina, el plato',
        vocabulary: [
          { word: 'el menú / la carta', translation: 'the menu', pronunciation: 'ehl meh-NOO / lah KAR-tah', example: '¿Puede traer el menú, por favor?', exampleTranslation: 'Can you bring the menu, please?' },
          { word: 'el camarero / la camarera', translation: 'the waiter / waitress', pronunciation: 'ehl kah-mah-REH-roh', example: 'El camarero es muy amable.', exampleTranslation: 'The waiter is very friendly.' },
          { word: 'la cuenta', translation: 'the bill', pronunciation: 'lah KWEHN-tah', example: 'La cuenta, por favor.', exampleTranslation: 'The bill, please.' },
          { word: 'el plato del día', translation: 'dish of the day', pronunciation: 'ehl PLAH-toh dehl DEE-ah', example: '¿Cuál es el plato del día?', exampleTranslation: 'What\'s the dish of the day?' },
          { word: 'la propina', translation: 'the tip', pronunciation: 'lah proh-PEE-nah', example: 'Dejé una propina del 15%.', exampleTranslation: 'I left a 15% tip.' },
          { word: 'para llevar', translation: 'to go / takeaway', pronunciation: 'PAH-rah yeh-VAR', example: 'Quiero un café para llevar.', exampleTranslation: 'I want a coffee to go.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `Camarero: Buenas tardes. ¿Mesa para cuántas personas?
Cliente: Para dos, por favor.
Camarero: Síganme, por favor. Aquí tienen el menú.
Cliente: Gracias. ¿Qué nos recomienda?
Camarero: El plato del día es paella. Está muy buena.
Cliente: Perfecto. Yo quiero la paella. ¿Y tú?
Amigo: Yo voy a pedir el filete con ensalada.
Camarero: ¿Y para beber?
Cliente: Una botella de agua y dos copas de vino tinto, por favor.
Camarero: Muy bien. ¿Algo más?
Cliente: No, eso es todo. Gracias.`,
        audioText: 'Buenas tardes. Mesa para cuántas personas? Para dos, por favor. Síganme, por favor. Aquí tienen el menú. Gracias. Qué nos recomienda? El plato del día es paella. Está muy buena.',
      },
      {
        type: 'vocabulary',
        title: 'Dietary Restrictions',
        content: 'How to communicate dietary needs:',
        audioText: 'Soy vegetariano. Soy alérgico. Sin gluten. Sin lactosa.',
        vocabulary: [
          { word: 'Soy vegetariano/a', translation: 'I\'m vegetarian', pronunciation: 'soy veh-heh-tah-RYAH-noh', example: 'Soy vegetariano. ¿Tienen opciones sin carne?', exampleTranslation: 'I\'m vegetarian. Do you have meatless options?' },
          { word: 'Soy alérgico/a a...', translation: 'I\'m allergic to...', pronunciation: 'soy ah-LEHR-hee-koh ah', example: 'Soy alérgico a los mariscos.', exampleTranslation: 'I\'m allergic to seafood.' },
          { word: 'sin gluten', translation: 'gluten-free', pronunciation: 'seen GLOO-tehn', example: '¿Tienen pan sin gluten?', exampleTranslation: 'Do you have gluten-free bread?' },
          { word: 'sin lactosa', translation: 'lactose-free', pronunciation: 'seen lahk-TOH-sah', example: 'Necesito leche sin lactosa.', exampleTranslation: 'I need lactose-free milk.' },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Spanish?',
        options: ['El menú, por favor', 'La cuenta, por favor', 'La propina, por favor', 'El plato, por favor'],
        correctAnswer: 'La cuenta, por favor',
        explanation: '"La cuenta" means "the bill". Adding "por favor" makes it polite.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "para llevar" mean?',
        options: ['For here', 'To go / Takeaway', 'To share', 'For later'],
        correctAnswer: 'To go / Takeaway',
        explanation: '"Para llevar" literally means "to carry" and is used for takeaway orders.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Soy _____ a los cacahuetes. (allergic)',
        correctAnswer: 'alérgico',
        explanation: '"Alérgico" means allergic. Use "alérgica" if you\'re female.',
      },
      {
        type: 'translation',
        question: 'Translate: "What do you recommend?"',
        correctAnswer: '¿Qué recomienda?',
        explanation: 'This is the formal way to ask for recommendations.',
      },
      {
        type: 'listening',
        question: 'Listen and select what you hear:',
        options: ['La cuenta, por favor', 'El menú, por favor', 'Una mesa, por favor', 'La propina, por favor'],
        correctAnswer: 'La cuenta, por favor',
        audioText: 'La cuenta, por favor',
        explanation: 'This phrase is used to request the bill.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Past Tense: Preterite',
    slug: 'past-tense-preterite',
    description: 'Learn the preterite tense for completed actions in the past. Master regular and common irregular verb forms.',
    topic: 'Grammar',
    language: 'spanish',
    level: 'intermediate',
    duration: 22,
    order: 2,
    objectives: [
      'Understand when to use the preterite tense',
      'Conjugate regular verbs in preterite',
      'Learn common irregular preterite verbs',
      'Use preterite in real conversations',
    ],
    contents: [
      {
        type: 'text',
        title: 'Understanding the Preterite',
        content: 'The preterite (pretérito indefinido) is used for actions that were completed at a specific point in the past. Think of it as a "snapshot" - the action started and ended. It\'s different from the imperfect, which describes ongoing or habitual past actions.',
        audioText: 'The preterite is used for actions that were completed at a specific point in the past.',
      },
      {
        type: 'grammar',
        title: 'Regular -AR Verbs in Preterite',
        content: `HABLAR (to speak) in preterite:
yo hablé - I spoke
tú hablaste - you spoke
él/ella/usted habló - he/she spoke
nosotros hablamos - we spoke
vosotros hablasteis - you all spoke
ellos/ustedes hablaron - they spoke`,
        audioText: 'yo hablé, tú hablaste, él habló, nosotros hablamos, vosotros hablasteis, ellos hablaron',
        grammarPoints: [
          'Endings: -é, -aste, -ó, -amos, -asteis, -aron',
          'Note: nosotros form is the same as present tense',
          'Accent marks are important for meaning',
        ],
      },
      {
        type: 'grammar',
        title: 'Regular -ER/-IR Verbs in Preterite',
        content: `COMER (to eat) and VIVIR (to live) share the same endings:
yo comí/viví - I ate/lived
tú comiste/viviste - you ate/lived
él/ella comió/vivió - he/she ate/lived
nosotros comimos/vivimos - we ate/lived
vosotros comisteis/vivisteis - you all ate/lived
ellos comieron/vivieron - they ate/lived`,
        audioText: 'yo comí, tú comiste, él comió, nosotros comimos, vosotros comisteis, ellos comieron',
        grammarPoints: [
          'Endings: -í, -iste, -ió, -imos, -isteis, -ieron',
          '-ER and -IR verbs use identical endings in preterite',
        ],
      },
      {
        type: 'vocabulary',
        title: 'Common Irregular Preterite Verbs',
        content: 'These verbs have irregular stems and special endings:',
        audioText: 'ir, ser, tener, hacer, estar, poder',
        vocabulary: [
          { word: 'ir/ser → fui, fuiste, fue, fuimos, fuisteis, fueron', translation: 'went/was', pronunciation: 'fwee', example: 'Ayer fui al cine.', exampleTranslation: 'Yesterday I went to the cinema.' },
          { word: 'tener → tuve, tuviste, tuvo...', translation: 'had', pronunciation: 'TOO-veh', example: 'Tuve un buen día.', exampleTranslation: 'I had a good day.' },
          { word: 'hacer → hice, hiciste, hizo...', translation: 'did/made', pronunciation: 'EE-seh', example: '¿Qué hiciste ayer?', exampleTranslation: 'What did you do yesterday?' },
          { word: 'estar → estuve, estuviste, estuvo...', translation: 'was (location/state)', pronunciation: 'ehs-TOO-veh', example: 'Estuve en casa.', exampleTranslation: 'I was at home.' },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is the preterite form of "hablar" for "yo"?',
        options: ['hablo', 'hablé', 'hablaba', 'hablaré'],
        correctAnswer: 'hablé',
        explanation: 'The preterite ending for "yo" with -AR verbs is -é.',
      },
      {
        type: 'multiple-choice',
        question: 'Complete: Ayer ellos _____ a la fiesta. (ir)',
        options: ['van', 'iban', 'fueron', 'irán'],
        correctAnswer: 'fueron',
        explanation: '"Ir" is irregular in preterite. "Fueron" is the ellos form.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Yo _____ la tarea anoche. (hacer)',
        correctAnswer: 'hice',
        explanation: '"Hacer" becomes "hice" for "yo" in the preterite.',
      },
      {
        type: 'translation',
        question: 'Translate: "She ate breakfast at 8"',
        correctAnswer: 'Ella desayunó a las ocho',
        explanation: '"Desayunar" (to have breakfast) becomes "desayunó" for ella.',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSONS
  {
    title: 'Subjunctive Mood: Basics',
    slug: 'subjunctive-mood-basics',
    description: 'Unlock the Spanish subjunctive mood. Learn when and how to use it for wishes, doubts, and emotions.',
    topic: 'Grammar',
    language: 'spanish',
    level: 'advanced',
    duration: 25,
    order: 1,
    objectives: [
      'Understand when to use the subjunctive mood',
      'Form the present subjunctive for regular verbs',
      'Recognize subjunctive triggers (WEIRDO)',
      'Use subjunctive in common expressions',
    ],
    contents: [
      {
        type: 'text',
        title: 'What is the Subjunctive?',
        content: 'The subjunctive mood is used to express wishes, doubts, emotions, and hypothetical situations. Unlike the indicative (which states facts), the subjunctive expresses subjectivity. Many learners struggle with it, but understanding the triggers makes it manageable.',
        audioText: 'The subjunctive mood is used to express wishes, doubts, emotions, and hypothetical situations.',
      },
      {
        type: 'grammar',
        title: 'Forming the Present Subjunctive',
        content: `Start with the "yo" form of present indicative, drop the -o, and add opposite endings:

-AR verbs (hablar → hable):
que yo hable, que tú hables, que él hable
que nosotros hablemos, que vosotros habléis, que ellos hablen

-ER/-IR verbs (comer → coma, vivir → viva):
que yo coma/viva, que tú comas/vivas, que él coma/viva
que nosotros comamos/vivamos, que ellos coman/vivan`,
        audioText: 'que yo hable, que tú hables, que él hable, que nosotros hablemos, que ellos hablen',
        grammarPoints: [
          '-AR verbs use -ER/-IR indicative endings: -e, -es, -e, -emos, -éis, -en',
          '-ER/-IR verbs use -AR indicative endings: -a, -as, -a, -amos, -áis, -an',
          'Irregular "yo" forms carry over: tengo → tenga, vengo → venga',
        ],
      },
      {
        type: 'text',
        title: 'WEIRDO: Subjunctive Triggers',
        content: `Use the acronym WEIRDO to remember when to use subjunctive:

W - Wishes (querer que, esperar que, ojalá que)
E - Emotions (alegrarse de que, tener miedo de que)
I - Impersonal expressions (es importante que, es necesario que)
R - Recommendations (recomendar que, sugerir que)
D - Doubt/Denial (dudar que, no creer que)
O - Ojalá (hopefully) and other expressions`,
        audioText: 'WEIRDO: Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá.',
      },
      {
        type: 'vocabulary',
        title: 'Common Subjunctive Phrases',
        content: 'Expressions that trigger the subjunctive:',
        audioText: 'Espero que, Quiero que, Es importante que, Dudo que',
        vocabulary: [
          { word: 'Espero que...', translation: 'I hope that...', pronunciation: 'ehs-PEH-roh keh', example: 'Espero que vengas a la fiesta.', exampleTranslation: 'I hope you come to the party.' },
          { word: 'Quiero que...', translation: 'I want (you) to...', pronunciation: 'KYEH-roh keh', example: 'Quiero que estudies más.', exampleTranslation: 'I want you to study more.' },
          { word: 'Es importante que...', translation: 'It\'s important that...', pronunciation: 'ehs eem-por-TAHN-teh keh', example: 'Es importante que llegues temprano.', exampleTranslation: 'It\'s important that you arrive early.' },
          { word: 'Dudo que...', translation: 'I doubt that...', pronunciation: 'DOO-doh keh', example: 'Dudo que él sepa la respuesta.', exampleTranslation: 'I doubt he knows the answer.' },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is the present subjunctive of "hablar" for "él"?',
        options: ['habla', 'hable', 'hablé', 'hablara'],
        correctAnswer: 'hable',
        explanation: 'For -AR verbs in subjunctive, use -e for él/ella/usted.',
      },
      {
        type: 'multiple-choice',
        question: 'Complete: Es necesario que tú _____ la verdad. (decir)',
        options: ['dices', 'digas', 'diga', 'decir'],
        correctAnswer: 'digas',
        explanation: '"Es necesario que" triggers subjunctive. "Decir" → "diga" (yo) → "digas" (tú).',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Espero que ella _____ pronto. (venir)',
        correctAnswer: 'venga',
        explanation: '"Esperar que" triggers subjunctive. "Venir" → "venga".',
      },
      {
        type: 'translation',
        question: 'Translate: "I hope it doesn\'t rain"',
        correctAnswer: 'Espero que no llueva',
        explanation: '"Esperar que" + subjunctive. "Llover" → "llueva".',
      },
    ],
    isActive: true,
  },
  {
    title: 'Business Spanish Essentials',
    slug: 'business-spanish-essentials',
    description: 'Learn professional vocabulary and etiquette for business meetings, emails, and negotiations in Spanish.',
    topic: 'Professional',
    language: 'spanish',
    level: 'advanced',
    duration: 30,
    order: 2,
    objectives: [
      'Use formal business greetings and closings',
      'Write professional emails in Spanish',
      'Conduct meetings and presentations',
      'Negotiate and discuss contracts',
    ],
    contents: [
      {
        type: 'text',
        title: 'Business Culture in Spanish-Speaking Countries',
        content: 'Business etiquette varies across Spanish-speaking countries, but formal language is universally important. Using "usted" instead of "tú", proper titles, and formal expressions shows respect and professionalism.',
        audioText: 'Business etiquette varies across Spanish-speaking countries, but formal language is universally important.',
      },
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential terms for the workplace:',
        audioText: 'la empresa, el/la gerente, la reunión, el contrato, el presupuesto, los beneficios',
        vocabulary: [
          { word: 'la empresa', translation: 'the company', pronunciation: 'lah ehm-PREH-sah', example: 'Nuestra empresa tiene 500 empleados.', exampleTranslation: 'Our company has 500 employees.' },
          { word: 'el/la gerente', translation: 'the manager', pronunciation: 'ehl heh-REHN-teh', example: 'El gerente aprobó el proyecto.', exampleTranslation: 'The manager approved the project.' },
          { word: 'la reunión', translation: 'the meeting', pronunciation: 'lah reh-oo-NYOHN', example: 'Tenemos una reunión a las tres.', exampleTranslation: 'We have a meeting at three.' },
          { word: 'el contrato', translation: 'the contract', pronunciation: 'ehl kohn-TRAH-toh', example: 'Firmamos el contrato ayer.', exampleTranslation: 'We signed the contract yesterday.' },
          { word: 'el presupuesto', translation: 'the budget', pronunciation: 'ehl preh-soo-PWEHS-toh', example: 'El presupuesto es limitado.', exampleTranslation: 'The budget is limited.' },
        ],
      },
      {
        type: 'text',
        title: 'Professional Email Format',
        content: `Opening:
- Estimado/a Sr./Sra. [Apellido]: (Dear Mr./Mrs. [Last name]:)
- A quien corresponda: (To whom it may concern:)

Body:
- Me dirijo a usted para... (I am writing to you to...)
- Le escribo en relación a... (I am writing regarding...)
- Adjunto encontrará... (Attached you will find...)

Closing:
- Atentamente, (Sincerely,)
- Cordialmente, (Cordially,)
- Quedo a su disposición. (I remain at your disposal.)`,
        audioText: 'Estimado señor. Me dirijo a usted para. Le escribo en relación a. Atentamente. Cordialmente.',
      },
      {
        type: 'dialogue',
        title: 'Business Meeting',
        content: `Director: Buenos días a todos. Gracias por asistir a esta reunión.
Empleado: Buenos días. ¿Cuál es el orden del día?
Director: Primero, revisaremos los resultados del trimestre. Luego, discutiremos el nuevo proyecto.
Empleado: Perfecto. Tengo algunas preguntas sobre el presupuesto.
Director: Por supuesto. Adelante con sus preguntas.
Empleado: ¿Cuál es el presupuesto asignado para marketing?
Director: Tenemos 50,000 euros para este trimestre.`,
        audioText: 'Buenos días a todos. Gracias por asistir a esta reunión. Cuál es el orden del día? Primero, revisaremos los resultados del trimestre.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you formally address a man in a business email?',
        options: ['Hola amigo', 'Querido señor', 'Estimado Sr.', 'Hey'],
        correctAnswer: 'Estimado Sr.',
        explanation: '"Estimado Sr." (followed by last name) is the formal business greeting.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "Quedo a su disposición" mean?',
        options: ['I quit', 'I remain at your disposal', 'I\'m waiting', 'I understand'],
        correctAnswer: 'I remain at your disposal',
        explanation: 'This formal closing indicates you\'re available to help further.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Le _____ en relación al contrato. (I am writing to you)',
        correctAnswer: 'escribo',
        explanation: '"Le escribo en relación a..." is a formal way to state your email\'s purpose.',
      },
      {
        type: 'translation',
        question: 'Translate: "We have a meeting at 3 PM"',
        correctAnswer: 'Tenemos una reunión a las tres de la tarde',
        explanation: '"Reunión" is the word for meeting, and time is expressed with "a las...".',
      },
    ],
    isActive: true,
  },
];

export const seedLessons = async (): Promise<void> => {
  try {
    // Check if lessons already exist
    const existingCount = await Lesson.countDocuments();
    
    if (existingCount > 0) {
      console.log(`📚 Lessons already seeded (${existingCount} lessons found)`);
      return;
    }

    // Insert all lessons
    await Lesson.insertMany(spanishLessons);
    console.log(`✅ Successfully seeded ${spanishLessons.length} Spanish lessons`);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    throw error;
  }
};

export default seedLessons;
