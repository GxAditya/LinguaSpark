/**
 * Enhanced Emoji Fallback Service
 * Provides intelligent emoji fallbacks for image generation failures
 */

export interface EmojiMapping {
  [key: string]: string;
}

export interface CategoryMapping {
  [category: string]: string[];
}

class EmojiFallbackService {
  // Comprehensive emoji mappings for common words
  private readonly emojiMappings: EmojiMapping = {
    // Animals
    'dog': '🐕', 'puppy': '🐶', 'poodle': '🐩',
    'cat': '🐱', 'kitten': '🐈',
    'bird': '🐦', 'chick': '🐤', 'penguin': '🐧', 'eagle': '🦅', 'owl': '🦉', 'duck': '🦆',
    'fish': '🐠', 'goldfish': '🐟', 'pufferfish': '🐡', 'shark': '🦈', 'whale': '🐳', 'octopus': '🐙',
    'horse': '🐴', 'lion': '🦁', 'tiger': '🐯', 'leopard': '🐆',
    'elephant': '🐘', 'bear': '🐻', 'panda': '🐼', 'koala': '🐨',
    'rabbit': '🐰', 'mouse': '🐭', 'hamster': '🐹', 'rat': '🐀',
    'fox': '🦊', 'wolf': '🐺', 'raccoon': '🦝',
    'cow': '🐮', 'pig': '🐷', 'chicken': '🐔', 'rooster': '🐓',
    'butterfly': '🦋', 'bee': '🐝', 'ladybug': '🐞', 'spider': '🕷️', 'ant': '🐜',
    'turtle': '🐢', 'snake': '🐍', 'lizard': '🦎', 'frog': '🐸',
    'monkey': '🐵', 'gorilla': '🦍', 'zebra': '🦓', 'giraffe': '🦒',
    
    // Food & Drinks
    'apple': '🍎', 'orange fruit': '🍊', 'lemon': '🍋', 'lime': '🍈',
    'banana': '🍌', 'grapes': '🍇', 'strawberry': '🍓', 'cherry': '🍒',
    'peach': '🍑', 'pineapple': '🍍', 'watermelon': '🍉', 'melon': '🍈',
    'pizza': '🍕', 'burger': '🍔', 'hotdog': '🌭', 'sandwich': '🥪',
    'bread': '🍞', 'cheese': '🧀', 'egg': '🥚', 'bacon': '🥓',
    'cake': '🍰', 'cookie': '🍪', 'donut': '🍩', 'chocolate': '🍫',
    'coffee': '☕', 'tea': '🍵', 'milk': '🥛', 'juice': '🧃', 'soda': '🥤',
    'wine': '🍷', 'beer': '🍺', 'cocktail': '🍹',
    'rice': '🍚', 'pasta': '🍝', 'soup': '🍲', 'salad': '🥗',
    
    // Nature & Weather
    'sun': '☀️', 'moon': '🌙', 'star': '⭐', 'stars': '✨',
    'rain': '🌧️', 'cloud': '☁️', 'storm': '⛈️', 'snow': '❄️',
    'rainbow': '🌈', 'fire': '🔥', 'water': '💧',
    'tree': '🌳', 'pine': '🌲', 'palm': '🌴', 'cactus': '🌵',
    'flower': '🌸', 'rose': '🌹', 'sunflower': '🌻', 'tulip': '🌷',
    'mushroom': '🍄', 'clover': '🍀', 'leaf': '🍃',
    'mountain': '⛰️', 'volcano': '🌋', 'beach': '🏖️', 'ocean': '🌊',
    
    // Buildings & Places
    'house': '🏠', 'home': '🏡', 'building': '🏢', 'office': '🏢',
    'school': '🏫', 'hospital': '🏥', 'bank': '🏦', 'hotel': '🏨',
    'store': '🏪', 'restaurant': '🍽️', 'cafe': '☕', 'bar': '🍺',
    'church': '⛪', 'mosque': '🕌', 'temple': '🛕',
    'castle': '🏰', 'tower': '🗼', 'bridge': '🌉',
    'park': '🏞️', 'garden': '🏡', 'farm': '🚜',
    
    // Transportation
    'car': '🚗', 'bus': '🚌', 'train': '🚂', 'subway': '🚇',
    'airplane': '✈️', 'helicopter': '🚁', 'boat': '⛵', 'ship': '🚢',
    'bicycle': '🚲', 'motorcycle': '🏍️', 'scooter': '🛵',
    'taxi': '🚕', 'truck': '🚚', 'ambulance': '🚑', 'police': '🚓',
    
    // Objects & Tools
    'book': '📚', 'books': '📚', 'pencil': '✏️', 'pen': '🖊️',
    'computer': '💻', 'laptop': '💻', 'phone': '📱', 'tablet': '📱',
    'watch': '⌚', 'clock': '🕐', 'camera': '📷',
    'key': '🔑', 'lock': '🔒', 'door': '🚪', 'window': '🪟',
    'chair': '🪑', 'table': '🪑', 'bed': '🛏️', 'sofa': '🛋️',
    'lamp': '💡', 'candle': '🕯️', 'mirror': '🪞',
    'scissors': '✂️', 'hammer': '🔨', 'wrench': '🔧',
    
    // Sports & Activities
    'soccer': '⚽', 'football': '🏈', 'basketball': '🏀', 'tennis': '🎾',
    'baseball': '⚾', 'golf': '⛳', 'swimming': '🏊', 'running': '🏃',
    'cycling': '🚴', 'skiing': '⛷️', 'surfing': '🏄',
    'music': '🎵', 'guitar': '🎸', 'piano': '🎹', 'drums': '🥁',
    'art': '🎨', 'painting': '🖼️', 'drawing': '✏️',
    
    // Body Parts
    'face': '😊', 'eye': '👁️', 'nose': '👃', 'mouth': '👄',
    'hand': '✋', 'finger': '👆', 'foot': '🦶', 'leg': '🦵',
    'heart': '❤️', 'brain': '🧠', 'tooth': '🦷',
    
    // Colors
    'red': '🔴', 'blue': '🔵', 'green': '🟢', 'yellow': '🟡',
    'orange': '🟠', 'purple': '🟣', 'black': '⚫', 'white': '⚪',
    'brown': '🤎', 'pink': '🩷',
    
    // Numbers
    'one': '1️⃣', 'two': '2️⃣', 'three': '3️⃣', 'four': '4️⃣', 'five': '5️⃣',
    'six': '6️⃣', 'seven': '7️⃣', 'eight': '8️⃣', 'nine': '9️⃣', 'ten': '🔟',
    
    // Emotions & Expressions
    'happy': '😊', 'sad': '😢', 'angry': '😠', 'surprised': '😲',
    'love': '❤️', 'laugh': '😂', 'cry': '😭', 'smile': '😊',
    
    // Time & Seasons
    'morning': '🌅', 'evening': '🌆', 'night': '🌃',
    'spring': '🌸', 'summer': '☀️', 'autumn': '🍂', 'winter': '❄️',
    'monday': '📅', 'tuesday': '📅', 'wednesday': '📅', 'thursday': '📅',
    'friday': '📅', 'saturday': '📅', 'sunday': '📅',
    
    // Common verbs (represented by related objects/actions)
    'eat': '🍽️', 'drink': '🥤', 'sleep': '😴', 'walk': '🚶',
    'run': '🏃', 'jump': '🦘', 'swim': '🏊', 'fly': '✈️',
    'read': '📖', 'write': '✍️', 'listen': '👂', 'speak': '🗣️',
    'work': '💼', 'study': '📚', 'play': '🎮', 'dance': '💃',
    'sing': '🎤', 'cook': '👨‍🍳', 'clean': '🧹', 'wash': '🧼',
  };

