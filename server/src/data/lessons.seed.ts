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

// MANDARIN CHINESE LESSONS
const mandarinLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'mandarin-basic-greetings-introductions',
    description: 'Learn how to greet people in Mandarin Chinese and introduce yourself. This lesson covers common phrases like "你好", "早上好", and "很高兴认识你".',
    topic: 'Speaking & Listening',
    language: 'mandarin',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Mandarin tones',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Mandarin Greetings',
        content: 'Mandarin Chinese uses four main tones, which are essential for proper pronunciation. Greetings are relatively simple but require attention to tones. In this lesson, you\'ll learn the most common ways to greet people and introduce yourself.',
        audioText: 'Mandarin Chinese uses four main tones. Greetings are relatively simple but require attention to tones.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: '你好。早上好。下午好。晚上好。',
        vocabulary: [
          {
            word: '你好',
            translation: 'Hello',
            pronunciation: 'nǐ hǎo',
            example: '你好！你叫什么名字？',
            exampleTranslation: 'Hello! What is your name?',
          },
          {
            word: '早上好',
            translation: 'Good morning',
            pronunciation: 'zǎo shang hǎo',
            example: '早上好，王先生。',
            exampleTranslation: 'Good morning, Mr. Wang.',
          },
          {
            word: '下午好',
            translation: 'Good afternoon',
            pronunciation: 'xià wǔ hǎo',
            example: '下午好，你今天怎么样？',
            exampleTranslation: 'Good afternoon, how are you today?',
          },
          {
            word: '晚上好',
            translation: 'Good evening',
            pronunciation: 'wǎn shang hǎo',
            example: '晚上好，晚安。',
            exampleTranslation: 'Good evening, good night.',
          },
          {
            word: '很高兴认识你',
            translation: 'Nice to meet you',
            pronunciation: 'hěn gāo xìng rèn shi nǐ',
            example: '很高兴认识你，我叫李明。',
            exampleTranslation: 'Nice to meet you, my name is Li Ming.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `小王：你好！
小李：你好！你叫什么名字？
小王：我叫小王。你呢？
小李：我叫小李。很高兴认识你。
小王：很高兴认识你。你是哪里人？
小李：我是北京人。你呢？
小王：我是上海人。`,
        audioText: '你好！你好！你叫什么名字？我叫小王。你呢？我叫小李。很高兴认识你。很高兴认识你。你是哪里人？我是北京人。你呢？我是上海人。',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Mandarin?',
        options: ['晚上好', '早上好', '下午好', '你好'],
        correctAnswer: '早上好',
        explanation: '"早上好" (zǎo shang hǎo) is used in the morning.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "很高兴认识你" mean?',
        options: ['Goodbye', 'Thank you', 'Nice to meet you', 'How are you?'],
        correctAnswer: 'Nice to meet you',
        explanation: '"很高兴认识你" literally means "very happy to know you" and is used when meeting someone.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: 我 _____ 小王。(My name is Xiao Wang)',
        correctAnswer: '叫',
        explanation: '"叫" (jiào) means "to be called" and is used to introduce your name.',
      },
      {
        type: 'translation',
        question: 'Translate: "Hello, how are you?"',
        correctAnswer: '你好，你好吗',
        explanation: '"你好吗" (nǐ hǎo ma) is the common way to ask "how are you?"',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'mandarin-numbers-1-100',
    description: 'Master Mandarin numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Mandarin.',
    topic: 'Vocabulary',
    language: 'mandarin',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Mandarin',
      'Use numbers in practical contexts like prices',
      'Give and understand phone numbers',
      'Understand the logical pattern of Mandarin numbers',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Mandarin Numbers',
        content: 'Mandarin numbers are very logical and easy to learn. Once you know 1-10, you can easily form all numbers up to 99. For example, 11 is "ten-one" (十一), 21 is "two-ten-one" (二十一).',
        audioText: 'Mandarin numbers are very logical. Once you know one to ten, you can easily form all numbers up to ninety-nine.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'Learn the basic numbers:',
        audioText: '一、二、三、四、五、六、七、八、九、十。',
        vocabulary: [
          { word: '一', translation: 'One (1)', pronunciation: 'yī', example: '一个苹果', exampleTranslation: 'One apple' },
          { word: '二', translation: 'Two (2)', pronunciation: 'èr', example: '两个人', exampleTranslation: 'Two people' },
          { word: '三', translation: 'Three (3)', pronunciation: 'sān', example: '三本书', exampleTranslation: 'Three books' },
          { word: '四', translation: 'Four (4)', pronunciation: 'sì', example: '四块钱', exampleTranslation: 'Four yuan' },
          { word: '五', translation: 'Five (5)', pronunciation: 'wǔ', example: '五分钟', exampleTranslation: 'Five minutes' },
          { word: '六', translation: 'Six (6)', pronunciation: 'liù', example: '六点钟', exampleTranslation: 'Six o\'clock' },
          { word: '七', translation: 'Seven (7)', pronunciation: 'qī', example: '七天', exampleTranslation: 'Seven days' },
          { word: '八', translation: 'Eight (8)', pronunciation: 'bā', example: '八月', exampleTranslation: 'August' },
          { word: '九', translation: 'Nine (9)', pronunciation: 'jiǔ', example: '九十', exampleTranslation: 'Ninety' },
          { word: '十', translation: 'Ten (10)', pronunciation: 'shí', example: '十块钱', exampleTranslation: 'Ten yuan' },
        ],
      },
      {
        type: 'grammar',
        title: 'Forming Larger Numbers',
        content: `Number patterns in Mandarin:
11-19: 十 + digit (十一 = 11, 十五 = 15)
20-90: digit + 十 (二十 = 20, 五十 = 50)
21-99: digit + 十 + digit (二十一 = 21, 九十九 = 99)
100: 一百 (yī bǎi)`,
        audioText: 'Eleven is 十一, twenty is 二十, twenty-one is 二十一, one hundred is 一百.',
        grammarPoints: [
          '十 (shí) means ten and is the base for teens',
          'Numbers follow a logical decimal pattern',
          '两 (liǎng) is often used instead of 二 before measure words',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Mandarin?',
        options: ['五十', '十五', '一五', '五一'],
        correctAnswer: '十五',
        explanation: '"十五" (shí wǔ) means fifteen (ten + five).',
      },
      {
        type: 'fill-blank',
        question: 'Complete: 二十_____ = 25',
        correctAnswer: '五',
        explanation: '二十五 means twenty-five (twenty + five).',
      },
      {
        type: 'translation',
        question: 'Translate: "Forty-two"',
        correctAnswer: '四十二',
        explanation: '"四十二" is four-ten-two, which equals 42.',
      },
      {
        type: 'multiple-choice',
        question: 'How do you say "88" in Mandarin?',
        options: ['八八', '八十八', '十八八', '八百八'],
        correctAnswer: '八十八',
        explanation: '"八十八" (bā shí bā) = eighty-eight.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSON
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'mandarin-ordering-food',
    description: 'Learn essential phrases for ordering food, asking about ingredients, and making special requests at Chinese restaurants.',
    topic: 'Practical Situations',
    language: 'mandarin',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Order food and drinks confidently',
      'Ask about ingredients and cooking methods',
      'Make special dietary requests',
      'Handle payment and tipping customs',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining:',
        audioText: '菜单、服务员、点菜、结账、好吃。',
        vocabulary: [
          { word: '菜单', translation: 'Menu', pronunciation: 'cài dān', example: '请给我菜单。', exampleTranslation: 'Please give me the menu.' },
          { word: '服务员', translation: 'Waiter/Waitress', pronunciation: 'fú wù yuán', example: '服务员！', exampleTranslation: 'Waiter!' },
          { word: '点菜', translation: 'To order food', pronunciation: 'diǎn cài', example: '我们要点菜。', exampleTranslation: 'We want to order.' },
          { word: '结账', translation: 'To pay the bill', pronunciation: 'jié zhàng', example: '请结账。', exampleTranslation: 'The bill, please.' },
          { word: '好吃', translation: 'Delicious', pronunciation: 'hǎo chī', example: '这个菜很好吃！', exampleTranslation: 'This dish is delicious!' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `服务员：欢迎光临！请问几位？
顾客：两位。
服务员：请这边坐。这是菜单。
顾客：谢谢。我们想点一个宫保鸡丁和一碗米饭。
服务员：好的。要喝什么？
顾客：两杯茶，谢谢。
服务员：好的，请稍等。`,
        audioText: '欢迎光临！请问几位？两位。请这边坐。这是菜单。谢谢。我们想点一个宫保鸡丁和一碗米饭。好的。要喝什么？两杯茶，谢谢。',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Mandarin?',
        options: ['请结账', '请点菜', '请给我菜单', '请稍等'],
        correctAnswer: '请结账',
        explanation: '"请结账" (qǐng jié zhàng) means "please bring the bill".',
      },
      {
        type: 'translation',
        question: 'Translate: "This dish is delicious!"',
        correctAnswer: '这个菜很好吃',
        explanation: '"这个菜很好吃" uses "好吃" (hǎo chī) meaning delicious.',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSON
  {
    title: 'Business Communication',
    slug: 'mandarin-business-communication',
    description: 'Master professional Mandarin for business meetings, negotiations, and formal correspondence.',
    topic: 'Professional',
    language: 'mandarin',
    level: 'advanced',
    duration: 25,
    order: 4,
    objectives: [
      'Conduct business introductions formally',
      'Participate in meetings and negotiations',
      'Use appropriate honorifics and formal language',
      'Write professional emails in Mandarin',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential business terms:',
        audioText: '公司、会议、合作、项目、合同。',
        vocabulary: [
          { word: '公司', translation: 'Company', pronunciation: 'gōng sī', example: '我们公司在上海。', exampleTranslation: 'Our company is in Shanghai.' },
          { word: '会议', translation: 'Meeting', pronunciation: 'huì yì', example: '我们下午有个会议。', exampleTranslation: 'We have a meeting this afternoon.' },
          { word: '合作', translation: 'Cooperation', pronunciation: 'hé zuò', example: '期待与您合作。', exampleTranslation: 'Looking forward to working with you.' },
          { word: '项目', translation: 'Project', pronunciation: 'xiàng mù', example: '这个项目很重要。', exampleTranslation: 'This project is very important.' },
          { word: '合同', translation: 'Contract', pronunciation: 'hé tong', example: '请签这份合同。', exampleTranslation: 'Please sign this contract.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Formal Language Patterns',
        content: `Formal expressions for business:
请问... (May I ask...)
贵公司 (Your esteemed company)
敝公司 (Our humble company)
请多关照 (Please take care of me)`,
        audioText: '请问贵公司的名称是什么？敝公司想与您合作。请多关照。',
        grammarPoints: [
          'Use 请 (qǐng) to make polite requests',
          '贵 (guì) is an honorific prefix meaning "esteemed"',
          '敝 (bì) is a humble prefix for self-reference',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Which is the formal way to refer to someone else\'s company?',
        options: ['我公司', '贵公司', '敝公司', '你公司'],
        correctAnswer: '贵公司',
        explanation: '"贵公司" (guì gōng sī) is the respectful term for "your company".',
      },
      {
        type: 'translation',
        question: 'Translate: "Looking forward to working with you."',
        correctAnswer: '期待与您合作',
        explanation: '"期待与您合作" uses formal language appropriate for business.',
      },
    ],
    isActive: true,
  },
];

// ARABIC LESSONS
const arabicLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'arabic-basic-greetings-introductions',
    description: 'Learn how to greet people in Arabic and introduce yourself. This lesson covers common phrases like "مرحبا", "صباح الخير", and "تشرفنا".',
    topic: 'Speaking & Listening',
    language: 'arabic',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Arabic script',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Arabic Greetings',
        content: 'Arabic is written from right to left and has a beautiful script. Greetings are very important in Arab culture and often include references to God. In this lesson, you\'ll learn the most common ways to greet people and introduce yourself.',
        audioText: 'Arabic is written from right to left. Greetings are very important in Arab culture.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: 'مرحبا. السلام عليكم. صباح الخير. مساء الخير.',
        vocabulary: [
          {
            word: 'مرحبا',
            translation: 'Hello',
            pronunciation: 'marhaba',
            example: 'مرحبا! كيف حالك؟',
            exampleTranslation: 'Hello! How are you?',
          },
          {
            word: 'السلام عليكم',
            translation: 'Peace be upon you (formal hello)',
            pronunciation: 'as-salamu alaykum',
            example: 'السلام عليكم ورحمة الله',
            exampleTranslation: 'Peace be upon you and God\'s mercy.',
          },
          {
            word: 'صباح الخير',
            translation: 'Good morning',
            pronunciation: 'sabah al-khayr',
            example: 'صباح الخير، كيف حالك اليوم؟',
            exampleTranslation: 'Good morning, how are you today?',
          },
          {
            word: 'مساء الخير',
            translation: 'Good evening',
            pronunciation: 'masa\' al-khayr',
            example: 'مساء الخير، أهلا وسهلا',
            exampleTranslation: 'Good evening, welcome.',
          },
          {
            word: 'تشرفنا',
            translation: 'Nice to meet you',
            pronunciation: 'tasharrafna',
            example: 'تشرفنا، اسمي أحمد',
            exampleTranslation: 'Nice to meet you, my name is Ahmed.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `أحمد: السلام عليكم!
فاطمة: وعليكم السلام! كيف حالك؟
أحمد: بخير، الحمد لله. وأنتِ؟
فاطمة: بخير، شكرا. ما اسمك؟
أحمد: اسمي أحمد. وأنتِ؟
فاطمة: اسمي فاطمة. تشرفنا.
أحمد: تشرفنا. من أين أنتِ؟
فاطمة: أنا من مصر.`,
        audioText: 'السلام عليكم! وعليكم السلام! كيف حالك؟ بخير الحمد لله. وأنتِ؟ بخير شكرا. ما اسمك؟ اسمي أحمد. وأنتِ؟ اسمي فاطمة. تشرفنا.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Arabic?',
        options: ['مساء الخير', 'صباح الخير', 'مرحبا', 'السلام عليكم'],
        correctAnswer: 'صباح الخير',
        explanation: '"صباح الخير" (sabah al-khayr) means "morning of goodness".',
      },
      {
        type: 'multiple-choice',
        question: 'What is the proper response to "السلام عليكم"?',
        options: ['مرحبا', 'شكرا', 'وعليكم السلام', 'تشرفنا'],
        correctAnswer: 'وعليكم السلام',
        explanation: '"وعليكم السلام" means "and upon you peace" - the traditional response.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: اسمي _____. (My name is Ahmed)',
        correctAnswer: 'أحمد',
        explanation: 'The structure is "اسمي" (my name is) + name.',
      },
      {
        type: 'translation',
        question: 'Translate: "Nice to meet you"',
        correctAnswer: 'تشرفنا',
        explanation: '"تشرفنا" literally means "we are honored".',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'arabic-numbers-1-100',
    description: 'Master Arabic numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Arabic.',
    topic: 'Vocabulary',
    language: 'arabic',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Arabic',
      'Use numbers in practical contexts like prices',
      'Give and understand phone numbers',
      'Recognize Arabic numerals (٠١٢٣٤٥٦٧٨٩)',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Arabic Numbers',
        content: 'Arabic has its own numeral system (٠١٢٣٤٥٦٧٨٩), but Western numerals are also commonly used. The spoken numbers are essential for shopping, telling time, and everyday life.',
        audioText: 'Arabic has its own numeral system. The spoken numbers are essential for everyday life.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'Learn the basic numbers:',
        audioText: 'واحد، اثنان، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة.',
        vocabulary: [
          { word: 'واحد', translation: 'One (1)', pronunciation: 'wahid', example: 'كتاب واحد', exampleTranslation: 'One book' },
          { word: 'اثنان', translation: 'Two (2)', pronunciation: 'ithnan', example: 'شخصان', exampleTranslation: 'Two people' },
          { word: 'ثلاثة', translation: 'Three (3)', pronunciation: 'thalatha', example: 'ثلاثة أيام', exampleTranslation: 'Three days' },
          { word: 'أربعة', translation: 'Four (4)', pronunciation: 'arba\'a', example: 'أربعة دراهم', exampleTranslation: 'Four dirhams' },
          { word: 'خمسة', translation: 'Five (5)', pronunciation: 'khamsa', example: 'خمس دقائق', exampleTranslation: 'Five minutes' },
          { word: 'ستة', translation: 'Six (6)', pronunciation: 'sitta', example: 'الساعة ستة', exampleTranslation: 'Six o\'clock' },
          { word: 'سبعة', translation: 'Seven (7)', pronunciation: 'sab\'a', example: 'سبعة أيام', exampleTranslation: 'Seven days' },
          { word: 'ثمانية', translation: 'Eight (8)', pronunciation: 'thamaniya', example: 'ثمانية أشهر', exampleTranslation: 'Eight months' },
          { word: 'تسعة', translation: 'Nine (9)', pronunciation: 'tis\'a', example: 'تسعون', exampleTranslation: 'Ninety' },
          { word: 'عشرة', translation: 'Ten (10)', pronunciation: '\'ashara', example: 'عشرة دراهم', exampleTranslation: 'Ten dirhams' },
        ],
      },
      {
        type: 'grammar',
        title: 'Forming Larger Numbers',
        content: `Number patterns in Arabic:
11-19: Special forms (أحد عشر = 11, اثنا عشر = 12)
20-90: عشرون، ثلاثون، أربعون... (20, 30, 40...)
21-99: ones + و + tens (واحد وعشرون = 21)
100: مئة (mi'a)`,
        audioText: 'أحد عشر، عشرون، واحد وعشرون، مئة',
        grammarPoints: [
          'Numbers 11-19 have special combined forms',
          'Tens use the suffix ون (-oon)',
          'Compound numbers use و (and) between parts',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Arabic?',
        options: ['خمسة عشر', 'عشرة وخمسة', 'خمسون', 'خمسة'],
        correctAnswer: 'خمسة عشر',
        explanation: '"خمسة عشر" (khamsat \'ashar) is fifteen.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: واحد و_____ = 21 (one and twenty)',
        correctAnswer: 'عشرون',
        explanation: 'واحد وعشرون means twenty-one (one and twenty).',
      },
      {
        type: 'translation',
        question: 'Translate: "Fifty"',
        correctAnswer: 'خمسون',
        explanation: '"خمسون" (khamsoon) is fifty.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSON
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'arabic-ordering-food',
    description: 'Learn essential phrases for ordering food, asking about ingredients, and making special requests at Arabic restaurants.',
    topic: 'Practical Situations',
    language: 'arabic',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Order food and drinks confidently',
      'Ask about ingredients and cooking methods',
      'Make special dietary requests (halal)',
      'Handle payment customs',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining:',
        audioText: 'قائمة الطعام، نادل، طلب، الحساب، لذيذ.',
        vocabulary: [
          { word: 'قائمة الطعام', translation: 'Menu', pronunciation: 'qa\'imat al-ta\'am', example: 'أريد قائمة الطعام من فضلك.', exampleTranslation: 'I want the menu, please.' },
          { word: 'نادل', translation: 'Waiter', pronunciation: 'nadil', example: '!يا نادل', exampleTranslation: 'Waiter!' },
          { word: 'أريد أن أطلب', translation: 'I want to order', pronunciation: 'ureed an atlub', example: 'أريد أن أطلب الطعام.', exampleTranslation: 'I want to order food.' },
          { word: 'الحساب', translation: 'The bill', pronunciation: 'al-hisab', example: 'الحساب من فضلك.', exampleTranslation: 'The bill, please.' },
          { word: 'لذيذ', translation: 'Delicious', pronunciation: 'ladheedh', example: 'هذا الطعام لذيذ جدا!', exampleTranslation: 'This food is very delicious!' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `نادل: أهلا وسهلا! كم شخص؟
زبون: شخصان.
نادل: تفضلوا، هذه قائمة الطعام.
زبون: شكرا. أريد كباب ورز.
نادل: وللشرب؟
زبون: عصير برتقال، من فضلك.
نادل: حاضر، لحظة.`,
        audioText: 'أهلا وسهلا! كم شخص؟ شخصان. تفضلوا، هذه قائمة الطعام. شكرا. أريد كباب ورز. وللشرب؟ عصير برتقال من فضلك.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Arabic?',
        options: ['الحساب من فضلك', 'قائمة الطعام', 'أريد أن أطلب', 'شكرا'],
        correctAnswer: 'الحساب من فضلك',
        explanation: '"الحساب من فضلك" means "the bill, please".',
      },
      {
        type: 'translation',
        question: 'Translate: "This food is delicious!"',
        correctAnswer: 'هذا الطعام لذيذ',
        explanation: '"لذيذ" (ladheedh) means delicious.',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSON
  {
    title: 'Business Communication',
    slug: 'arabic-business-communication',
    description: 'Master professional Arabic for business meetings, negotiations, and formal correspondence.',
    topic: 'Professional',
    language: 'arabic',
    level: 'advanced',
    duration: 25,
    order: 4,
    objectives: [
      'Conduct business introductions formally',
      'Participate in meetings and negotiations',
      'Use appropriate formal language',
      'Write professional emails in Arabic',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential business terms:',
        audioText: 'شركة، اجتماع، تعاون، مشروع، عقد.',
        vocabulary: [
          { word: 'شركة', translation: 'Company', pronunciation: 'sharika', example: 'شركتنا في دبي.', exampleTranslation: 'Our company is in Dubai.' },
          { word: 'اجتماع', translation: 'Meeting', pronunciation: 'ijtima\'', example: 'لدينا اجتماع غدا.', exampleTranslation: 'We have a meeting tomorrow.' },
          { word: 'تعاون', translation: 'Cooperation', pronunciation: 'ta\'awun', example: 'نتطلع إلى التعاون معكم.', exampleTranslation: 'We look forward to cooperating with you.' },
          { word: 'مشروع', translation: 'Project', pronunciation: 'mashru\'', example: 'هذا المشروع مهم جدا.', exampleTranslation: 'This project is very important.' },
          { word: 'عقد', translation: 'Contract', pronunciation: '\'aqd', example: 'يرجى توقيع العقد.', exampleTranslation: 'Please sign the contract.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Formal Language Patterns',
        content: `Formal expressions for business:
سعادة/معالي (Honorific titles)
يسعدني أن... (I am pleased to...)
نتطلع إلى... (We look forward to...)
مع فائق الاحترام (With highest respect)`,
        audioText: 'يسعدني أن أقدم شركتنا. نتطلع إلى التعاون معكم.',
        grammarPoints: [
          'Use formal titles like سعادة (sa\'ada) for officials',
          'Start emails with "تحية طيبة" (warm greetings)',
          'End with "مع فائق الاحترام" (with highest respect)',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "We look forward to cooperating" in formal Arabic?',
        options: ['أريد التعاون', 'نتطلع إلى التعاون', 'التعاون جيد', 'سوف نتعاون'],
        correctAnswer: 'نتطلع إلى التعاون',
        explanation: '"نتطلع إلى التعاون" is the formal expression for "we look forward to cooperation".',
      },
      {
        type: 'translation',
        question: 'Translate: "Please sign the contract."',
        correctAnswer: 'يرجى توقيع العقد',
        explanation: '"يرجى" (yurja) is the formal "please" used in written Arabic.',
      },
    ],
    isActive: true,
  },
];

// BENGALI LESSONS
const bengaliLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'bengali-basic-greetings-introductions',
    description: 'Learn how to greet people in Bengali and introduce yourself. This lesson covers common phrases like "নমস্কার", "শুভ সকাল", and "আপনার সাথে পরিচিত হয়ে খুশি হলাম".',
    topic: 'Speaking & Listening',
    language: 'bengali',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Bengali script',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Bengali Greetings',
        content: 'Bengali (Bangla) is spoken by over 230 million people in Bangladesh and West Bengal, India. It has a beautiful script and rich literary tradition. Greetings vary based on formality and the relationship between speakers.',
        audioText: 'Bengali is spoken by over 230 million people. Greetings vary based on formality.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: 'নমস্কার। শুভ সকাল। শুভ বিকাল। শুভ সন্ধ্যা।',
        vocabulary: [
          {
            word: 'নমস্কার',
            translation: 'Hello (formal)',
            pronunciation: 'nomoshkar',
            example: 'নমস্কার! কেমন আছেন?',
            exampleTranslation: 'Hello! How are you?',
          },
          {
            word: 'শুভ সকাল',
            translation: 'Good morning',
            pronunciation: 'shubho shokal',
            example: 'শুভ সকাল, দাদা।',
            exampleTranslation: 'Good morning, brother.',
          },
          {
            word: 'শুভ বিকাল',
            translation: 'Good afternoon',
            pronunciation: 'shubho bikal',
            example: 'শুভ বিকাল, আপনি কেমন আছেন?',
            exampleTranslation: 'Good afternoon, how are you?',
          },
          {
            word: 'শুভ সন্ধ্যা',
            translation: 'Good evening',
            pronunciation: 'shubho shondhya',
            example: 'শুভ সন্ধ্যা, আসুন।',
            exampleTranslation: 'Good evening, please come.',
          },
          {
            word: 'আপনার সাথে পরিচিত হয়ে খুশি হলাম',
            translation: 'Nice to meet you',
            pronunciation: 'apnar shathe porichito hoye khushi holam',
            example: 'আমার নাম রাহুল। আপনার সাথে পরিচিত হয়ে খুশি হলাম।',
            exampleTranslation: 'My name is Rahul. Nice to meet you.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `রাহুল: নমস্কার!
প্রিয়া: নমস্কার! কেমন আছেন?
রাহুল: ভালো আছি, ধন্যবাদ। আপনি?
প্রিয়া: আমিও ভালো আছি। আপনার নাম কী?
রাহুল: আমার নাম রাহুল। আপনার নাম কী?
প্রিয়া: আমার নাম প্রিয়া। আপনার সাথে পরিচিত হয়ে খুশি হলাম।
রাহুল: আমিও খুশি হলাম।`,
        audioText: 'নমস্কার! নমস্কার! কেমন আছেন? ভালো আছি, ধন্যবাদ। আপনি? আমিও ভালো আছি। আপনার নাম কী? আমার নাম রাহুল।',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Bengali?',
        options: ['শুভ সন্ধ্যা', 'শুভ সকাল', 'শুভ বিকাল', 'নমস্কার'],
        correctAnswer: 'শুভ সকাল',
        explanation: '"শুভ সকাল" (shubho shokal) means "auspicious morning".',
      },
      {
        type: 'multiple-choice',
        question: 'What does "কেমন আছেন" mean?',
        options: ['Goodbye', 'Thank you', 'How are you?', 'Nice to meet you'],
        correctAnswer: 'How are you?',
        explanation: '"কেমন আছেন" (kemon achhen) is the formal way to ask "how are you?"',
      },
      {
        type: 'fill-blank',
        question: 'Complete: আমার নাম _____। (My name is Priya)',
        correctAnswer: 'প্রিয়া',
        explanation: 'The structure is "আমার নাম" (my name is) + name.',
      },
      {
        type: 'translation',
        question: 'Translate: "I am fine, thank you"',
        correctAnswer: 'ভালো আছি, ধন্যবাদ',
        explanation: '"ভালো আছি" means "I am fine" and "ধন্যবাদ" means "thank you".',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'bengali-numbers-1-100',
    description: 'Master Bengali numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Bengali.',
    topic: 'Vocabulary',
    language: 'bengali',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Bengali',
      'Use numbers in practical contexts like prices',
      'Give and understand phone numbers',
      'Recognize Bengali numerals (০১২৩৪৫৬৭৮৯)',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Bengali Numbers',
        content: 'Bengali has its own numeral system (০১২৩৪৫৬৭৮৯). Learning numbers is essential for shopping, telling time, and everyday conversations in Bengali-speaking regions.',
        audioText: 'Bengali has its own numeral system. Learning numbers is essential for everyday conversations.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'Learn the basic numbers:',
        audioText: 'এক, দুই, তিন, চার, পাঁচ, ছয়, সাত, আট, নয়, দশ।',
        vocabulary: [
          { word: 'এক', translation: 'One (1)', pronunciation: 'ek', example: 'একটা বই', exampleTranslation: 'One book' },
          { word: 'দুই', translation: 'Two (2)', pronunciation: 'dui', example: 'দুই জন', exampleTranslation: 'Two people' },
          { word: 'তিন', translation: 'Three (3)', pronunciation: 'tin', example: 'তিন দিন', exampleTranslation: 'Three days' },
          { word: 'চার', translation: 'Four (4)', pronunciation: 'char', example: 'চার টাকা', exampleTranslation: 'Four rupees' },
          { word: 'পাঁচ', translation: 'Five (5)', pronunciation: 'panch', example: 'পাঁচ মিনিট', exampleTranslation: 'Five minutes' },
          { word: 'ছয়', translation: 'Six (6)', pronunciation: 'chhoy', example: 'ছয়টা বাজে', exampleTranslation: 'Six o\'clock' },
          { word: 'সাত', translation: 'Seven (7)', pronunciation: 'shat', example: 'সাত দিন', exampleTranslation: 'Seven days' },
          { word: 'আট', translation: 'Eight (8)', pronunciation: 'at', example: 'আট মাস', exampleTranslation: 'Eight months' },
          { word: 'নয়', translation: 'Nine (9)', pronunciation: 'noy', example: 'নব্বই', exampleTranslation: 'Ninety' },
          { word: 'দশ', translation: 'Ten (10)', pronunciation: 'dosh', example: 'দশ টাকা', exampleTranslation: 'Ten rupees' },
        ],
      },
      {
        type: 'grammar',
        title: 'Forming Larger Numbers',
        content: `Number patterns in Bengali:
11-19: Special forms (এগারো = 11, বারো = 12, তেরো = 13...)
20-90: কুড়ি (20), তিরিশ (30), চল্লিশ (40)...
21-99: ones + tens (একুশ = 21, বাইশ = 22)
100: একশো (eksho)`,
        audioText: 'এগারো, কুড়ি, একুশ, একশো।',
        grammarPoints: [
          'Numbers 11-99 often have unique forms',
          'Twenty is কুড়ি, not দুই-দশ',
          'Compound numbers blend together smoothly',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Bengali?',
        options: ['পাঁচ-দশ', 'পনেরো', 'দশ-পাঁচ', 'পাঁচটা'],
        correctAnswer: 'পনেরো',
        explanation: '"পনেরো" (ponero) is the unique word for fifteen.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: _____টা বাজে (It\'s five o\'clock)',
        correctAnswer: 'পাঁচ',
        explanation: 'পাঁচটা বাজে means "it\'s five o\'clock".',
      },
      {
        type: 'translation',
        question: 'Translate: "Twenty-one"',
        correctAnswer: 'একুশ',
        explanation: '"একুশ" (ekush) is the Bengali word for twenty-one.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSON
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'bengali-ordering-food',
    description: 'Learn essential phrases for ordering food at Bengali restaurants, asking about dishes, and making requests.',
    topic: 'Practical Situations',
    language: 'bengali',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Order food and drinks confidently',
      'Ask about ingredients and spice levels',
      'Make special dietary requests',
      'Handle payment and tipping',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining:',
        audioText: 'মেনু, ওয়েটার, অর্ডার, বিল, সুস্বাদু।',
        vocabulary: [
          { word: 'মেনু', translation: 'Menu', pronunciation: 'menu', example: 'মেনু দেখাবেন?', exampleTranslation: 'Can you show the menu?' },
          { word: 'ওয়েটার', translation: 'Waiter', pronunciation: 'waiter', example: 'ওয়েটার!', exampleTranslation: 'Waiter!' },
          { word: 'অর্ডার করা', translation: 'To order', pronunciation: 'order kora', example: 'আমি অর্ডার করতে চাই।', exampleTranslation: 'I want to order.' },
          { word: 'বিল', translation: 'Bill', pronunciation: 'bill', example: 'বিল দিন।', exampleTranslation: 'Give me the bill.' },
          { word: 'সুস্বাদু', translation: 'Delicious', pronunciation: 'sushadu', example: 'এই খাবারটা খুব সুস্বাদু!', exampleTranslation: 'This food is very delicious!' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `ওয়েটার: নমস্কার! কতজন?
অতিথি: দুইজন।
ওয়েটার: এদিকে বসুন। এই মেনু।
অতিথি: ধন্যবাদ। একটা মাছের ঝোল আর ভাত দিন।
ওয়েটার: পানীয়?
অতিথি: দুই কাপ চা, প্লিজ।
ওয়েটার: আচ্ছা, একটু অপেক্ষা করুন।`,
        audioText: 'নমস্কার! কতজন? দুইজন। এদিকে বসুন। এই মেনু। ধন্যবাদ। একটা মাছের ঝোল আর ভাত দিন।',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Bengali?',
        options: ['বিল দিন', 'মেনু দিন', 'অর্ডার করুন', 'ধন্যবাদ'],
        correctAnswer: 'বিল দিন',
        explanation: '"বিল দিন" means "give me the bill".',
      },
      {
        type: 'translation',
        question: 'Translate: "This food is delicious!"',
        correctAnswer: 'এই খাবারটা সুস্বাদু',
        explanation: '"সুস্বাদু" (sushadu) means delicious in Bengali.',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSON
  {
    title: 'Business Communication',
    slug: 'bengali-business-communication',
    description: 'Master professional Bengali for business meetings, negotiations, and formal correspondence.',
    topic: 'Professional',
    language: 'bengali',
    level: 'advanced',
    duration: 25,
    order: 4,
    objectives: [
      'Conduct business introductions formally',
      'Participate in meetings',
      'Use appropriate formal language (সাধু ভাষা)',
      'Write professional emails in Bengali',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential business terms:',
        audioText: 'কোম্পানি, মিটিং, সহযোগিতা, প্রকল্প, চুক্তি।',
        vocabulary: [
          { word: 'কোম্পানি', translation: 'Company', pronunciation: 'company', example: 'আমাদের কোম্পানি কলকাতায়।', exampleTranslation: 'Our company is in Kolkata.' },
          { word: 'মিটিং', translation: 'Meeting', pronunciation: 'meeting', example: 'আজ বিকেলে মিটিং আছে।', exampleTranslation: 'There is a meeting this afternoon.' },
          { word: 'সহযোগিতা', translation: 'Cooperation', pronunciation: 'sohojogita', example: 'আপনার সহযোগিতার জন্য ধন্যবাদ।', exampleTranslation: 'Thank you for your cooperation.' },
          { word: 'প্রকল্প', translation: 'Project', pronunciation: 'prokolpo', example: 'এই প্রকল্পটি গুরুত্বপূর্ণ।', exampleTranslation: 'This project is important.' },
          { word: 'চুক্তি', translation: 'Contract', pronunciation: 'chukti', example: 'চুক্তিতে সই করুন।', exampleTranslation: 'Please sign the contract.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Formal Language Patterns',
        content: `Formal expressions for business:
মহাশয়/মহাশয়া (Sir/Madam)
আপনাকে জানাতে চাই... (I would like to inform you...)
সহযোগিতার জন্য অনুরোধ করছি (Requesting your cooperation)
বিনীত নিবেদন (Humble submission)`,
        audioText: 'মহাশয়, আপনাকে জানাতে চাই যে প্রকল্পটি সম্পন্ন হয়েছে।',
        grammarPoints: [
          'Use মহাশয় (mohashoy) for formal address to men',
          'আপনি (apni) is always used in formal settings',
          'End letters with "বিনীত" (humble) + your name',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is the formal way to address a man in Bengali business?',
        options: ['তুমি', 'মহাশয়', 'দাদা', 'ভাই'],
        correctAnswer: 'মহাশয়',
        explanation: '"মহাশয়" (mohashoy) is the formal/respectful term like "Sir".',
      },
      {
        type: 'translation',
        question: 'Translate: "Thank you for your cooperation."',
        correctAnswer: 'আপনার সহযোগিতার জন্য ধন্যবাদ',
        explanation: 'This is a common formal expression in Bengali business.',
      },
    ],
    isActive: true,
  },
];

// PORTUGUESE LESSONS
const portugueseLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'portuguese-basic-greetings-introductions',
    description: 'Learn how to greet people in Portuguese and introduce yourself. This lesson covers common phrases like "Olá", "Bom dia", and "Prazer em conhecê-lo".',
    topic: 'Speaking & Listening',
    language: 'portuguese',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Portuguese pronunciation',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Portuguese Greetings',
        content: 'Portuguese is spoken by over 250 million people in Portugal, Brazil, and other countries. Brazilian and European Portuguese have some differences in pronunciation and vocabulary. In this lesson, you\'ll learn the most common ways to greet people.',
        audioText: 'Portuguese is spoken by over 250 million people. Brazilian and European Portuguese have some differences.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: 'Olá. Bom dia. Boa tarde. Boa noite.',
        vocabulary: [
          {
            word: 'Olá',
            translation: 'Hello',
            pronunciation: 'oh-LAH',
            example: 'Olá! Como você está?',
            exampleTranslation: 'Hello! How are you?',
          },
          {
            word: 'Bom dia',
            translation: 'Good morning',
            pronunciation: 'bom JEE-ah',
            example: 'Bom dia, senhor Silva.',
            exampleTranslation: 'Good morning, Mr. Silva.',
          },
          {
            word: 'Boa tarde',
            translation: 'Good afternoon',
            pronunciation: 'BOH-ah TAR-jee',
            example: 'Boa tarde, como vai?',
            exampleTranslation: 'Good afternoon, how are you?',
          },
          {
            word: 'Boa noite',
            translation: 'Good evening / Good night',
            pronunciation: 'BOH-ah NOY-chee',
            example: 'Boa noite, até amanhã.',
            exampleTranslation: 'Good night, see you tomorrow.',
          },
          {
            word: 'Prazer em conhecê-lo',
            translation: 'Nice to meet you',
            pronunciation: 'prah-ZEHR em koh-nyeh-SEH-loh',
            example: 'Prazer em conhecê-lo, meu nome é Carlos.',
            exampleTranslation: 'Nice to meet you, my name is Carlos.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `Maria: Olá! Bom dia.
João: Bom dia! Como você se chama?
Maria: Eu me chamo Maria. E você?
João: Eu me chamo João. Prazer em conhecê-la.
Maria: Igualmente. De onde você é?
João: Eu sou do Brasil. E você?
Maria: Eu sou de Portugal. É um prazer.`,
        audioText: 'Olá! Bom dia. Bom dia! Como você se chama? Eu me chamo Maria. E você? Eu me chamo João. Prazer em conhecê-la.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Portuguese?',
        options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Olá'],
        correctAnswer: 'Bom dia',
        explanation: '"Bom dia" is used in the morning until around noon.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "Prazer em conhecê-lo" mean?',
        options: ['Goodbye', 'Thank you', 'Nice to meet you', 'How are you?'],
        correctAnswer: 'Nice to meet you',
        explanation: '"Prazer" means pleasure, so it\'s like saying "pleasure to meet you".',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Eu me _____ Maria. (My name is Maria)',
        correctAnswer: 'chamo',
        explanation: '"chamar" means "to call", so "Eu me chamo" means "I call myself".',
      },
      {
        type: 'translation',
        question: 'Translate: "Hello, how are you?"',
        correctAnswer: 'Olá, como você está',
        explanation: '"Como você está?" is the common way to ask "how are you?" in Brazilian Portuguese.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'portuguese-numbers-1-100',
    description: 'Master Portuguese numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Portuguese.',
    topic: 'Vocabulary',
    language: 'portuguese',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Portuguese',
      'Use numbers in practical contexts like prices',
      'Give and understand phone numbers',
      'Understand number patterns in Portuguese',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Portuguese Numbers',
        content: 'Portuguese numbers follow patterns similar to Spanish. Once you learn 1-20, the rest become easier as they follow a logical pattern of tens plus units.',
        audioText: 'Portuguese numbers follow patterns similar to Spanish. Once you learn one to twenty, the rest become easier.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'Learn the basic numbers:',
        audioText: 'Um, dois, três, quatro, cinco, seis, sete, oito, nove, dez.',
        vocabulary: [
          { word: 'Um/Uma', translation: 'One (1)', pronunciation: 'oom/OO-mah', example: 'Um livro', exampleTranslation: 'One book' },
          { word: 'Dois/Duas', translation: 'Two (2)', pronunciation: 'doysh/DOO-ahsh', example: 'Duas pessoas', exampleTranslation: 'Two people' },
          { word: 'Três', translation: 'Three (3)', pronunciation: 'trehsh', example: 'Três dias', exampleTranslation: 'Three days' },
          { word: 'Quatro', translation: 'Four (4)', pronunciation: 'KWAH-troo', example: 'Quatro reais', exampleTranslation: 'Four reais' },
          { word: 'Cinco', translation: 'Five (5)', pronunciation: 'SEEN-koo', example: 'Cinco minutos', exampleTranslation: 'Five minutes' },
          { word: 'Seis', translation: 'Six (6)', pronunciation: 'saysh', example: 'Seis horas', exampleTranslation: 'Six o\'clock' },
          { word: 'Sete', translation: 'Seven (7)', pronunciation: 'SEH-chee', example: 'Sete dias', exampleTranslation: 'Seven days' },
          { word: 'Oito', translation: 'Eight (8)', pronunciation: 'OY-too', example: 'Oito meses', exampleTranslation: 'Eight months' },
          { word: 'Nove', translation: 'Nine (9)', pronunciation: 'NOH-vee', example: 'Noventa', exampleTranslation: 'Ninety' },
          { word: 'Dez', translation: 'Ten (10)', pronunciation: 'dehsh', example: 'Dez reais', exampleTranslation: 'Ten reais' },
        ],
      },
      {
        type: 'grammar',
        title: 'Forming Larger Numbers',
        content: `Number patterns in Portuguese:
11-15: Onze (11), doze (12), treze (13), catorze (14), quinze (15)
16-19: Special forms (dezesseis = 16, dezessete = 17)
20-90: Vinte (20), trinta (30), quarenta (40)...
21-99: tens + e + ones (vinte e um = 21)
100: Cem / Cento`,
        audioText: 'Onze, doze, treze, vinte, vinte e um, cem.',
        grammarPoints: [
          'Numbers 11-15 have unique forms',
          'Use "e" (and) to connect tens and ones',
          '"Cem" is 100 alone; "cento" is used in compounds (cento e um = 101)',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Portuguese?',
        options: ['Cinquenta', 'Quinze', 'Cinco', 'Cinquenta e cinco'],
        correctAnswer: 'Quinze',
        explanation: '"Quinze" is fifteen in Portuguese.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Vinte e _____ = 25',
        correctAnswer: 'cinco',
        explanation: 'Vinte e cinco means twenty-five (twenty and five).',
      },
      {
        type: 'translation',
        question: 'Translate: "Forty-two"',
        correctAnswer: 'Quarenta e dois',
        explanation: '"Quarenta e dois" = forty and two.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSON
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'portuguese-ordering-food',
    description: 'Learn essential phrases for ordering food at Brazilian and Portuguese restaurants.',
    topic: 'Practical Situations',
    language: 'portuguese',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Order food and drinks confidently',
      'Ask about ingredients and cooking methods',
      'Make special dietary requests',
      'Handle payment and tipping customs',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining:',
        audioText: 'Cardápio, garçom, pedir, conta, delicioso.',
        vocabulary: [
          { word: 'Cardápio', translation: 'Menu', pronunciation: 'kar-DAH-pyoo', example: 'O cardápio, por favor.', exampleTranslation: 'The menu, please.' },
          { word: 'Garçom', translation: 'Waiter', pronunciation: 'gar-SOM', example: 'Garçom!', exampleTranslation: 'Waiter!' },
          { word: 'Pedir', translation: 'To order', pronunciation: 'peh-JEER', example: 'Eu quero pedir.', exampleTranslation: 'I want to order.' },
          { word: 'A conta', translation: 'The bill', pronunciation: 'ah KON-tah', example: 'A conta, por favor.', exampleTranslation: 'The bill, please.' },
          { word: 'Delicioso', translation: 'Delicious', pronunciation: 'deh-lee-SYOH-zoo', example: 'Esta comida está deliciosa!', exampleTranslation: 'This food is delicious!' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `Garçom: Boa noite! Quantas pessoas?
Cliente: Duas pessoas.
Garçom: Por aqui, por favor. Aqui está o cardápio.
Cliente: Obrigado. Eu gostaria de uma feijoada e uma caipirinha.
Garçom: E para beber?
Cliente: Água com gás, por favor.
Garçom: Perfeito, um momento.`,
        audioText: 'Boa noite! Quantas pessoas? Duas pessoas. Por aqui, por favor. Aqui está o cardápio. Obrigado. Eu gostaria de uma feijoada.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Portuguese?',
        options: ['A conta, por favor', 'O cardápio', 'Eu quero pedir', 'Obrigado'],
        correctAnswer: 'A conta, por favor',
        explanation: '"A conta, por favor" means "the bill, please".',
      },
      {
        type: 'translation',
        question: 'Translate: "This food is delicious!"',
        correctAnswer: 'Esta comida está deliciosa',
        explanation: '"Deliciosa" is the feminine form matching "comida".',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSON
  {
    title: 'Business Communication',
    slug: 'portuguese-business-communication',
    description: 'Master professional Portuguese for business meetings, negotiations, and formal correspondence.',
    topic: 'Professional',
    language: 'portuguese',
    level: 'advanced',
    duration: 25,
    order: 4,
    objectives: [
      'Conduct business introductions formally',
      'Participate in meetings and negotiations',
      'Use appropriate formal language',
      'Write professional emails in Portuguese',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential business terms:',
        audioText: 'Empresa, reunião, parceria, projeto, contrato.',
        vocabulary: [
          { word: 'Empresa', translation: 'Company', pronunciation: 'em-PREH-zah', example: 'Nossa empresa fica em São Paulo.', exampleTranslation: 'Our company is in São Paulo.' },
          { word: 'Reunião', translation: 'Meeting', pronunciation: 'heh-oo-nyAUM', example: 'Temos uma reunião amanhã.', exampleTranslation: 'We have a meeting tomorrow.' },
          { word: 'Parceria', translation: 'Partnership', pronunciation: 'par-seh-REE-ah', example: 'Queremos fazer uma parceria.', exampleTranslation: 'We want to form a partnership.' },
          { word: 'Projeto', translation: 'Project', pronunciation: 'proh-JEH-too', example: 'Este projeto é muito importante.', exampleTranslation: 'This project is very important.' },
          { word: 'Contrato', translation: 'Contract', pronunciation: 'kon-TRAH-too', example: 'Por favor, assine o contrato.', exampleTranslation: 'Please sign the contract.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Formal Language Patterns',
        content: `Formal expressions for business:
Prezado(a) Senhor(a) (Dear Sir/Madam)
Tenho o prazer de... (I have the pleasure to...)
Aguardo sua resposta (I await your response)
Atenciosamente (Sincerely)`,
        audioText: 'Prezado Senhor, tenho o prazer de apresentar nossa empresa. Aguardo sua resposta. Atenciosamente.',
        grammarPoints: [
          'Use "Senhor/Senhora" for formal address',
          'Start emails with "Prezado(a)"',
          'End with "Atenciosamente" or "Cordialmente"',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you start a formal email in Portuguese?',
        options: ['Oi', 'Prezado Senhor', 'E aí', 'Olá amigo'],
        correctAnswer: 'Prezado Senhor',
        explanation: '"Prezado Senhor" is the formal way to address someone in business correspondence.',
      },
      {
        type: 'translation',
        question: 'Translate: "I await your response."',
        correctAnswer: 'Aguardo sua resposta',
        explanation: 'This is a common formal closing phrase in Portuguese business emails.',
      },
    ],
    isActive: true,
  },
];

// RUSSIAN LESSONS
const russianLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'russian-basic-greetings-introductions',
    description: 'Learn how to greet people in Russian and introduce yourself. This lesson covers common phrases like "Привет", "Доброе утро", and "Очень приятно".',
    topic: 'Speaking & Listening',
    language: 'russian',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Cyrillic alphabet',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Russian Greetings',
        content: 'Russian uses the Cyrillic alphabet, which has 33 letters. Russians distinguish between formal (вы) and informal (ты) forms of address. Greetings vary based on time of day and relationship.',
        audioText: 'Russian uses the Cyrillic alphabet. Russians distinguish between formal and informal forms of address.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: 'Привет. Доброе утро. Добрый день. Добрый вечер.',
        vocabulary: [
          {
            word: 'Привет',
            translation: 'Hi (informal)',
            pronunciation: 'pree-VYET',
            example: 'Привет! Как дела?',
            exampleTranslation: 'Hi! How are you?',
          },
          {
            word: 'Здравствуйте',
            translation: 'Hello (formal)',
            pronunciation: 'ZDRAHST-vooy-tyeh',
            example: 'Здравствуйте, господин Иванов.',
            exampleTranslation: 'Hello, Mr. Ivanov.',
          },
          {
            word: 'Доброе утро',
            translation: 'Good morning',
            pronunciation: 'DOH-brah-yeh OO-trah',
            example: 'Доброе утро! Как вы себя чувствуете?',
            exampleTranslation: 'Good morning! How are you feeling?',
          },
          {
            word: 'Добрый вечер',
            translation: 'Good evening',
            pronunciation: 'DOH-bree VYE-cher',
            example: 'Добрый вечер, добро пожаловать.',
            exampleTranslation: 'Good evening, welcome.',
          },
          {
            word: 'Очень приятно',
            translation: 'Nice to meet you',
            pronunciation: 'OH-chen pree-YAT-nah',
            example: 'Очень приятно, меня зовут Анна.',
            exampleTranslation: 'Nice to meet you, my name is Anna.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `Анна: Привет!
Борис: Привет! Как тебя зовут?
Анна: Меня зовут Анна. А тебя?
Борис: Меня зовут Борис. Очень приятно.
Анна: Очень приятно. Откуда ты?
Борис: Я из Москвы. А ты?
Анна: Я из Санкт-Петербурга.`,
        audioText: 'Привет! Привет! Как тебя зовут? Меня зовут Анна. А тебя? Меня зовут Борис. Очень приятно.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" in Russian?',
        options: ['Добрый вечер', 'Доброе утро', 'Добрый день', 'Привет'],
        correctAnswer: 'Доброе утро',
        explanation: '"Доброе утро" (dobroye utro) means "good morning".',
      },
      {
        type: 'multiple-choice',
        question: 'What is the formal way to say "Hello" in Russian?',
        options: ['Привет', 'Здравствуйте', 'Пока', 'Как дела'],
        correctAnswer: 'Здравствуйте',
        explanation: '"Здравствуйте" is the formal/polite greeting.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Меня _____ Анна. (My name is Anna)',
        correctAnswer: 'зовут',
        explanation: '"Меня зовут" literally means "they call me" and is used for "my name is".',
      },
      {
        type: 'translation',
        question: 'Translate: "Nice to meet you"',
        correctAnswer: 'Очень приятно',
        explanation: '"Очень приятно" literally means "very pleasant".',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'russian-numbers-1-100',
    description: 'Master Russian numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Russian.',
    topic: 'Vocabulary',
    language: 'russian',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Russian',
      'Use numbers in practical contexts like prices',
      'Give and understand phone numbers',
      'Understand number patterns in Russian',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Russian Numbers',
        content: 'Russian numbers have different forms depending on the case and the nouns they modify. The basic forms are used for counting and telling time.',
        audioText: 'Russian numbers have different forms depending on the case. The basic forms are used for counting.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'Learn the basic numbers:',
        audioText: 'Один, два, три, четыре, пять, шесть, семь, восемь, девять, десять.',
        vocabulary: [
          { word: 'Один', translation: 'One (1)', pronunciation: 'ah-DEEN', example: 'Одна книга', exampleTranslation: 'One book' },
          { word: 'Два', translation: 'Two (2)', pronunciation: 'dvah', example: 'Два человека', exampleTranslation: 'Two people' },
          { word: 'Три', translation: 'Three (3)', pronunciation: 'tree', example: 'Три дня', exampleTranslation: 'Three days' },
          { word: 'Четыре', translation: 'Four (4)', pronunciation: 'cheh-TIH-ryeh', example: 'Четыре рубля', exampleTranslation: 'Four rubles' },
          { word: 'Пять', translation: 'Five (5)', pronunciation: 'pyaht', example: 'Пять минут', exampleTranslation: 'Five minutes' },
          { word: 'Шесть', translation: 'Six (6)', pronunciation: 'shehst', example: 'Шесть часов', exampleTranslation: 'Six o\'clock' },
          { word: 'Семь', translation: 'Seven (7)', pronunciation: 'syehm', example: 'Семь дней', exampleTranslation: 'Seven days' },
          { word: 'Восемь', translation: 'Eight (8)', pronunciation: 'VOH-syehm', example: 'Восемь месяцев', exampleTranslation: 'Eight months' },
          { word: 'Девять', translation: 'Nine (9)', pronunciation: 'DYEH-vyaht', example: 'Девяносто', exampleTranslation: 'Ninety' },
          { word: 'Десять', translation: 'Ten (10)', pronunciation: 'DYEH-syaht', example: 'Десять рублей', exampleTranslation: 'Ten rubles' },
        ],
      },
      {
        type: 'grammar',
        title: 'Forming Larger Numbers',
        content: `Number patterns in Russian:
11-19: Special forms (одиннадцать = 11, двенадцать = 12)
20-90: Двадцать (20), тридцать (30), сорок (40)...
21-99: tens + ones (двадцать один = 21)
100: Сто`,
        audioText: 'Одиннадцать, двадцать, двадцать один, сто.',
        grammarPoints: [
          'Numbers 11-19 end in "-надцать"',
          'Tens mostly end in "-дцать"',
          '40 (сорок) and 90 (девяносто) are irregular',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Russian?',
        options: ['Пятьдесят', 'Пятнадцать', 'Пять', 'Пятьсот'],
        correctAnswer: 'Пятнадцать',
        explanation: '"Пятнадцать" (pyatnadtsat) is fifteen.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: Двадцать _____ = 25',
        correctAnswer: 'пять',
        explanation: 'Двадцать пять means twenty-five.',
      },
      {
        type: 'translation',
        question: 'Translate: "Forty"',
        correctAnswer: 'Сорок',
        explanation: '"Сорок" is an irregular form for forty.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSON
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'russian-ordering-food',
    description: 'Learn essential phrases for ordering food at Russian restaurants.',
    topic: 'Practical Situations',
    language: 'russian',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Order food and drinks confidently',
      'Ask about ingredients and cooking methods',
      'Make special dietary requests',
      'Handle payment customs',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining:',
        audioText: 'Меню, официант, заказать, счёт, вкусно.',
        vocabulary: [
          { word: 'Меню', translation: 'Menu', pronunciation: 'meh-NYOO', example: 'Дайте меню, пожалуйста.', exampleTranslation: 'Give me the menu, please.' },
          { word: 'Официант', translation: 'Waiter', pronunciation: 'ah-fee-tsee-AHNT', example: 'Официант!', exampleTranslation: 'Waiter!' },
          { word: 'Заказать', translation: 'To order', pronunciation: 'zah-kah-ZAHT', example: 'Я хочу заказать.', exampleTranslation: 'I want to order.' },
          { word: 'Счёт', translation: 'Bill', pronunciation: 'shyot', example: 'Счёт, пожалуйста.', exampleTranslation: 'The bill, please.' },
          { word: 'Вкусно', translation: 'Delicious', pronunciation: 'VKOOS-nah', example: 'Это очень вкусно!', exampleTranslation: 'This is very delicious!' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `Официант: Добрый вечер! Сколько человек?
Гость: Два человека.
Официант: Проходите сюда. Вот меню.
Гость: Спасибо. Я хочу борщ и пельмени.
Официант: А пить?
Гость: Чай с лимоном, пожалуйста.
Официант: Хорошо, минутку.`,
        audioText: 'Добрый вечер! Сколько человек? Два человека. Проходите сюда. Вот меню. Спасибо. Я хочу борщ и пельмени.',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Russian?',
        options: ['Счёт, пожалуйста', 'Меню, пожалуйста', 'Я хочу заказать', 'Спасибо'],
        correctAnswer: 'Счёт, пожалуйста',
        explanation: '"Счёт, пожалуйста" means "the bill, please".',
      },
      {
        type: 'translation',
        question: 'Translate: "This is very delicious!"',
        correctAnswer: 'Это очень вкусно',
        explanation: '"Вкусно" means delicious/tasty in Russian.',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSON
  {
    title: 'Business Communication',
    slug: 'russian-business-communication',
    description: 'Master professional Russian for business meetings, negotiations, and formal correspondence.',
    topic: 'Professional',
    language: 'russian',
    level: 'advanced',
    duration: 25,
    order: 4,
    objectives: [
      'Conduct business introductions formally',
      'Participate in meetings and negotiations',
      'Use appropriate formal language',
      'Write professional emails in Russian',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential business terms:',
        audioText: 'Компания, встреча, сотрудничество, проект, контракт.',
        vocabulary: [
          { word: 'Компания', translation: 'Company', pronunciation: 'kahm-PAH-nee-yah', example: 'Наша компания в Москве.', exampleTranslation: 'Our company is in Moscow.' },
          { word: 'Встреча', translation: 'Meeting', pronunciation: 'FSTRYE-chah', example: 'У нас встреча завтра.', exampleTranslation: 'We have a meeting tomorrow.' },
          { word: 'Сотрудничество', translation: 'Cooperation', pronunciation: 'sah-TROOD-nee-chest-vah', example: 'Мы надеемся на сотрудничество.', exampleTranslation: 'We hope for cooperation.' },
          { word: 'Проект', translation: 'Project', pronunciation: 'prah-YEKT', example: 'Этот проект очень важный.', exampleTranslation: 'This project is very important.' },
          { word: 'Контракт', translation: 'Contract', pronunciation: 'kahn-TRAHKT', example: 'Подпишите контракт, пожалуйста.', exampleTranslation: 'Please sign the contract.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Formal Language Patterns',
        content: `Formal expressions for business:
Уважаемый/Уважаемая (Dear Sir/Madam)
Позвольте представить... (Allow me to introduce...)
Надеемся на дальнейшее сотрудничество (We hope for further cooperation)
С уважением (With respect/Sincerely)`,
        audioText: 'Уважаемый господин Иванов. Позвольте представить нашу компанию. С уважением.',
        grammarPoints: [
          'Use "Уважаемый" for formal address',
          'Always use "вы" (formal you) in business',
          'End letters with "С уважением" (with respect)',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you formally address someone in a Russian business letter?',
        options: ['Привет', 'Уважаемый', 'Дорогой друг', 'Эй'],
        correctAnswer: 'Уважаемый',
        explanation: '"Уважаемый" (respected) is the formal way to address someone in business.',
      },
      {
        type: 'translation',
        question: 'Translate: "We hope for cooperation."',
        correctAnswer: 'Мы надеемся на сотрудничество',
        explanation: 'This is a common formal expression in Russian business.',
      },
    ],
    isActive: true,
  },
];

// JAPANESE LESSONS
const japaneseLessons = [
  // BEGINNER LESSONS
  {
    title: 'Basic Greetings & Introductions',
    slug: 'japanese-basic-greetings-introductions',
    description: 'Learn how to greet people in Japanese and introduce yourself. This lesson covers common phrases like "こんにちは", "おはようございます", and "はじめまして".',
    topic: 'Speaking & Listening',
    language: 'japanese',
    level: 'beginner',
    duration: 12,
    order: 1,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and ask others\' names',
      'Use polite expressions in conversation',
      'Understand basic Japanese writing systems',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Japanese Greetings',
        content: 'Japanese uses three writing systems: Hiragana, Katakana, and Kanji. Politeness levels are very important in Japanese. Greetings change based on time of day and formality.',
        audioText: 'Japanese uses three writing systems. Politeness levels are very important.',
      },
      {
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Learn these fundamental greeting phrases:',
        audioText: 'こんにちは。おはようございます。こんばんは。おやすみなさい。',
        vocabulary: [
          {
            word: 'こんにちは',
            translation: 'Hello / Good afternoon',
            pronunciation: 'kon-ni-chi-wa',
            example: 'こんにちは！お元気ですか？',
            exampleTranslation: 'Hello! How are you?',
          },
          {
            word: 'おはようございます',
            translation: 'Good morning (polite)',
            pronunciation: 'o-ha-yō go-zai-mas',
            example: 'おはようございます、田中さん。',
            exampleTranslation: 'Good morning, Mr./Ms. Tanaka.',
          },
          {
            word: 'こんばんは',
            translation: 'Good evening',
            pronunciation: 'kon-ban-wa',
            example: 'こんばんは、いらっしゃいませ。',
            exampleTranslation: 'Good evening, welcome.',
          },
          {
            word: 'おやすみなさい',
            translation: 'Good night',
            pronunciation: 'o-ya-su-mi na-sai',
            example: 'おやすみなさい、また明日。',
            exampleTranslation: 'Good night, see you tomorrow.',
          },
          {
            word: 'はじめまして',
            translation: 'Nice to meet you (first time)',
            pronunciation: 'ha-ji-me-ma-shi-te',
            example: 'はじめまして、田中です。',
            exampleTranslation: 'Nice to meet you, I\'m Tanaka.',
          },
        ],
      },
      {
        type: 'dialogue',
        title: 'Meeting Someone New',
        content: `田中：こんにちは！
山田：こんにちは！お名前は？
田中：田中です。あなたは？
山田：山田です。はじめまして。
田中：はじめまして。どこから来ましたか？
山田：東京から来ました。田中さんは？
田中：大阪から来ました。よろしくお願いします。`,
        audioText: 'こんにちは！こんにちは！お名前は？田中です。あなたは？山田です。はじめまして。',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you say "Good morning" politely in Japanese?',
        options: ['こんばんは', 'おはようございます', 'こんにちは', 'おやすみなさい'],
        correctAnswer: 'おはようございます',
        explanation: '"おはようございます" (ohayō gozaimasu) is the polite form of good morning.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "はじめまして" mean?',
        options: ['Goodbye', 'Thank you', 'Nice to meet you', 'How are you?'],
        correctAnswer: 'Nice to meet you',
        explanation: '"はじめまして" is used when meeting someone for the first time.',
      },
      {
        type: 'fill-blank',
        question: 'Complete: 田中_____。(I am Tanaka)',
        correctAnswer: 'です',
        explanation: '"です" (desu) is the polite form of "is/am/are".',
      },
      {
        type: 'translation',
        question: 'Translate: "Good evening"',
        correctAnswer: 'こんばんは',
        explanation: '"こんばんは" (konbanwa) is used from evening onwards.',
      },
    ],
    isActive: true,
  },
  {
    title: 'Numbers 1-100',
    slug: 'japanese-numbers-1-100',
    description: 'Master Japanese numbers from 1 to 100. Learn to count, tell prices, and give your phone number in Japanese.',
    topic: 'Vocabulary',
    language: 'japanese',
    level: 'beginner',
    duration: 15,
    order: 2,
    objectives: [
      'Count from 1 to 100 in Japanese',
      'Use numbers in practical contexts like prices',
      'Give and understand phone numbers',
      'Understand the Japanese counting system',
    ],
    contents: [
      {
        type: 'text',
        title: 'Introduction to Japanese Numbers',
        content: 'Japanese has two number systems: native Japanese (hitotsu, futatsu...) and Sino-Japanese (ichi, ni, san...). The Sino-Japanese system is more commonly used for counting.',
        audioText: 'Japanese has two number systems. The Sino-Japanese system is more commonly used for counting.',
      },
      {
        type: 'vocabulary',
        title: 'Numbers 1-10',
        content: 'Learn the basic numbers:',
        audioText: '一、二、三、四、五、六、七、八、九、十。',
        vocabulary: [
          { word: '一 (いち)', translation: 'One (1)', pronunciation: 'ichi', example: '一つ', exampleTranslation: 'One (thing)' },
          { word: '二 (に)', translation: 'Two (2)', pronunciation: 'ni', example: '二人', exampleTranslation: 'Two people' },
          { word: '三 (さん)', translation: 'Three (3)', pronunciation: 'san', example: '三日', exampleTranslation: 'Three days' },
          { word: '四 (よん/し)', translation: 'Four (4)', pronunciation: 'yon/shi', example: '四百円', exampleTranslation: 'Four hundred yen' },
          { word: '五 (ご)', translation: 'Five (5)', pronunciation: 'go', example: '五分', exampleTranslation: 'Five minutes' },
          { word: '六 (ろく)', translation: 'Six (6)', pronunciation: 'roku', example: '六時', exampleTranslation: 'Six o\'clock' },
          { word: '七 (なな/しち)', translation: 'Seven (7)', pronunciation: 'nana/shichi', example: '七日', exampleTranslation: 'Seven days' },
          { word: '八 (はち)', translation: 'Eight (8)', pronunciation: 'hachi', example: '八月', exampleTranslation: 'August' },
          { word: '九 (きゅう/く)', translation: 'Nine (9)', pronunciation: 'kyū/ku', example: '九十', exampleTranslation: 'Ninety' },
          { word: '十 (じゅう)', translation: 'Ten (10)', pronunciation: 'jū', example: '十円', exampleTranslation: 'Ten yen' },
        ],
      },
      {
        type: 'grammar',
        title: 'Forming Larger Numbers',
        content: `Number patterns in Japanese:
11-19: 十 + digit (十一 = 11, 十五 = 15)
20-90: digit + 十 (二十 = 20, 五十 = 50)
21-99: digit + 十 + digit (二十一 = 21)
100: 百 (hyaku)`,
        audioText: '十一、二十、二十一、百。',
        grammarPoints: [
          'Japanese numbers are very logical like Chinese',
          '4 and 7 have alternate readings (yon/shi, nana/shichi)',
          'Some combinations cause sound changes (e.g., 三百 = sanbyaku)',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is "15" in Japanese?',
        options: ['五十', '十五', '一五', '五一'],
        correctAnswer: '十五',
        explanation: '"十五" (jūgo) means fifteen (ten + five).',
      },
      {
        type: 'fill-blank',
        question: 'Complete: 二十_____ = 25',
        correctAnswer: '五',
        explanation: '二十五 (nijūgo) means twenty-five.',
      },
      {
        type: 'translation',
        question: 'Translate: "Forty"',
        correctAnswer: '四十',
        explanation: '"四十" (yonjū) = four-ten = forty.',
      },
    ],
    isActive: true,
  },
  // INTERMEDIATE LESSON
  {
    title: 'Ordering Food at a Restaurant',
    slug: 'japanese-ordering-food',
    description: 'Learn essential phrases for ordering food at Japanese restaurants and izakayas.',
    topic: 'Practical Situations',
    language: 'japanese',
    level: 'intermediate',
    duration: 18,
    order: 3,
    objectives: [
      'Order food and drinks confidently',
      'Ask about ingredients and allergies',
      'Make special requests politely',
      'Handle payment and tipping customs',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Restaurant Vocabulary',
        content: 'Essential words for dining:',
        audioText: 'メニュー、すみません、注文、お会計、おいしい。',
        vocabulary: [
          { word: 'メニュー', translation: 'Menu', pronunciation: 'menyū', example: 'メニューをください。', exampleTranslation: 'Please give me the menu.' },
          { word: 'すみません', translation: 'Excuse me', pronunciation: 'sumimasen', example: 'すみません！', exampleTranslation: 'Excuse me!' },
          { word: '注文する', translation: 'To order', pronunciation: 'chūmon suru', example: '注文してもいいですか？', exampleTranslation: 'May I order?' },
          { word: 'お会計', translation: 'Bill/Check', pronunciation: 'o-kaikei', example: 'お会計お願いします。', exampleTranslation: 'Check, please.' },
          { word: 'おいしい', translation: 'Delicious', pronunciation: 'oishii', example: 'この料理はおいしいです！', exampleTranslation: 'This dish is delicious!' },
        ],
      },
      {
        type: 'dialogue',
        title: 'At the Restaurant',
        content: `店員：いらっしゃいませ！何名様ですか？
客：二人です。
店員：こちらへどうぞ。メニューです。
客：ありがとうございます。寿司と味噌汁をお願いします。
店員：お飲み物は？
客：緑茶を二つください。
店員：かしこまりました。少々お待ちください。`,
        audioText: 'いらっしゃいませ！何名様ですか？二人です。こちらへどうぞ。メニューです。ありがとうございます。寿司と味噌汁をお願いします。',
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'How do you ask for the bill in Japanese?',
        options: ['お会計お願いします', 'メニューください', '注文します', 'ありがとう'],
        correctAnswer: 'お会計お願いします',
        explanation: '"お会計お願いします" (o-kaikei onegaishimasu) means "bill, please".',
      },
      {
        type: 'translation',
        question: 'Translate: "This is delicious!"',
        correctAnswer: 'おいしいです',
        explanation: '"おいしい" (oishii) means delicious. Adding "です" makes it polite.',
      },
    ],
    isActive: true,
  },
  // ADVANCED LESSON
  {
    title: 'Business Communication',
    slug: 'japanese-business-communication',
    description: 'Master professional Japanese (敬語 keigo) for business meetings, negotiations, and formal correspondence.',
    topic: 'Professional',
    language: 'japanese',
    level: 'advanced',
    duration: 25,
    order: 4,
    objectives: [
      'Use proper keigo (honorific language)',
      'Conduct business introductions',
      'Participate in meetings',
      'Write professional emails in Japanese',
    ],
    contents: [
      {
        type: 'vocabulary',
        title: 'Business Vocabulary',
        content: 'Essential business terms:',
        audioText: '会社、会議、協力、プロジェクト、契約。',
        vocabulary: [
          { word: '会社', translation: 'Company', pronunciation: 'kaisha', example: '弊社は東京にあります。', exampleTranslation: 'Our company is in Tokyo.' },
          { word: '会議', translation: 'Meeting', pronunciation: 'kaigi', example: '明日会議があります。', exampleTranslation: 'There is a meeting tomorrow.' },
          { word: 'ご協力', translation: 'Cooperation (polite)', pronunciation: 'go-kyōryoku', example: 'ご協力お願いいたします。', exampleTranslation: 'We request your cooperation.' },
          { word: 'プロジェクト', translation: 'Project', pronunciation: 'purojekuto', example: 'このプロジェクトは重要です。', exampleTranslation: 'This project is important.' },
          { word: '契約', translation: 'Contract', pronunciation: 'keiyaku', example: 'ご契約をお願いいたします。', exampleTranslation: 'Please sign the contract.' },
        ],
      },
      {
        type: 'grammar',
        title: 'Keigo (Honorific Language)',
        content: `Business keigo expressions:
お忙しいところ恐れ入りますが... (I\'m sorry to bother you when you\'re busy...)
ご検討いただければ幸いです (I would be grateful if you could consider...)
何卒よろしくお願いいたします (Thank you very much in advance)
敬具 (Sincerely - letter closing)`,
        audioText: 'お忙しいところ恐れ入りますが、ご検討いただければ幸いです。何卒よろしくお願いいたします。',
        grammarPoints: [
          'Use 弊社 (heisha) for "our company" and 御社 (onsha) for "your company"',
          'Add お/ご before nouns for respect',
          'Use いたします instead of します for humility',
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'What is the humble way to say "our company" in Japanese business?',
        options: ['私の会社', '弊社', '御社', 'うちの会社'],
        correctAnswer: '弊社',
        explanation: '"弊社" (heisha) is the humble term for "our company" in business.',
      },
      {
        type: 'translation',
        question: 'Translate: "Thank you very much in advance."',
        correctAnswer: '何卒よろしくお願いいたします',
        explanation: 'This is the standard formal closing phrase in Japanese business.',
      },
    ],
    isActive: true,
  },
];

const allLessons = [...spanishLessons, ...hindiLessons, ...frenchLessons, ...mandarinLessons, ...arabicLessons, ...bengaliLessons, ...portugueseLessons, ...russianLessons, ...japaneseLessons];

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
