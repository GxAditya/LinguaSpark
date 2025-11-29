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
  {
    title: 'Travel & Directions Mastery',
    slug: 'spanish-travel-directions',
    description: 'Handle tickets, platforms, ride shares, and directions while traveling through Spanish-speaking cities.',
    topic: 'Practical Scenarios',
    language: 'spanish',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Buy tickets and confirm schedules at stations or airports',
      'Ask for and provide directions with landmarks and prepositions',
      'Understand transportation announcements and signage',
      'Use ride-hailing and lodging vocabulary with confidence',
    ],
    contents: [
      {
        type: 'text',
        title: 'Navigating Transportation Hubs',
        content: 'Always greet an attendant with “Disculpe” or “Buenos días” before asking for help. Clarify the city, departure time, and platform. When announcements say “vía” it refers to the track number.',
        audioText: 'Disculpe, ¿a qué hora sale el tren a Sevilla? ¿En qué vía está el AVE a Barcelona?',
      },
      {
        type: 'vocabulary',
        title: 'Tickets & Directions',
        content: 'Memorize these chunks so you can focus on listening instead of translating word by word.',
        audioText: 'la ventanilla, la taquilla, la vía, girar a la derecha, seguir recto',
        vocabulary: [
          { word: 'la taquilla / ventanilla', translation: 'ticket booth/counter', pronunciation: 'tah-KEE-yah / behn-tah-NEE-yah', example: 'Las entradas están en la taquilla cinco.', exampleTranslation: 'Tickets are at window five.' },
          { word: 'la vía', translation: 'railway track/platform', pronunciation: 'BEE-ah', example: 'El tren a Valencia sale de la vía 8.', exampleTranslation: 'The train to Valencia departs from track 8.' },
          { word: 'seguir recto', translation: 'to go straight', pronunciation: 'seh-GEER REHK-toh', example: 'Sigue recto y gira a la izquierda.', exampleTranslation: 'Go straight and turn left.' },
          { word: 'girar a la derecha/izquierda', translation: 'turn right/left', pronunciation: 'hee-RAR', example: 'Gira a la derecha después del semáforo.', exampleTranslation: 'Turn right after the traffic light.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Asking for Directions',
        content: `Turista: Disculpe, ¿cómo llego al Museo de Arte?
Vecino: Siga recto dos cuadras y gire a la izquierda.
Turista: ¿Está muy lejos?
Vecino: No, son cinco minutos a pie. El museo queda frente a la plaza.`,
        audioText: 'Disculpe, ¿cómo llego al museo de arte? Siga recto dos cuadras y gire a la izquierda. ¿Está muy lejos? No, son cinco minutos a pie.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What does “la vía” refer to in a station?',
        options: ['Ticket price', 'Platform/track', 'Waiting room', 'Exit gate'],
        correctAnswer: 'Platform/track',
        explanation: 'Announcements such as “vía 6” indicate the track or platform number.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Gire a la _____ después del banco. (right)',
        correctAnswer: 'derecha',
        explanation: '“Derecha” is “right,” while “izquierda” is “left”.',
      },
      {
        type: 'translation',
        question: 'Translate: "Excuse me, where do I validate the ticket?"',
        correctAnswer: 'Disculpe, ¿dónde valido el billete?',
        explanation: 'Use “Disculpe” formally and “billete” for ticket in Spain.',
      },
      {
        type: 'listening',
        question: 'Listen and pick the correct instruction.',
        options: ['Sigue recto y gira a la derecha', 'Sigue recto y cruza el puente', 'Gira a la izquierda y sube', 'Baja las escaleras y gira'],
        correctAnswer: 'Sigue recto y gira a la derecha',
        audioText: 'Sigue recto y gira a la derecha',
        explanation: 'Identify “gira a la derecha” to choose the right option.',
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
    title: 'Debates & Persuasive Spanish',
    slug: 'spanish-advanced-debates',
    description: 'Structure arguments, express concessions, and persuade audiences using advanced connectors and nuanced vocabulary.',
    topic: 'Professional',
    language: 'spanish',
    level: 'advanced',
    duration: 28,
    order: 3,
    objectives: [
      'Use contrast connectors like “sin embargo” and “aun así” accurately',
      'Present arguments with evidence and counterarguments',
      'Express probability and nuance using conditional structures',
      'Adopt a confident tone in meetings or academic debates',
    ],
    contents: [
      {
        type: 'text',
        title: 'Framing Your Argument',
        content: 'Start by contextualizing: “Desde mi perspectiva…”. Use “consideremos” to invite reflection and “no obstante” to pivot. Finish with a call to action such as “propongo que”.',
        audioText: 'Desde mi perspectiva, deberíamos priorizar la sostenibilidad. No obstante, entiendo las limitaciones presupuestarias.',
      },
      {
        type: 'grammar',
        title: 'Connector Toolkit',
        content: `Contraste: sin embargo, no obstante, aun así
Secuencia lógica: en primer lugar, por otro lado, finalmente
Condicionales: si + imperfecto subjuntivo → condicional (Si tuviéramos más datos, podríamos decidir)
Concesión: aunque + subjuntivo (Aunque difieran, debemos seguir colaborando)`,
        audioText: 'Sin embargo, no obstante, aun así, en primer lugar, por otro lado, si tuviéramos más datos podríamos decidir.',
        grammarPoints: [
          'Combine connectors sparingly to avoid redundancy',
          'Pair “aunque” with subjunctive when the statement is hypothetical or doubted',
          'Conditional sentences soften criticism and keep tone diplomatic',
        ],
      },
      {
        type: 'dialogue',
        title: 'Roundtable Discussion',
        content: `Moderador: En primer lugar, escucharemos la postura del equipo verde.
Participante A: Desde mi perspectiva, deberíamos priorizar el transporte público.
Participante B: No obstante, si invertimos solo en buses, podríamos descuidar las bicicletas compartidas.
Moderador: Aunque la propuesta sea ambiciosa, necesitamos un plan realista.
Participante C: Propongo que combinemos ambas estrategias.`,
        audioText: 'En primer lugar, escucharemos la postura del equipo verde. Desde mi perspectiva, deberíamos priorizar el transporte público. No obstante, si invertimos solo en buses, podríamos descuidar las bicicletas compartidas.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which connector best introduces a counterargument?',
        options: ['Por ejemplo', 'Sin embargo', 'Finalmente', 'Por lo tanto'],
        correctAnswer: 'Sin embargo',
        explanation: '“Sin embargo” signals contrast, ideal for counterpoints.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Si tuviéramos más tiempo, _____ (poder) analizar los datos.',
        correctAnswer: 'podríamos',
        explanation: 'Use conditional “podríamos” after “si + imperfecto subjuntivo”.',
      },
      {
        type: 'translation',
        question: 'Translate: "Even though some disagree, we must make a decision."',
        correctAnswer: 'Aunque algunos no estén de acuerdo, debemos tomar una decisión',
        explanation: '“Aunque + subjuntivo” expresses contrast with doubt or concession.',
      },
      {
        type: 'multiple-choice',
        question: 'Choose the best closing statement for a recommendation.',
        options: [
          'En resumen, propongo que adoptemos este plan.',
          'Sin embargo, el plan tiene riesgos.',
          'Si no invirtiéramos, ahorraríamos dinero.',
          'Aunque funciona, prefiero otra idea.',
        ],
        correctAnswer: 'En resumen, propongo que adoptemos este plan.',
        explanation: 'Recommendations often conclude with “propongo que” plus subjunctive.',
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

const hindiLessons = [
  {
    title: 'Hindi Greetings & Introductions',
    slug: 'hindi-greetings-introductions',
    description: 'Learn essential Hindi greetings, polite expressions, and how to introduce yourself with confidence.',
    topic: 'Speaking & Listening',
    language: 'hindi',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people formally and informally',
      'Introduce yourself and ask for names',
      'Pronounce common Devanagari words using transliteration',
      'Use polite Hindi expressions in daily interactions',
    ],
    contents: [
      {
        type: 'text',
        title: 'Namaste 101',
        content: 'Hindi greetings are rooted in respect. “नमस्ते (Namaste)” literally means “I bow to you” and works in almost every setting. Use “नमस्कार (Namaskar)” for extra formality and “हाय (Hi)” with friends.',
        audioText: 'Namaste! Mera naam Aanya hai. Aap se milkar khushi hui.',
      },
      {
        type: 'vocabulary',
        title: 'Everyday Greetings',
        content: 'Practice these common phrases. The transliteration helps you speak before mastering the script.',
        audioText: 'Namaste, Namaskar, Shukriya, Dhanyavaad, Aap kaise hain?',
        vocabulary: [
          { word: 'नमस्ते (Namaste)', translation: 'Hello', pronunciation: 'nah-MUS-tay', example: 'नमस्ते! आप कैसे हैं?', exampleTranslation: 'Hello! How are you?' },
          { word: 'शुक्रिया (Shukriya)', translation: 'Thank you', pronunciation: 'shoo-kree-yah', example: 'शुक्रिया आपकी मदद के लिए.', exampleTranslation: 'Thank you for your help.' },
          { word: 'आप कैसे हैं? (Aap kaise hain?)', translation: 'How are you? (formal)', pronunciation: 'aap KAY-say hain', example: 'नमस्ते अजय जी, आप कैसे हैं?', exampleTranslation: 'Hello Mr. Ajay, how are you?' },
          { word: 'मेरा नाम ... है (Mera naam ... hai)', translation: 'My name is ...', pronunciation: 'may-raa naam ... hay', example: 'मेरा नाम कविता है.', exampleTranslation: 'My name is Kavita.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `आरव: नमस्ते! मेरा नाम आरव है।
रिया: नमस्ते आरव, मैं रिया हूँ।
आरव: आप कहाँ से हैं?
रिया: मैं जयपुर से हूँ। आप?
आरव: मैं दिल्ली में रहता हूँ। आपसे मिलकर खुशी हुई।`,
        audioText: 'Namaste! Mera naam Aarav hai. Namaste Aarav, main Riya hoon. Aap kahan se hain? Main Jaipur se hoon. Main Dilli mein rehta hoon. Aapse milkar khushi hui.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Thank you" in Hindi?',
        options: ['माफ कीजिए', 'शुक्रिया', 'कृपया', 'स्वागत है'],
        correctAnswer: 'शुक्रिया',
        explanation: '“शुक्रिया” and “धन्यवाद” both mean thank you. “माफ कीजिए” means “excuse me/sorry”.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: _____ नाम सीमा है. (My name is Seema)',
        correctAnswer: 'मेरा',
        explanation: '“मेरा नाम सीमा है” translates to “My name is Seema.”',
      },
      {
        type: 'translation',
        question: 'Translate to Hindi: "Nice to meet you"',
        correctAnswer: 'आपसे मिलकर खुशी हुई',
        explanation: '“Aapse milkar khushi hui” is the polite way to express “Nice to meet you.”',
      },
      {
        type: 'listening',
        question: 'Listen and choose what you hear.',
        options: ['मेरा नाम रोहन है', 'आप कहाँ से हैं?', 'शुभ रात्रि', 'अलविदा'],
        correctAnswer: 'मेरा नाम रोहन है',
        audioText: 'Mera naam Rohan hai',
        explanation: 'Identify introductions by listening for “Mera naam… hai”.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Hindi Numbers & Time Basics',
    slug: 'hindi-numbers-time',
    description: 'Count confidently to 100, read prices, and tell the time using natural Hindi expressions.',
    topic: 'Vocabulary',
    language: 'hindi',
    level: 'beginner',
    duration: 14,
    order: 2,
    objectives: [
      'Recognize core number roots and common shortcuts',
      'Tell time with “बजे” and describe routines',
      'Ask for prices politely in markets',
      'Use transliteration to bridge script learning',
    ],
    contents: [
      {
        type: 'text',
        title: 'Number Patterns',
        content: '0-10 have unique names. From 11 onwards, listen for blended sounds: “इक्कीस (21) = एक + बीस”. Tens such as तीस (30), चालीस (40) repeat in compounds. Practice aloud to memorize rhythm.',
        audioText: 'शून्य, एक, दो, तीन, चार, पाँच, छः, सात, आठ, नौ, दस... बीस, तीस, चालीस, पचास',
      },
      {
        type: 'vocabulary',
        title: 'Numbers & Prices',
        content: 'Mix numerals with measure words so you can negotiate quickly.',
        audioText: 'पाँच रुपये, दस बजे, पचहत्तर, डेढ़ सौ',
        vocabulary: [
          { word: 'पैंतालीस (45)', translation: 'forty-five', pronunciation: 'pain-taa-lees', example: 'बस पैंतालीस मिनट में आएगी.', exampleTranslation: 'The bus will arrive in forty-five minutes.' },
          { word: 'पचहत्तर (75)', translation: 'seventy-five', pronunciation: 'pach-hut-tar', example: 'यह शर्ट पचहत्तर रुपये की है.', exampleTranslation: 'This shirt costs seventy-five rupees.' },
          { word: 'डेढ़ सौ', translation: 'one hundred fifty', pronunciation: 'derdh-sau', example: 'टैक्सी डेढ़ सौ में आ जाएगी.', exampleTranslation: 'The taxi will come for 150.' },
          { word: 'साढ़े आठ बजे', translation: '8:30', pronunciation: 'saadhe aath baje', example: 'मीटिंग साढ़े आठ बजे शुरू होगी.', exampleTranslation: 'The meeting will start at 8:30.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Buying Fruit',
        content: `ग्राहक: ये सेब कैसे दिए?
दुकानदार: एक किलो पचास रुपये.
ग्राहक: आधा किलो दे दीजिए. कुल कितना हुआ?
दुकानदार: पच्चीस रुपये.`,
        audioText: 'Ye seb kaise diye? Ek kilo pachaas rupaye. Aadha kilo de dijiye. Kul kitna hua? Pachchees rupaye.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What does “साढ़े” indicate?',
        options: ['Minus fifteen', 'Plus thirty minutes', 'Double amount', 'Discount'],
        correctAnswer: 'Plus thirty minutes',
        explanation: '“साढ़े” means “half past”, e.g., साढ़े आठ = 8:30.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: बस _____ मिनट में आएगी. (45)',
        correctAnswer: 'पैंतालीस',
        explanation: 'Use the Hindi numeral rather than English digits for fluency.',
      },
      {
        type: 'translation',
        question: 'Translate: “The taxi will cost 150 rupees.”',
        correctAnswer: 'टैक्सी डेढ़ सौ रुपये की होगी',
        explanation: '“डेढ़ सौ” is the natural way to say 150.',
      },
      {
        type: 'multiple-choice',
        question: 'How would you say “It starts at 10 o’clock”?',
        options: ['यह दस बजे शुरू होता है', 'यह दस मिनट चलता है', 'यह दस में शुरू होगा', 'यह दस का शुरू है'],
        correctAnswer: 'यह दस बजे शुरू होता है',
        explanation: 'Pair “बजे” with the verb “शुरू होना”.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Family & Daily Routine',
    slug: 'hindi-family-routines',
    description: 'Describe your family, professions, and simple daily habits using present tense verbs.',
    topic: 'Speaking & Listening',
    language: 'hindi',
    level: 'beginner',
    duration: 15,
    order: 3,
    objectives: [
      'Introduce family members with genders and honorifics',
      'Use present habitual forms like “मैं काम करता हूँ”',
      'Talk about routines with time expressions',
      'Ask polite follow-up questions',
    ],
    contents: [
      {
        type: 'text',
        title: 'Family Titles',
        content: 'Use “-जी” for respect: मम्मीजी, पिताजी. Distinguish maternal vs paternal relatives: मौसी (mom’s sister) vs बुआ (dad’s sister).',
        audioText: 'मेरी बहन दिल्ली में रहती है. मेरे पिताजी डॉक्टर हैं.',
      },
      {
        type: 'vocabulary',
        title: 'Routine Verbs',
        content: 'Combine verb roots with gender endings: करता/करती, जाता/जाती.',
        audioText: 'उठना, पढ़ना, बनाना, खेलना',
        vocabulary: [
          { word: 'उठना', translation: 'to get up', pronunciation: 'uth-naa', example: 'मैं रोज़ छह बजे उठता हूँ.', exampleTranslation: 'I wake up at six daily.' },
          { word: 'पढ़ना', translation: 'to study/read', pronunciation: 'puhd-naa', example: 'मेरी बहन रात को पढ़ती है.', exampleTranslation: 'My sister studies at night.' },
          { word: 'खाना बनाना', translation: 'to cook food', pronunciation: 'khaana banaanaa', example: 'दादी जी हर सुबह नाश्ता बनाती हैं.', exampleTranslation: 'Grandmother cooks breakfast every morning.' },
          { word: 'काम करना', translation: 'to work', pronunciation: 'kaam kar-naa', example: 'पिताजी घर से काम करते हैं.', exampleTranslation: 'Dad works from home.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Talking About Family',
        content: `सिया: आपके परिवार में कौन-कौन है?
आरव: मेरे माता-पिता और छोटी बहन है. पिताजी बैंक में काम करते हैं.
सिया: आप कब काम पर जाते हैं?
आरव: मैं रोज़ नौ बजे ऑफिस जाता हूँ.`,
        audioText: 'Aapke parivaar mein kaun-kaun hai? Mere mata-pita aur chhoti bahan hai. Pitaji bank mein kaam karte hain.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you respectfully say “father”?',
        options: ['बाप', 'डैड', 'पिताजी', 'भाई'],
        correctAnswer: 'पिताजी',
        explanation: 'Adding “-जी” keeps the tone polite.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: मेरी बहन हर शाम योग _____ (करना).',
        correctAnswer: 'करती है',
        explanation: 'Use feminine singular present habitual “करती है”.',
      },
      {
        type: 'translation',
        question: 'Translate: "My grandmother cooks breakfast every day."',
        correctAnswer: 'मेरी दादी रोज़ नाश्ता बनाती हैं',
        explanation: 'Plural honorific “हैं” is used for elders.',
      },
      {
        type: 'multiple-choice',
        question: 'Which question asks about schedule?',
        options: ['आपका परिवार कहाँ है?', 'आप कब ऑफिस जाते हैं?', 'आप कौन हैं?', 'आपका नाम क्या है?'],
        correctAnswer: 'आप कब ऑफिस जाते हैं?',
        explanation: '“कब” asks “when”.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Navigating the Bazaar',
    slug: 'hindi-bazaar-conversations',
    description: 'Handle prices, quantities, and polite bargaining phrases in a North Indian marketplace.',
    topic: 'Practical Scenarios',
    language: 'hindi',
    level: 'intermediate',
    duration: 18,
    order: 1,
    objectives: [
      'Ask for prices and discounts politely',
      'Use measure words for fruits, vegetables, and textiles',
      'Express preferences and negotiate respectfully',
      'Understand common vendor responses',
    ],
    contents: [
      {
        type: 'text',
        title: 'Bazaar Etiquette',
        content: 'Vendors expect a brief greeting before business. Smile, start with “भैया/भाभी सुनिए” (listen, brother/sister), and stay respectful. Small talk keeps negotiations friendly.',
        audioText: 'Bhaiya, yeh कितने के हैं? Thoda kam kijiye na.',
      },
      {
        type: 'vocabulary',
        title: 'Money & Measures',
        content: 'Memorize these units so you can respond quickly when vendors rapid-fire numbers.',
        audioText: 'किलो, पाव, दर्जन, सौ, डेढ़ सौ, मोल भाव',
        vocabulary: [
          { word: 'किलो (Kilo)', translation: 'kilogram', pronunciation: 'kee-lo', example: 'एक किलो आलू दीजिए.', exampleTranslation: 'Give me one kilo of potatoes.' },
          { word: 'पाव (Paav)', translation: '250 grams', pronunciation: 'paav', example: 'आधा पाव मिर्ची चाहिए.', exampleTranslation: 'I need half a paav of chilies.' },
          { word: 'मोल भाव करना', translation: 'to bargain', pronunciation: 'mole-bhaav kar-naa', example: 'क्या थोड़ा मोल भाव कर सकते हैं?', exampleTranslation: 'Can we bargain a little?' },
          { word: 'डेढ़ सौ', translation: 'one hundred fifty', pronunciation: 'deyrh saw', example: 'यह डेढ़ सौ रुपये का है.', exampleTranslation: 'This costs 150 rupees.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Spice Stall',
        content: `ग्राहक: भैया, ये गरम मसाला कितने का है?
दुकानदार: दो सौ रुपये किलो।
ग्राहक: आधा किलो दे दीजिए। कुछ कम होगा?
दुकानदार: ठीक है, एक सौ अस्सी दे दीजिए।
ग्राहक: धन्यवाद! साथ में थोड़ी हल्दी भी तौल दें।`,
        audioText: 'Bhaiya, yeh garam masala kitne ka hai? Do sau rupaye kilo. Aadha kilo de dijiye. Kuchh kam hoga? Theek hai, ek sau assi de dijiye. Dhanyavaad! Saath mein thodi haldi bhi taul dein.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is the polite way to ask for a discount?',
        options: ['और चाहिए', 'थोड़ा कम कीजिए', 'जल्दी कीजिए', 'मत कीजिए'],
        correctAnswer: 'थोड़ा कम कीजिए',
        explanation: '“थोड़ा कम कीजिए” literally means “Please make it a little less.”',
      },
      {
        type: 'fill-blank',
        question: 'Complete: आधा _____ टमाटर दे दीजिए. (unit: kilo, paav, litre)',
        correctAnswer: 'किलो',
        explanation: 'Vegetables are usually sold by the kilo in traditional markets.',
      },
      {
        type: 'translation',
        question: 'Translate: "Please weigh 250 grams of saffron."',
        correctAnswer: 'कृपया पाव केसर तौल दीजिए',
        explanation: '“पाव” is 250 grams; “तौल दीजिए” asks the vendor to weigh it.',
      },
      {
        type: 'multiple-choice',
        question: 'If the vendor says "एक सौ सत्तर", what price is that?',
        options: ['130', '150', '170', '190'],
        correctAnswer: '170',
        explanation: '“एक सौ सत्तर” = 100 + 70 = 170.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Doctor Visits & Wellness',
    slug: 'hindi-doctor-appointments',
    description: 'Explain symptoms, schedule appointments, and understand basic medical advice in Hindi.',
    topic: 'Practical Scenarios',
    language: 'hindi',
    level: 'intermediate',
    duration: 19,
    order: 2,
    objectives: [
      'Describe pain and frequency using postpositions',
      'Ask for prescriptions and dosage instructions',
      'Understand common imperative forms from doctors',
      'Express concerns politely and clearly',
    ],
    contents: [
      {
        type: 'text',
        title: 'Explaining Symptoms',
        content: 'Pair body parts with “में दर्द है”. Use duration words like “पिछले दो दिनों से”. Mention frequency with “हर” or “दिन में दो बार”.',
        audioText: 'पिछले तीन दिनों से मुझे गले में दर्द है. सिर दर्द बार-बार हो रहा है.',
      },
      {
        type: 'vocabulary',
        title: 'Clinic Phrases',
        content: 'Mix Sanskrit-based medical nouns and casual Hindi so you can understand both doctor and receptionist.',
        audioText: 'मुलाक़ात, बुखार, दवाई, इंजेक्शन, खाँसी',
        vocabulary: [
          { word: 'बुखार', translation: 'fever', pronunciation: 'boo-khaar', example: 'मुझे हल्का बुखार है.', exampleTranslation: 'I have a mild fever.' },
          { word: 'खाँसी', translation: 'cough', pronunciation: 'khaan-see', example: 'खाँसी तीन दिन से है.', exampleTranslation: 'The cough has lasted three days.' },
          { word: 'दिन में दो बार', translation: 'twice a day', pronunciation: 'din mein do baar', example: 'दवाई दिन में दो बार लीजिए.', exampleTranslation: 'Take the medicine twice a day.' },
          { word: 'अपॉइंटमेंट / मुलाक़ात', translation: 'appointment', pronunciation: 'mul-aa-kaat', example: 'क्या मैं डॉक्टर की मुलाक़ात ले सकता हूँ?', exampleTranslation: 'Can I get an appointment with the doctor?' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Clinic',
        content: `रोगी: नमस्ते डॉक्टर, मुझे पिछले हफ्ते से खाँसी है.
डॉक्टर: क्या बुखार भी है?
रोगी: थोड़ा. रात को बढ़ जाता है.
डॉक्टर: यह दवाई दिन में दो बार लीजिए और ज्यादा पानी पीजिए.`,
        audioText: 'Namaste doctor, mujhe pichhle hafte se khaansi hai. Kya bukhaar bhi hai? Thoda. Raat ko badh jaata hai. Yeh davai din mein do baar lijiye.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say “twice a day”?',
        options: ['दिन में दो बार', 'दो दिन में', 'दिन दो में', 'हर दिन'],
        correctAnswer: 'दिन में दो बार',
        explanation: 'Literally “in a day, two times”.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: मुझे तीन दिनों से _____ दर्द है. (throat)',
        correctAnswer: 'गले में',
        explanation: 'Use “में” postposition with body part.',
      },
      {
        type: 'translation',
        question: 'Translate: “Please drink more water.”',
        correctAnswer: 'कृपया ज्यादा पानी पीजिए',
        explanation: 'Formal imperative uses “-जिए”.',
      },
      {
        type: 'multiple-choice',
        question: 'Which phrase would a doctor likely say?',
        options: ['मैं बाज़ार जा रहा हूँ', 'दवाई समय पर लीजिए', 'आप कहाँ रहते हैं?', 'क्या आप फिल्म देखेंगे?'],
        correctAnswer: 'दवाई समय पर लीजिए',
        explanation: 'It instructs the patient to take medicine on time.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Commuting & Workplace Hindi',
    slug: 'hindi-commute-work',
    description: 'Discuss traffic, meetings, and collaboration with coworkers while switching between formal and informal Hindi.',
    topic: 'Professional',
    language: 'hindi',
    level: 'intermediate',
    duration: 20,
    order: 3,
    objectives: [
      'Explain delays and commuting plans politely',
      'Set agendas and share updates in stand-ups',
      'Use modal verbs “हो सके तो”, “ज़रूर” for commitments',
      'Switch between “तुम” and “आप” strategically',
    ],
    contents: [
      {
        type: 'text',
        title: 'Formal vs Informal',
        content: 'Use “आप” with seniors, “तुम” or “तू” with close peers. In mixed meetings, default to “आप लोग”. Add softeners like “अगर आपको ठीक लगे तो”.',
        audioText: 'अगर आपको ठीक लगे तो मीटिंग दस मिनट आगे बढ़ा दें. ट्रैफिक की वजह से मैं देर से पहुँचूँगा.',
      },
      {
        type: 'vocabulary',
        title: 'Office Toolkit',
        content: 'Combine English loanwords with Hindi verbs: “sync करना”, “plan बनाना”.',
        audioText: 'मीटिंग, परियोजना, समय सीमा, ट्रैफिक, प्रगति',
        vocabulary: [
          { word: 'समय सीमा', translation: 'deadline', pronunciation: 'samay seema', example: 'समय सीमा अगले शुक्रवार है.', exampleTranslation: 'The deadline is next Friday.' },
          { word: 'प्रगति रिपोर्ट', translation: 'progress report', pronunciation: 'pragati report', example: 'कृपया प्रगति रिपोर्ट भेज दीजिए.', exampleTranslation: 'Please send the progress report.' },
          { word: 'मीटिंग आगे बढ़ाना', translation: 'to postpone a meeting', pronunciation: 'meeting aage badhaana', example: 'हमें मीटिंग आधे घंटे आगे बढ़ानी है.', exampleTranslation: 'We need to push the meeting by half an hour.' },
          { word: 'हो सके तो', translation: 'if possible', pronunciation: 'ho sake to', example: 'हो सके तो आज ही ड्राफ्ट भेजें.', exampleTranslation: 'If possible, send the draft today itself.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Morning Stand-up',
        content: `लीड: नमस्ते टीम, आज की प्राथमिकता क्या है?
डेव: ट्रैफिक ज्यादा है, मैं 10 मिनट देर से पहुँचूँगा.
लीड: ठीक है, हो सके तो कॉल से जुड़ जाइए.
डिज़ाइनर: मैं प्रोटोटाइप अपडेट कर रही हूँ और शाम तक भेज दूँगी.`,
        audioText: 'Namaste team, aaj ki prathmikta kya hai? Traffic zyada hai, main 10 minute der se pahunchunga. Theek hai, ho sake to call se jud jaiye.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which phrase softens a request?',
        options: ['हो सके तो', 'तुरंत', 'अभी के अभी', 'ज़रूर'],
        correctAnswer: 'हो सके तो',
        explanation: 'It literally means “if it can happen”, softening the tone.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: ट्रैफिक की _____ से मैं देर से आया. (because of)',
        correctAnswer: 'वजह',
        explanation: '“की वजह से” expresses cause.',
      },
      {
        type: 'translation',
        question: 'Translate: “Please postpone the meeting by 30 minutes.”',
        correctAnswer: 'कृपया मीटिंग को 30 मिनट आगे बढ़ा दीजिए',
        explanation: 'Use polite imperative “दीजिए”.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you say “deadline”?',
        options: ['समय सीमा', 'समय', 'सीमा', 'मंज़िल'],
        correctAnswer: 'समय सीमा',
        explanation: 'Literal translation: “time limit.”',
      },
    ],
    isActive: true,
  },
  {
    title: 'Expressing Opinions with “कि” Clauses',
    slug: 'hindi-ki-clause-expressions',
    description: 'Use advanced sentence patterns with “कि (that)” to express hopes, doubts, and recommendations in Hindi.',
    topic: 'Grammar',
    language: 'hindi',
    level: 'advanced',
    duration: 22,
    order: 1,
    objectives: [
      'Link clauses with “कि” to report speech and thoughts',
      'Use subjunctive-like verb forms with “जरूरी है कि...”',
      'Express emotions and doubts formally',
      'Sound natural in professional Hindi contexts',
    ],
    contents: [
      {
        type: 'text',
        title: 'Role of “कि”',
        content: 'Hindi does not have a separate subjunctive conjugation, but “कि” clauses fulfill the same job as English “that”. Combine them with modal verbs or phrases like “जरूरी है”, “उम्मीद है”, “मुझे लगता है” to express nuanced meaning.',
        audioText: 'Mujhe lagta hai कि आप सही हैं. यह जरूरी है कि हम समय पर पहुँचें.',
      },
      {
        type: 'grammar',
        title: 'Pattern Bank',
        content: `उम्मीद है कि + future/imperative form
जरूरी है कि + subjunctive-like imperative
मुझे डर है कि + future
मैं चाहता/चाहती हूँ कि + verb (subjunctive tone)

Examples:
उम्मीद है कि आप मीटिंग में आएँगे।
यह जरूरी है कि टीम समय से रिपोर्ट जमा करे।`,
        audioText: 'Umeed hai ki aap meeting mein aayenge. Ye zaroori hai ki team samay se report jama kare.',
        grammarPoints: [
          'Use the “-ें” ending (jaayeँ, kareँ) after कि for polite imperatives',
          'Drop “कि” only when clauses are short; formal writing keeps it',
          'Stack emotions: “मुझे खुशी है कि…” + result clause',
        ],
      },
      {
        type: 'dialogue',
        title: 'Project Stand-Up',
        content: `प्रबंधक: जरूरी है कि सब लोग समय पर अपडेट शेयर करें।
इंजीनियर: मुझे लगता है कि हम डेडलाइन पूरी कर लेंगे।
डिज़ाइनर: मुझे डर है कि यूज़र टेस्टिंग में देरी हो सकती है।
प्रबंधक: ठीक है, बस यह ध्यान रखें कि रिपोर्ट आज ही भेजी जाए।`,
        audioText: 'Zaroori hai ki sab log samay par update share karein. Mujhe lagta hai ki hum deadline poori kar lenge. Mujhe dar hai ki user testing mein deri ho sakti hai. Theek hai, bas yeh dhyan rakhein ki report aaj hi bheji jaye.',
      },
    ],
    exercises: [
      {
        type: 'translation',
        question: 'Translate: "It is important that the team arrives early."',
        correctAnswer: 'यह जरूरी है कि टीम जल्दी पहुँचे',
        explanation: 'Use “पहुँचे” (subjunctive-like imperative) after “जरूरी है कि”.',
      },
      {
        type: 'multiple-choice',
        question: 'Choose the best clause to express doubt: मुझे _____ कि वह आएगा.',
        options: ['यकीन है', 'डर है', 'खुशी है', 'संदेह नहीं है'],
        correctAnswer: 'डर है',
        explanation: '“मुझे डर है कि…” signals fear or doubt.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: मैं चाहता हूँ कि तुम सच _____ (बोलना).',
        correctAnswer: 'बोलो',
        explanation: 'Imperative “बोलो” follows “मैं चाहता हूँ कि…”.',
      },
      {
        type: 'multiple-choice',
        question: 'Which sentence best mirrors a subjunctive tone?',
        options: [
          'मुझे लगता है कि आप खुश हैं।',
          'मैं जानता हूँ कि आप आएंगे।',
          'उम्मीद है कि आप प्रोजेक्ट पूरा करें।',
          'वह कहता है कि मैं ठीक हूँ।',
        ],
        correctAnswer: 'उम्मीद है कि आप प्रोजेक्ट पूरा करें।',
        explanation: '“उम्मीद है कि…” + verb in imperative tone mimics subjunctive usage.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Hindi News & Media Analysis',
    slug: 'hindi-news-media',
    description: 'Summarize bulletins, analyze tone, and discuss current affairs using advanced connectors and passive voice.',
    topic: 'Media & Culture',
    language: 'hindi',
    level: 'advanced',
    duration: 24,
    order: 2,
    objectives: [
      'Extract key facts from headlines and quotes',
      'Use passive voice “कहा गया है” to report neutrally',
      'Contrast opinions with “जहाँ तक... का सवाल है”',
      'Debate social topics respectfully',
    ],
    contents: [
      {
        type: 'text',
        title: 'Passive & Reported Speech',
        content: 'News Hindi loves passive forms: “यह बताया गया कि…”, “सरकार ने कहा कि…”. When citing sources, add “के अनुसार” for credibility.',
        audioText: 'सरकार ने कहा कि नई नीति लागू की जाएगी. रिपोर्ट में बताया गया है कि प्रदूषण घटा है.',
      },
      {
        type: 'vocabulary',
        title: 'Headline Toolkit',
        content: 'Blend Sanskritized words with conversational Hindi to sound informed yet approachable.',
        audioText: 'घोषणा, नीति, विवाद, आंकड़े, के अनुसार',
        vocabulary: [
          { word: 'घोषणा', translation: 'announcement', pronunciation: 'gho-sha-naa', example: 'नई घोषणा कल की गई.', exampleTranslation: 'A new announcement was made yesterday.' },
          { word: 'आंकड़े', translation: 'figures/data', pronunciation: 'aank-de', example: 'हाल के आंकड़ों के अनुसार बेरोज़गारी घटी है.', exampleTranslation: 'According to recent figures, unemployment has fallen.' },
          { word: 'विवाद', translation: 'controversy', pronunciation: 'vi-vaad', example: 'नीति पर विवाद बढ़ रहा है.', exampleTranslation: 'Controversy over the policy is growing.' },
          { word: 'के अनुसार', translation: 'according to', pronunciation: 'ke anusaar', example: 'विशेषज्ञों के अनुसार यह कदम जरूरी है.', exampleTranslation: 'According to experts, this step is necessary.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'News Panel Discussion',
        content: `एंकर: ताज़ा खबर के अनुसार बारिश रिकॉर्ड तोड़ रही है.
रिपोर्टर: जी, प्रशासन ने चेतावनी जारी की है.
विशेषज्ञ: जहाँ तक जल प्रबंधन का सवाल है, हमें दीर्घकालिक योजना बनानी होगी.
एंकर: क्या नीति में बदलाव की घोषणा हो सकती है?`,
        audioText: 'Taaza khabar ke anusar barish record tod rahi hai. Prashasan ne chetavni jaari ki hai. Jahaan tak jal prabandhan ka sawal hai, humein deerghkaalik yojana banani hogi.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which phrase reports information neutrally?',
        options: ['मैं मानता हूँ', 'यह बताया गया है', 'तुम क्यों कह रहे हो', 'मेरा विचार है'],
        correctAnswer: 'यह बताया गया है',
        explanation: 'Passive “बताया गया है” distances the speaker from the claim.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: विशेषज्ञों _____ योजना सफल होगी. (according to)',
        correctAnswer: 'के अनुसार',
        explanation: '“के अनुसार” attaches to plural nouns without change.',
      },
      {
        type: 'translation',
        question: 'Translate: "The report states that pollution has decreased."',
        correctAnswer: 'रिपोर्ट में कहा गया है कि प्रदूषण घटा है',
        explanation: 'Combine “कहा गया है” with “कि”.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you introduce a topic-focused clause?',
        options: ['जहाँ तक... का सवाल है', 'क्योंकि', 'अगर', 'लेकिन'],
        correctAnswer: 'जहाँ तक... का सवाल है',
        explanation: 'This phrase literally means “as far as ... is concerned.”',
      },
    ],
    isActive: true,
  },
  {
    title: 'Negotiation & Strategy Meetings',
    slug: 'hindi-negotiation-strategy',
    description: 'Lead high-stakes conversations using persuasive Hindi, conditional commitments, and cultural cues.',
    topic: 'Professional',
    language: 'hindi',
    level: 'advanced',
    duration: 26,
    order: 3,
    objectives: [
      'Frame proposals with “हम सुझाव देते हैं कि…”',
      'Use conditional promises and trade-offs',
      'Handle disagreement diplomatically with honorifics',
      'Close meetings with clear next steps',
    ],
    contents: [
      {
        type: 'text',
        title: 'Diplomatic Tone',
        content: 'Combine respect + clarity: “हम मानते हैं कि…”, “यदि आप सहमत हों तो…”. Signal flexibility but stay firm on priorities.',
        audioText: 'यदि आप सहमत हों तो हम अगली तिमाही में निवेश बढ़ाएँगे.',
      },
      {
        type: 'grammar',
        title: 'Conditional Clauses',
        content: `Structure: यदि/अगर + future/conditional clause
यदि आप समय सीमा बढ़ाएँगे, तो हम गुणवत्ता पर ध्यान देंगे.
अगर यह प्रस्ताव स्वीकार हो जाए, तो परियोजना तुरंत शुरू होगी.

Use “वरना” for otherwise statements.`,
        audioText: 'Yadi aap samay seema badhaenge, to hum gunwatta par dhyan denge. Varna hum kisi aur विकल्प पर विचार करेंगे.',
        grammarPoints: [
          '“यदि” adds formality; “अगर” is conversational',
          'Use passive “स्वीकार किया जाए” to depersonalize demands',
          'Close offers with “इसके बदले हम…” to show reciprocity',
        ],
      },
      {
        type: 'dialogue',
        title: 'Strategy Call',
        content: `लीड: हम सुझाव देते हैं कि कीमतें चरणों में बढ़ाई जाएँ.
साथी: यदि ग्राहक सहमत हों तो ही.
लीड: बिलकुल, वरना हम नई योजना प्रस्तुत करेंगे.
साथी: ठीक है, अगली बैठक में निर्णय लेते हैं.`,
        audioText: 'Hum sujhaav dete hain ki keematein charanon mein badhai jaayen. Yadi grahak sahmat hon to hi. Bilkul, warna hum nai yojana prastut karenge.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which phrase politely offers a suggestion?',
        options: ['हम सुझाव देते हैं कि', 'तुरंत करो', 'यह ठीक नहीं', 'ऐसा मत करो'],
        correctAnswer: 'हम सुझाव देते हैं कि',
        explanation: 'It literally means “we suggest that…”.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: यदि आप _____, तो हम जल्द फैसला करेंगे. (agree)',
        correctAnswer: 'सहमत हों',
        explanation: 'Honorific plural “हों” keeps the tone formal.',
      },
      {
        type: 'translation',
        question: 'Translate: "Otherwise, we will explore another option."',
        correctAnswer: 'वरना हम कोई और विकल्प तलाशेंगे',
        explanation: '“वरना” introduces consequences.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you express reciprocity?',
        options: ['इसके बदले', 'इसके बाद', 'इसके पहले', 'इसके बिना'],
        correctAnswer: 'इसके बदले',
        explanation: 'Means “in exchange for this”.',
      },
    ],
    isActive: true,
  },
];

const frenchLessons = [
  {
    title: 'French Greetings & Essentials',
    slug: 'french-greetings-essentials',
    description: 'Master the most common French greetings, introductions, and polite expressions for everyday encounters.',
    topic: 'Speaking & Listening',
    language: 'french',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Use bonjour, salut, and bonsoir appropriately',
      'Introduce yourself and ask for names politely',
      'Pronounce nasal vowels in iconic phrases',
      'Sound confident in first conversations',
    ],
    contents: [
      {
        type: 'text',
        title: 'When to Say Bonjour',
        content: 'French greetings change with time and familiarity. “Bonjour” works until the evening, “Bonsoir” takes over after sunset, and “Salut” is only for friends and equals.',
        audioText: 'Bonjour! Je m’appelle Claire. Enchanté de faire votre connaissance.',
      },
      {
        type: 'vocabulary',
        title: 'Greeting Toolkit',
        content: 'Repeat these mini-dialogues to nail pronunciation and rhythm.',
        audioText: 'Bonjour, Salut, Enchanté, Comment allez-vous, Je viens de Paris',
        vocabulary: [
          { word: 'Bonjour', translation: 'Good morning / hello', pronunciation: 'bohn-zhur', example: 'Bonjour, Madame Dupont.', exampleTranslation: 'Hello, Mrs. Dupont.' },
          { word: 'Enchanté(e)', translation: 'Nice to meet you', pronunciation: 'on-shan-tay', example: 'Enchantée, je suis Léa.', exampleTranslation: 'Nice to meet you, I am Léa.' },
          { word: 'Comment allez-vous ?', translation: 'How are you? (formal)', pronunciation: 'koh-mahn tah-lay voo', example: 'Bonjour Paul, comment allez-vous ?', exampleTranslation: 'Hello Paul, how are you?' },
          { word: 'Je viens de...', translation: 'I come from...', pronunciation: 'zhuh vyahng duh', example: 'Je viens de Montréal.', exampleTranslation: 'I come from Montreal.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Networking Event',
        content: `Camille: Bonjour! Je m'appelle Camille.
Lucas: Enchanté Camille, moi c'est Lucas.
Camille: Tu viens d'où ?
Lucas: Je viens de Lyon. Et toi ?
Camille: Je suis de Bruxelles.`,
        audioText: 'Bonjour! Je m’appelle Camille. Enchanté Camille, moi c’est Lucas. Tu viens d’où? Je viens de Lyon. Et toi? Je suis de Bruxelles.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which greeting is informal?',
        options: ['Bonjour', 'Bonsoir', 'Salut', 'Enchanté'],
        correctAnswer: 'Salut',
        explanation: '“Salut” is reserved for friends, family, or peers.',
      },
      {
        type: 'translation',
        question: 'Translate: "Nice to meet you, my name is Hugo."',
        correctAnswer: 'Enchanté, je m’appelle Hugo',
        explanation: 'Start with “Enchanté” then introduce yourself with “je m’appelle…”.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Comment _____ -vous ? (aller)',
        correctAnswer: 'allez',
        explanation: 'The polite “How are you?” is “Comment allez-vous ?”.',
      },
      {
        type: 'listening',
        question: 'Identify the phrase you hear.',
        options: ['Je viens de Nice', 'Je vais à Nice', 'Je quitte Nice', 'Je vois Nice'],
        correctAnswer: 'Je viens de Nice',
        audioText: 'Je viens de Nice',
        explanation: 'Focus on the nasal “viens” sound to distinguish “venir”.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers & Street Markets',
    slug: 'french-numbers-markets',
    description: 'Count euros, weigh produce, and bargain politely in open-air markets across the Francophone world.',
    topic: 'Vocabulary',
    language: 'french',
    level: 'beginner',
    duration: 14,
    order: 2,
    objectives: [
      'Pronounce tricky teens and compound numbers',
      'Ask for quantities using metric units',
      'React to prices and request discounts politely',
      'Use liaison to sound natural when counting',
    ],
    contents: [
      {
        type: 'text',
        title: 'Counting Patterns',
        content: 'Remember that French numbers switch base at 70 and 90: 70 = soixante-dix, 95 = quatre-vingt-quinze. Liaison links the words: quatre-vingT-un.',
        audioText: 'vingt, trente, soixante-dix, soixante-quinze, quatre-vingt, quatre-vingt-dix',
      },
      {
        type: 'vocabulary',
        title: 'Quantities & Money',
        content: 'These staples cover produce, cheese, and pastries.',
        audioText: 'un kilo, une livre, la promotion, c’est combien, trop cher',
        vocabulary: [
          { word: 'un kilo de pommes', translation: 'a kilo of apples', pronunciation: 'uh kee-lo duh pom', example: 'Je voudrais un kilo de pommes, s’il vous plaît.', exampleTranslation: 'I would like a kilo of apples, please.' },
          { word: 'une livre', translation: '500 grams', pronunciation: 'ewn leevr', example: 'Une livre de fraises suffit.', exampleTranslation: 'Half a kilo of strawberries is enough.' },
          { word: 'C’est combien ?', translation: 'How much is it?', pronunciation: 'say kohm-byahn', example: 'Bonjour, c’est combien les tomates ?', exampleTranslation: 'Hello, how much are the tomatoes?' },
          { word: 'C’est un peu cher', translation: 'It’s a bit expensive', pronunciation: 'say uh puh shair', example: 'C’est un peu cher, vous pouvez faire un prix ?', exampleTranslation: 'It’s a bit expensive, can you give a better price?' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Marché',
        content: `Client: Bonjour, c’est combien les abricots ?
Vendeur: 4 euros le kilo.
Client: D’accord, je prends une livre. Vous pouvez faire un petit prix ?
Vendeur: Allez, 3,50 pour vous.`,
        audioText: 'Bonjour, c’est combien les abricots? Quatre euros le kilo. D’accord, je prends une livre. Vous pouvez faire un petit prix?',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say 75 in French?',
        options: ['soixante-cinq', 'soixante-quinze', 'quatre-vingt-cinq', 'quatre-vingt-quinze'],
        correctAnswer: 'soixante-quinze',
        explanation: 'Literally “sixty-fifteen.”',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Je voudrais _____ kilo de tomates.',
        correctAnswer: 'un',
        explanation: 'Use “un” before masculine “kilo”.',
      },
      {
        type: 'translation',
        question: 'Translate: “It’s too expensive.”',
        correctAnswer: 'C’est trop cher',
        explanation: '“Trop” intensifies adjectives.',
      },
      {
        type: 'multiple-choice',
        question: 'Which measure equals 500 grams?',
        options: ['une tranche', 'une livre', 'une boîte', 'une douzaine'],
        correctAnswer: 'une livre',
        explanation: 'Markets still use “livre” for half a kilo.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Café Culture & Small Talk',
    slug: 'french-cafe-smalltalk',
    description: 'Order confidently, handle the bill, and keep light conversation flowing at cafés and bakeries.',
    topic: 'Speaking & Listening',
    language: 'french',
    level: 'beginner',
    duration: 15,
    order: 3,
    objectives: [
      'Differentiate espresso drinks and baked goods',
      'Use polite imperatives when ordering',
      'React to weather or local events casually',
      'Ask for the check and tip appropriately',
    ],
    contents: [
      {
        type: 'text',
        title: 'Ordering Like a Local',
        content: 'French cafés prefer “Je vais prendre” or “Pour moi”. Avoid “Je veux”. End with “s’il vous plaît”.',
        audioText: 'Pour moi un café crème, s’il vous plaît. L’addition quand vous avez un moment.',
      },
      {
        type: 'vocabulary',
        title: 'Menu Must-Haves',
        content: 'Learn coffee styles and bakery items so you never freeze in line.',
        audioText: 'un café allongé, un noisette, la viennoiserie, une tartine, l’addition',
        vocabulary: [
          { word: 'un café crème', translation: 'coffee with hot milk', pronunciation: 'kah-fay krem', example: 'Je prends un café crème chaque matin.', exampleTranslation: 'I have a café crème every morning.' },
          { word: 'un noisette', translation: 'espresso with a dash of milk', pronunciation: 'nwah-zet', example: 'Un noisette, merci.', exampleTranslation: 'A noisette, thanks.' },
          { word: 'une viennoiserie', translation: 'pastry (croissant, pain au chocolat)', pronunciation: 'vyen-wah-zuh-ree', example: 'Quelle viennoiserie conseillez-vous ?', exampleTranslation: 'Which pastry do you recommend?' },
          { word: 'L’addition, s’il vous plaît', translation: 'The check, please', pronunciation: 'lah-dee-syon seel voo pleh', example: 'L’addition, s’il vous plaît. On paie au comptoir ?', exampleTranslation: 'Can we have the check? Do we pay at the counter?' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Counter',
        content: `Serveur: Bonjour, qu’est-ce que vous prenez ?
Client: Je vais prendre un noisette et un croissant, s’il vous plaît.
Serveur: Sur place ou à emporter ?
Client: Sur place.`,
        audioText: 'Bonjour, qu’est-ce que vous prenez? Je vais prendre un noisette et un croissant, s’il vous plaît. Sur place ou à emporter? Sur place.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which phrase sounds most polite when ordering?',
        options: ['Je veux un café', 'Donne-moi un café', 'Je vais prendre un café', 'Un café maintenant'],
        correctAnswer: 'Je vais prendre un café',
        explanation: '“Je vais prendre” mirrors native phrasing.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: L’addition, _____ vous plaît.',
        correctAnswer: 's’il',
        explanation: 'Standard formula “s’il vous plaît”.',
      },
      {
        type: 'translation',
        question: 'Translate: “For me a croissant and an espresso.”',
        correctAnswer: 'Pour moi un croissant et un espresso',
        explanation: '“Pour moi” is a casual, accepted opener.',
      },
      {
        type: 'multiple-choice',
        question: 'What does “sur place” mean?',
        options: ['To go', 'Eat in', 'Half price', 'Cash only'],
        correctAnswer: 'Eat in',
        explanation: '“À emporter” means takeaway; “sur place” stays on site.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Planning a Weekend Trip',
    slug: 'french-weekend-trip',
    description: 'Use future proche, transportation vocabulary, and lodging expressions to organize a short getaway in French.',
    topic: 'Practical Scenarios',
    language: 'french',
    level: 'intermediate',
    duration: 18,
    order: 1,
    objectives: [
      'Make plans using futur proche and modal verbs',
      'Book train tickets and hotel rooms politely',
      'Ask about check-in, breakfast, and amenities',
      'Compare itinerary options with pros and cons',
    ],
    contents: [
      {
        type: 'text',
        title: 'Futur Proche Refresher',
        content: 'Use “aller + infinitif” to describe near-future actions: “Nous allons visiter Bordeaux”, “Je vais acheter les billets demain”. It keeps plans sounding natural.',
        audioText: 'Nous allons prendre le train à 9h. Je vais réserver un hôtel près du centre.',
      },
      {
        type: 'vocabulary',
        title: 'Transport & Lodging',
        content: 'Memorize these key nouns and collocations before you arrive at the guichet.',
        audioText: 'aller-retour, guichet, composteur, chambre double, petit-déjeuner compris',
        vocabulary: [
          { word: 'aller-retour', translation: 'round trip', pronunciation: 'ah-lay ruh-toor', example: 'Je voudrais un aller-retour pour Lille.', exampleTranslation: 'I would like a round-trip ticket to Lille.' },
          { word: 'guichet', translation: 'ticket counter', pronunciation: 'gee-shay', example: 'Les billets sont au guichet 12.', exampleTranslation: 'The tickets are at counter 12.' },
          { word: 'chambre double', translation: 'double room', pronunciation: 'shahm-br duh-bl', example: 'La chambre double est à 120€ la nuit.', exampleTranslation: 'The double room is €120 per night.' },
          { word: 'petit-déjeuner compris', translation: 'breakfast included', pronunciation: 'puh-tee day-zhuh-nay kohm-pree', example: 'Le petit-déjeuner est-il compris ?', exampleTranslation: 'Is breakfast included?' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Booking Over the Phone',
        content: `Client: Bonjour, je voudrais réserver une chambre double pour ce week-end.
Hôtel: Très bien, pour quelles dates ?
Client: Du 12 au 14. Le petit-déjeuner est-il compris ?
Hôtel: Oui, et l’annulation est gratuite jusqu’à 48 heures avant l’arrivée.
Client: Parfait, je vais confirmer par email.`,
        audioText: 'Bonjour, je voudrais réserver une chambre double pour ce week-end. Très bien, pour quelles dates? Du 12 au 14. Le petit-déjeuner est-il compris? Oui. Parfait, je vais confirmer par email.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which sentence uses futur proche?',
        options: [
          'Nous visitons Marseille.',
          'Nous allons visiter Marseille.',
          'Nous avons visité Marseille.',
          'Nous visiterions Marseille.',
        ],
        correctAnswer: 'Nous allons visiter Marseille.',
        explanation: '“Aller + infinitive” signals futur proche.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Je _____ acheter les billets en ligne. (aller)',
        correctAnswer: 'vais',
        explanation: '“Je vais + infinitive” expresses an imminent plan.',
      },
      {
        type: 'translation',
        question: 'Translate: "Is breakfast included in the price?"',
        correctAnswer: 'Le petit-déjeuner est-il compris dans le prix ?',
        explanation: 'Notice the inversion “est-il” for a formal question.',
      },
      {
        type: 'multiple-choice',
        question: 'At the station, where do you validate tickets?',
        options: ['la valise', 'le composteur', 'la consigne', 'le quai'],
        correctAnswer: 'le composteur',
        explanation: '“Composteur” refers to the machine that stamps your ticket.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Housing & Rentals',
    slug: 'french-housing-rentals',
    description: 'Book short-term rentals or apartments, negotiate deposits, and describe amenities in French.',
    topic: 'Practical Scenarios',
    language: 'french',
    level: 'intermediate',
    duration: 19,
    order: 2,
    objectives: [
      'Understand rental listings and abbreviations',
      'Describe must-have amenities and dealbreakers',
      'Discuss leases, deposits, and utility costs',
      'Schedule visits and follow up professionally',
    ],
    contents: [
      {
        type: 'text',
        title: 'Reading Listings',
        content: 'Ads often use shorthand: T2 = 1 bedroom + living room, “charges comprises” = utilities included. Always clarify “caution” (deposit) and “bail” (lease).',
        audioText: 'Appartement T2 lumineux, charges comprises, caution d’un mois.',
      },
      {
        type: 'vocabulary',
        title: 'Rental Essentials',
        content: 'Learn the key nouns plus polite verbs to negotiate.',
        audioText: 'la caution, le bail, charges comprises, un état des lieux, les transports',
        vocabulary: [
          { word: 'la caution', translation: 'security deposit', pronunciation: 'la koh-syon', example: 'La caution équivaut à un mois de loyer.', exampleTranslation: 'The deposit equals one month of rent.' },
          { word: 'charges comprises', translation: 'utilities included', pronunciation: 'sharj kom-preez', example: 'Le loyer est de 900€, charges comprises.', exampleTranslation: 'Rent is €900 with utilities included.' },
          { word: 'un état des lieux', translation: 'check-in inventory', pronunciation: 'ay-tah day lieu', example: 'On fera un état des lieux mercredi.', exampleTranslation: 'We’ll do the move-in inspection Wednesday.' },
          { word: 'les transports en commun', translation: 'public transit', pronunciation: 'lay trahns-por an koh-mun', example: 'L’appartement est proche des transports en commun.', exampleTranslation: 'The apartment is close to public transit.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'Calling a Landlord',
        content: `Locataire: Bonjour, j’appelle pour l’annonce du T2 à Montreuil.
Propriétaire: Oui, il est toujours disponible.
Locataire: Les charges sont comprises ?
Propriétaire: Oui, et la caution correspond à un mois de loyer.`,
        audioText: 'Bonjour, j’appelle pour l’annonce du T2 à Montreuil. Les charges sont comprises? Oui, et la caution correspond à un mois de loyer.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What does “charges comprises” mean?',
        options: ['Deposit included', 'Utilities included', 'Pets allowed', 'Agency fee'],
        correctAnswer: 'Utilities included',
        explanation: 'Charges = utilities/fees paid monthly.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: La caution _____ à un mois de loyer.',
        correctAnswer: 'équivaut',
        explanation: 'Use “équivaut à” = “is equivalent to.”',
      },
      {
        type: 'translation',
        question: 'Translate: “Is the apartment close to public transit?”',
        correctAnswer: 'L’appartement est-il proche des transports en commun ?',
        explanation: 'Use inversion for formal question.',
      },
      {
        type: 'multiple-choice',
        question: 'What is a “T2” apartment?',
        options: ['Studio', 'Two bedrooms', 'One bedroom + living room', 'Three bedrooms'],
        correctAnswer: 'One bedroom + living room',
        explanation: '“T” stands for “type”: T2 = 2 main rooms total.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Health & Appointments',
    slug: 'french-health-appointments',
    description: 'Explain symptoms, understand remedies, and navigate pharmacies and doctors’ offices.',
    topic: 'Practical Scenarios',
    language: 'french',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Describe pain, frequency, and duration accurately',
      'Interact with receptionists to set appointments',
      'Understand prescription and over-the-counter vocabulary',
      'Follow up on test results respectfully',
    ],
    contents: [
      {
        type: 'text',
        title: 'Explaining Symptoms',
        content: 'Use “avoir mal à” for pain (“J’ai mal à la gorge”). Describe duration with “depuis” + time period. Receptionists appreciate “Est-ce possible de…?”',
        audioText: 'J’ai mal à la tête depuis hier. Est-ce possible de voir le docteur cet après-midi ?',
      },
      {
        type: 'vocabulary',
        title: 'Clinic & Pharmacy',
        content: 'Memorize these phrases to follow advice precisely.',
        audioText: 'une ordonnance, une prise de sang, le sirop, toutes les quatre heures',
        vocabulary: [
          { word: 'une ordonnance', translation: 'prescription', pronunciation: 'ewn or-doh-nahns', example: 'Le médecin a écrit une ordonnance.', exampleTranslation: 'The doctor wrote a prescription.' },
          { word: 'à jeun', translation: 'fasting/on an empty stomach', pronunciation: 'ah zhun', example: 'Vous devez être à jeun pour la prise de sang.', exampleTranslation: 'You must fast for the blood test.' },
          { word: 'toutes les quatre heures', translation: 'every four hours', pronunciation: 'toot lay katr eur', example: 'Prenez ce sirop toutes les quatre heures.', exampleTranslation: 'Take this syrup every four hours.' },
          { word: 'une consultation', translation: 'appointment/consultation', pronunciation: 'koon-sul-ta-syon', example: 'Je voudrais une consultation demain matin.', exampleTranslation: 'I’d like an appointment tomorrow morning.' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Doctor',
        content: `Patient: Bonjour docteur, j’ai de la fièvre depuis trois jours.
Docteur: Vous avez d’autres symptômes ?
Patient: Oui, une toux sèche.
Docteur: D’accord, je vais vous prescrire un sirop à prendre toutes les quatre heures.`,
        audioText: 'Bonjour docteur, j’ai de la fièvre depuis trois jours. Vous avez d’autres symptômes? Oui, une toux sèche. Je vous prescris un sirop à prendre toutes les quatre heures.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What does “à jeun” mean?',
        options: ['With water', 'After meals', 'Fasting', 'Before sleep'],
        correctAnswer: 'Fasting',
        explanation: '“À jeun” literally means “on an empty stomach.”',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Prenez ce sirop _____ les quatre heures.',
        correctAnswer: 'toutes',
        explanation: 'Phrase: “toutes les quatre heures”.',
      },
      {
        type: 'translation',
        question: 'Translate: “I’ve had a sore throat since yesterday.”',
        correctAnswer: 'J’ai mal à la gorge depuis hier',
        explanation: 'Combine “avoir mal à” + body part.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you politely ask for an appointment?',
        options: ['Je veux un rendez-vous', 'Donnez-moi un rendez-vous', 'Je voudrais prendre rendez-vous', 'Faites vite'],
        correctAnswer: 'Je voudrais prendre rendez-vous',
        explanation: '“Je voudrais” softens the request.',
      },
    ],
    isActive: true,
  },
  {
    title: 'French Subjunctive Essentials',
    slug: 'french-subjunctive-essentials',
    description: 'Use the present subjunctive to express wishes, emotions, necessity, and doubt with native-like phrasing.',
    topic: 'Grammar',
    language: 'french',
    level: 'advanced',
    duration: 22,
    order: 1,
    objectives: [
      'Form the present subjunctive for regular and key irregular verbs',
      'Recognize WEIRDO triggers in French contexts',
      'Contrast subjunctive vs. indicative in similar sentences',
      'Confidently use expressions like “il faut que…”, “bien que…”, “à condition que…”',
    ],
    contents: [
      {
        type: 'text',
        title: 'When French Requires Subjunctive',
        content: 'Use subjunctive when the action is uncertain, desired, or subjective. Typical triggers: volonté (vouloir que), émotion (avoir peur que), nécessité (il faut que), doute (douter que), and conjunctions like “bien que”.',
        audioText: 'Il faut que tu viennes. Bien que je sois fatigué, je continue.',
      },
      {
        type: 'grammar',
        title: 'Conjugation Patterns',
        content: `Start with the “ils” form, drop -ent, add endings: -e, -es, -e, -ions, -iez, -ent.
Parler → qu’ils parlent → que je parle
Finir → qu’ils finissent → que nous finissions
Irregular stems:
être → que je sois
avoir → que nous ayons
aller → que tu ailles
faire → qu’il fasse`,
        audioText: 'que je parle, que tu finisses, qu’il fasse, que nous allions, que vous soyez, qu’ils puissent',
        grammarPoints: [
          'Keep the double “i” in nous/vous forms: que nous étudiions',
          'Use subjunctive after “avant que”, “pour que”, “à condition que”',
          'Some expressions always take subjunctive even without “que”: “Vive la liberté !”',
        ],
      },
      {
        type: 'dialogue',
        title: 'Team Retrospective',
        content: `Chef: Il faut que chacun propose une idée.
Dev: Bien que je sois nouveau, je voudrais essayer.
Chef: Je suis contente que tu aies cette motivation.
UX: Je doute que les utilisateurs comprennent cette version sans tutoriel.
Chef: D’accord, à condition que l’équipe écrive le tutoriel cette semaine.`,
        audioText: 'Il faut que chacun propose une idée. Bien que je sois nouveau, je voudrais essayer. Je suis contente que tu aies cette motivation. Je doute que les utilisateurs comprennent cette version sans tutoriel.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Choose the correct form: Il faut que nous _____ (faire) vite.',
        options: ['faisons', 'faisions', 'fassions', 'ferions'],
        correctAnswer: 'fassions',
        explanation: '“Faire” becomes “fass-” in the subjunctive; nous = fassions.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Bien que tu _____ (être) fatigué, viens avec nous.',
        correctAnswer: 'sois',
        explanation: '“Bien que” requires subjunctive; “être” → “sois” for “tu”.',
      },
      {
        type: 'translation',
        question: 'Translate: "She is afraid that we may be late."',
        correctAnswer: 'Elle a peur que nous soyons en retard',
        explanation: '“Avoir peur que” triggers subjunctive: “soyons”.',
      },
      {
        type: 'multiple-choice',
        question: 'Which sentence does NOT require the subjunctive?',
        options: [
          'Je pense qu’il vient.',
          'Je veux qu’il vienne.',
          'Il est nécessaire qu’il vienne.',
          'Je doute qu’il vienne.',
        ],
        correctAnswer: 'Je pense qu’il vient.',
        explanation: '“Je pense que” uses indicative unless negated.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Formal Emails & Reports',
    slug: 'french-formal-emails',
    description: 'Master the register for corporate emails, cover letters, and official updates in French.',
    topic: 'Professional',
    language: 'french',
    level: 'advanced',
    duration: 24,
    order: 2,
    objectives: [
      'Apply formal salutations and closings correctly',
      'Structure messages with logical connectors',
      'Use passive voice and nominalizations to sound objective',
      'Request actions and share files politely',
    ],
    contents: [
      {
        type: 'text',
        title: 'Email Template',
        content: `Subject line: clair et précis.
Opening: Madame, Monsieur,
Body: Je me permets de..., Suite à notre échange...
Closing: Je vous prie d’agréer, Madame, Monsieur, l’expression de..., Bien cordialement.`,
        audioText: 'Madame, Monsieur, Je me permets de vous contacter au sujet de... Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
      },
      {
        type: 'grammar',
        title: 'Passive & Nominal Style',
        content: `Passive keeps tone neutral: "Le dossier a été transmis".
Nominalizations replace verbs: "la mise à jour", "la mise en place".
Connector bank: toutefois, par conséquent, en pièce jointe.`,
        audioText: 'Le rapport a été validé. Toutefois, la mise en place du projet reste à confirmer. Veuillez trouver en pièce jointe la version finale.',
        grammarPoints: [
          'Avoid “tu” or emoticons in professional contexts',
          'Use “veuillez + infinitif” for polite commands',
          'Spell out dates: “le 15 novembre 2025”',
        ],
      },
      {
        type: 'dialogue',
        title: 'Email Excerpt',
        content: `Objet: Mise à jour du projet Orion
Madame, Monsieur,
Suite à notre réunion du 12 avril, je me permets de partager la synthèse ci-jointe. Le budget a été validé par la direction. Toutefois, la phase de test devra être prolongée d’une semaine.
Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.`,
        audioText: 'Objet: Mise à jour du projet Orion... Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which closing is appropriately formal?',
        options: ['Bisous', 'À plus', 'Je vous prie d’agréer...', 'Merci !'],
        correctAnswer: 'Je vous prie d’agréer...',
        explanation: 'Standard high-register closing formula.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Veuillez _____ en pièce jointe.',
        correctAnswer: 'trouver',
        explanation: '“Veuillez + infinitive” stays in infinitive.',
      },
      {
        type: 'translation',
        question: 'Translate: “The file was sent yesterday.”',
        correctAnswer: 'Le fichier a été envoyé hier',
        explanation: 'Passive “a été envoyé” indicates completed action.',
      },
      {
        type: 'multiple-choice',
        question: 'What does “en pièce jointe” mean?',
        options: ['face-to-face', 'attached', 'in progress', 'urgent'],
        correctAnswer: 'attached',
        explanation: 'Literally “in attached document”.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Debates & Negotiations',
    slug: 'french-debates-negotiations',
    description: 'Formulate nuanced arguments, counterpoints, and concessions in advanced French.',
    topic: 'Professional',
    language: 'french',
    level: 'advanced',
    duration: 26,
    order: 3,
    objectives: [
      'Use high-level connectors for contrast and nuance',
      'Express probability and concession with subjonctif',
      'Negotiate conditions using “à condition que” and “sinon”',
      'Close discussions with clear action items',
    ],
    contents: [
      {
        type: 'text',
        title: 'Argument Framework',
        content: 'Open with “Selon moi” or “D’après les données”. Counter with “Certes…, mais…”. Offer solutions using “Je propose que”.',
        audioText: 'Selon moi, il faudrait prioriser la sécurité. Certes, cela coûte plus cher, mais les bénéfices sont clairs.',
      },
      {
        type: 'grammar',
        title: 'Conditional Clauses',
        content: `États hypothétiques:
Si + imparfait → conditionnel (Si nous réduisions les coûts, nous gagnerions des parts de marché.)
À condition que + subjonctif.
Sin on / autrement = otherwise.`,
        audioText: 'Si nous réduisions les coûts, nous gagnerions des parts de marché. À condition que chacun respecte le calendrier, nous réussirons.',
        grammarPoints: [
          'Pair “bien que” with subjonctif to concede points',
          '“Il est indispensable que” elevates urgency',
          'Use “quitte à” to express calculated risk',
        ],
      },
      {
        type: 'dialogue',
        title: 'Boardroom Exchange',
        content: `Directeur: Selon moi, il faut repousser le lancement.
Marketing: Certes, les tests ne sont pas terminés, mais nous risquons de perdre des clients.
Directeur: À condition que l’équipe garantisse la qualité, nous pouvons maintenir la date.
Finance: Sinon, il faudra prévoir un budget supplémentaire.`,
        audioText: 'Selon moi, il faut repousser le lancement. Certes, les tests ne sont pas terminés, mais... À condition que l’équipe garantisse la qualité, nous pouvons maintenir la date.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which connector introduces a concession?',
        options: ['Certes', 'Donc', 'Parce que', 'Afin de'],
        correctAnswer: 'Certes',
        explanation: 'Often followed by “mais” to present a counter-argument.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Si nous _____ (avoir) plus de temps, nous préparerions un prototype.',
        correctAnswer: 'avions',
        explanation: 'Use imparfait after “si” in hypothetical statements.',
      },
      {
        type: 'translation',
        question: 'Translate: “We can proceed provided that everyone agrees.”',
        correctAnswer: 'Nous pouvons avancer à condition que tout le monde soit d’accord',
        explanation: '“À condition que” triggers the subjonctif “soit”.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you express “otherwise”?',
        options: ['Pourtant', 'Cependant', 'Sinon', 'Car'],
        correctAnswer: 'Sinon',
        explanation: '“Sinon” sets up consequences if conditions aren’t met.',
      },
    ],
    isActive: true,
  },
];

const allLessons = [...spanishLessons, ...hindiLessons, ...frenchLessons];

export const seedLessons = async (): Promise<void> => {
  try {
    const operations = allLessons.map((lesson) => ({
      updateOne: {
        filter: { slug: lesson.slug },
        update: { $setOnInsert: lesson },
        upsert: true,
      },
    }));

    const result = await Lesson.bulkWrite(operations, { ordered: false });
    const inserted = result.upsertedCount || 0;
    console.log(`✅ Seeded ${inserted} new lessons (defined total: ${allLessons.length})`);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    throw error;
  }
};

export default seedLessons;