  // Category-based fallbacks for when specific word isn't found
  private readonly categoryMappings: CategoryMapping = {
    animals: ['🐕', '🐱', '🐦', '🐠', '🐴', '🐘', '🐻', '🐰', '🦊', '🐮'],
    food: ['🍎', '🍕', '🍔', '🍞', '🧀', '🍰', '☕', '🍇', '🍌', '🍊'],
    nature: ['🌳', '🌸', '☀️', '🌙', '⭐', '🌧️', '🌈', '🔥', '💧', '🍄'],
    buildings: ['🏠', '🏢', '🏫', '🏥', '🏪', '⛪', '🏰', '🌉', '🏞️', '🚜'],
    transport: ['🚗', '🚌', '🚂', '✈️', '🚲', '⛵', '🚁', '🚕', '🚚', '🏍️'],
    objects: ['📚', '💻', '📱', '⌚', '🔑', '🪑', '💡', '🔨', '✂️', '📷'],
    sports: ['⚽', '🏀', '🎾', '⚾', '🏈', '⛳', '🎸', '🎨', '🏊', '🚴'],
    body: ['😊', '👁️', '✋', '🦶', '❤️', '🧠', '👃', '👄', '👆', '🦵'],
    colors: ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣', '⚫', '⚪', '🤎', '🩷'],
    emotions: ['😊', '😢', '😠', '😲', '❤️', '😂', '😭', '😴', '🤔', '😍'],
  };

  /**
   * Get emoji for a specific word
   */
  getEmojiForWord(word: string): string | null {
    const normalizedWord = word.toLowerCase().trim();
    return this.emojiMappings[normalizedWord] || null;
  }

  /**
   * Get emoji for a word with intelligent fallbacks
   */
  getEmojiWithFallback(word: string, category?: string): string {
    // Try direct mapping first
    const directEmoji = this.getEmojiForWord(word);
    if (directEmoji) {
      return directEmoji;
    }

    // Try partial matching
    const normalizedWord = word.toLowerCase().trim();
    for (const [key, emoji] of Object.entries(this.emojiMappings)) {
      if (key.includes(normalizedWord) || normalizedWord.includes(key)) {
        return emoji;
      }
    }

    // Try category-based fallback
    if (category && this.categoryMappings[category.toLowerCase()]) {
      const categoryEmojis = this.categoryMappings[category.toLowerCase()];
      return categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
    }

    // Try to guess category from word
    const guessedCategory = this.guessCategory(normalizedWord);
    if (guessedCategory && this.categoryMappings[guessedCategory]) {
      const categoryEmojis = this.categoryMappings[guessedCategory];
      return categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
    }

    // Ultimate fallback
    return '❓';
  }

  /**
   * Generate multiple emoji options for a word
   */
  getEmojiOptions(word: string, count: number = 4, category?: string): string[] {
    const options: string[] = [];
    const normalizedWord = word.toLowerCase().trim();

    // Add direct match if available
    const directEmoji = this.getEmojiForWord(normalizedWord);
    if (directEmoji) {
      options.push(directEmoji);
    }

    // Add related emojis from the same category
    const wordCategory = category || this.guessCategory(normalizedWord);
    if (wordCategory && this.categoryMappings[wordCategory]) {
      const categoryEmojis = this.categoryMappings[wordCategory];
      for (const emoji of categoryEmojis) {
        if (options.length >= count) break;
        if (!options.includes(emoji)) {
          options.push(emoji);
        }
      }
    }

    // Fill remaining slots with random emojis from different categories
    const allEmojis = Object.values(this.emojiMappings);
    while (options.length < count) {
      const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
      if (!options.includes(randomEmoji)) {
        options.push(randomEmoji);
      }
    }

    return options.slice(0, count);
  }

  /**
   * Guess the category of a word based on common patterns
   */
  private guessCategory(word: string): string | null {
    const animalKeywords = ['dog', 'cat', 'bird', 'fish', 'animal', 'pet', 'wild'];
    const foodKeywords = ['food', 'eat', 'drink', 'fruit', 'vegetable', 'meat', 'sweet'];
    const natureKeywords = ['tree', 'flower', 'plant', 'weather', 'sky', 'earth', 'natural'];
    const buildingKeywords = ['house', 'building', 'place', 'room', 'structure', 'location'];
    const transportKeywords = ['car', 'vehicle', 'transport', 'travel', 'move', 'ride'];
    const objectKeywords = ['tool', 'thing', 'object', 'item', 'equipment', 'device'];
    const sportsKeywords = ['sport', 'game', 'play', 'ball', 'activity', 'exercise'];
    const bodyKeywords = ['body', 'part', 'face', 'hand', 'foot', 'head', 'human'];
    const colorKeywords = ['color', 'colour', 'bright', 'dark', 'light', 'shade'];
    const emotionKeywords = ['feel', 'emotion', 'mood', 'happy', 'sad', 'angry', 'love'];

    const categoryTests = [
      { keywords: animalKeywords, category: 'animals' },
      { keywords: foodKeywords, category: 'food' },
      { keywords: natureKeywords, category: 'nature' },
      { keywords: buildingKeywords, category: 'buildings' },
      { keywords: transportKeywords, category: 'transport' },
      { keywords: objectKeywords, category: 'objects' },
      { keywords: sportsKeywords, category: 'sports' },
      { keywords: bodyKeywords, category: 'body' },
      { keywords: colorKeywords, category: 'colors' },
      { keywords: emotionKeywords, category: 'emotions' },
    ];

    for (const { keywords, category } of categoryTests) {
      if (keywords.some(keyword => word.includes(keyword) || keyword.includes(word))) {
        return category;
      }
    }

    return null;
  }

  /**
   * Validate that an emoji is appropriate and supported
   */
  isValidEmoji(emoji: string): boolean {
    // Basic emoji validation - check if it's a single emoji character
    const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u;
    return emojiRegex.test(emoji.trim());
  }

  /**
   * Get fallback emoji for failed image generation
   */
  getImageFallback(prompt: string, translation?: string): string {
    // Try translation first if provided
    if (translation) {
      const translationEmoji = this.getEmojiWithFallback(translation);
      if (translationEmoji !== '❓') {
        return translationEmoji;
      }
    }

    // Extract meaningful words from prompt
    const words = prompt.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // Try each word
    for (const word of words) {
      const emoji = this.getEmojiWithFallback(word);
      if (emoji !== '❓') {
        return emoji;
      }
    }

    // Final fallback
    return '🖼️'; // Picture frame emoji for images
  }

  /**
   * Get all available categories
   */
  getAvailableCategories(): string[] {
    return Object.keys(this.categoryMappings);
  }

  /**
   * Get statistics about the emoji mappings
   */
  getStats(): { totalMappings: number; categories: number; averagePerCategory: number } {
    const totalMappings = Object.keys(this.emojiMappings).length;
    const categories = Object.keys(this.categoryMappings).length;
    const averagePerCategory = Math.round(totalMappings / categories);

    return { totalMappings, categories, averagePerCategory };
  }
}

// Export singleton instance
export const emojiFallbackService = new EmojiFallbackService();

export default EmojiFallbackService;