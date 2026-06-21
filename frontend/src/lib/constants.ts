import type { StyleOption, PaletteOption, RoomOption, SimpleOption } from '../types';
import type { Locale } from '../i18n/messages';

export const ROOM_TYPES: RoomOption[] = [
  { id: 'living_room', name: 'living_room', icon: '🛋️' },
  { id: 'bedroom', name: 'bedroom', icon: '🛏️' },
  { id: 'kitchen', name: 'kitchen', icon: '🍳' },
  { id: 'bathroom', name: 'bathroom', icon: '🛁' },
  { id: 'dining_room', name: 'dining_room', icon: '🍽️' },
  { id: 'home_office', name: 'home_office', icon: '💼' },
  { id: 'kids_room', name: 'kids_room', icon: '🧸' },
  { id: 'hallway', name: 'hallway', icon: '🚪' },
  { id: 'studio', name: 'studio', icon: '🏠' },
  { id: 'outdoor', name: 'outdoor', icon: '🌿' },
  { id: 'gym', name: 'gym', icon: '🏋️' },
  { id: 'sunroom', name: 'sunroom', icon: '☀️' },
  { id: 'nursery', name: 'nursery', icon: '🍼' },
  { id: 'garage', name: 'garage', icon: '🔧' },
];

export const STYLES: StyleOption[] = [
  { id: 'modern', name: 'modern', description: 'modern.desc', icon: '🏙️' },
  { id: 'minimalist', name: 'minimalist', description: 'minimalist.desc', icon: '⚪' },
  { id: 'scandinavian', name: 'scandinavian', description: 'scandinavian.desc', icon: '🌲' },
  { id: 'industrial', name: 'industrial', description: 'industrial.desc', icon: '🏭' },
  { id: 'bohemian', name: 'bohemian', description: 'bohemian.desc', icon: '🌸' },
  { id: 'midcentury', name: 'midcentury', description: 'midcentury.desc', icon: '🪑' },
  { id: 'farmhouse', name: 'farmhouse', description: 'farmhouse.desc', icon: '🏡' },
  { id: 'luxury', name: 'luxury', description: 'luxury.desc', icon: '💎' },
  { id: 'coastal', name: 'coastal', description: 'coastal.desc', icon: '🌊' },
  { id: 'japanese', name: 'japanese', description: 'japanese.desc', icon: '🎋' },
  { id: 'artdeco', name: 'artdeco', description: 'artdeco.desc', icon: '✨' },
  { id: 'rustic', name: 'rustic', description: 'rustic.desc', icon: '🪵' },
  { id: 'tropical', name: 'tropical', description: 'tropical.desc', icon: '🌴' },
  { id: 'classic', name: 'classic', description: 'classic.desc', icon: '🏛️' },
  { id: 'mediterranean', name: 'mediterranean', description: 'mediterranean.desc', icon: '🫒' },
  { id: 'wabi_sabi', name: 'wabi_sabi', description: 'wabi_sabi.desc', icon: '🌾' },
  { id: 'cottagecore', name: 'cottagecore', description: 'cottagecore.desc', icon: '🌸' },
  { id: 'maximalist', name: 'maximalist', description: 'maximalist.desc', icon: '🎭' },
];

export const COLOR_PALETTES: PaletteOption[] = [
  { id: 'warm_neutrals', name: 'warm_neutrals', colors: ['#E8DCC4', '#C9B79C', '#8B7355', '#5D4E37'] },
  { id: 'cool_neutrals', name: 'cool_neutrals', colors: ['#F5F5F5', '#D3D3D3', '#A0A0A0', '#5C5C5C'] },
  { id: 'earth_tones', name: 'earth_tones', colors: ['#C77D52', '#9C6B3F', '#6B8E23', '#D4A574'] },
  { id: 'monochrome', name: 'monochrome', colors: ['#FFFFFF', '#A0A0A0', '#404040', '#000000'] },
  { id: 'pastel', name: 'pastel', colors: ['#FFD1DC', '#B8E6D5', '#A8D8EA', '#D5BAE6'] },
  { id: 'jewel_tones', name: 'jewel_tones', colors: ['#046307', '#0F52BA', '#9B111E', '#9966CC'] },
  { id: 'ocean_blue', name: 'ocean_blue', colors: ['#001F3F', '#0074D9', '#7FDBFF', '#FFFFFF'] },
  { id: 'forest_green', name: 'forest_green', colors: ['#1B4332', '#52796F', '#84A98C', '#CAD2C5'] },
  { id: 'warm_sunset', name: 'warm_sunset', colors: ['#C04000', '#FF7F50', '#FFA07A', '#FFD700'] },
  { id: 'cool_lavender', name: 'cool_lavender', colors: ['#6A5ACD', '#9370DB', '#D8BFD8', '#F5F5F5'] },
  { id: 'bold_red', name: 'bold_red', colors: ['#8B0000', '#DC143C', '#F5DEB3', '#FFD700'] },
  { id: 'charcoal_gold', name: 'charcoal_gold', colors: ['#1C1C1C', '#3F3F3F', '#B8860B', '#FFD700'] },
  { id: 'sage_terracotta', name: 'sage_terracotta', colors: ['#9CAF88', '#C4A57B', '#C77D52', '#F5F0E1'] },
  { id: 'navy_brass', name: 'navy_brass', colors: ['#000080', '#191970', '#B5651D', '#F5DEB3'] },
  { id: 'blush_gold', name: 'blush_gold', colors: ['#FFC0CB', '#F4C2C2', '#B76E79', '#D4AF37'] },
  { id: 'emerald_gold', name: 'emerald_gold', colors: ['#046307', '#50C878', '#D4AF37', '#FFF8DC'] },
];

export const LIGHTING_OPTIONS: SimpleOption[] = [
  { id: 'natural_day', name: 'natural_day', icon: '☀️' },
  { id: 'golden_hour', name: 'golden_hour', icon: '🌇' },
  { id: 'evening', name: 'evening', icon: '🕯️' },
  { id: 'night', name: 'night', icon: '🌙' },
  { id: 'bright', name: 'bright', icon: '💡' },
];

export const CAMERA_OPTIONS: SimpleOption[] = [
  { id: 'wide', name: 'wide', icon: '🖼️' },
  { id: 'standard', name: 'standard', icon: '📷' },
  { id: 'corner', name: 'corner', icon: '🔲' },
  { id: 'detail', name: 'detail', icon: '🔍' },
];

export const DENSITY_OPTIONS: SimpleOption[] = [
  { id: 'minimal', name: 'minimal', icon: '◽' },
  { id: 'balanced', name: 'balanced', icon: '◼️' },
  { id: 'rich', name: 'rich', icon: '🛋️' },
];

export const MATERIAL_OPTIONS: SimpleOption[] = [
  { id: 'default', name: 'default' },
  { id: 'wood', name: 'wood', icon: '🪵' },
  { id: 'marble', name: 'marble', icon: '🧊' },
  { id: 'concrete', name: 'concrete', icon: '🧱' },
  { id: 'fabric', name: 'fabric', icon: '🧵' },
  { id: 'glass', name: 'glass', icon: '💠' },
];

export const MODEL_OPTIONS: SimpleOption[] = [
  { id: 'flux', name: 'flux', icon: '✨' },
  { id: 'turbo', name: 'turbo', icon: '⚡' },
];

export const ASPECT_RATIO_OPTIONS: SimpleOption[] = [
  { id: 'auto', name: 'auto', icon: '📐' },
  { id: 'square', name: 'square', icon: '⬜' },
  { id: 'landscape', name: 'landscape', icon: '🖼️' },
  { id: 'portrait', name: 'portrait', icon: '📱' },
  { id: 'wide', name: 'wide', icon: '🎬' },
];

export const ASPECT_RATIO_LABELS: LocalizedNames<string> = {
  ru: { auto: 'Авто (4:3)', square: 'Квадрат (1:1)', landscape: 'Пейзаж (16:9)', portrait: 'Портрет (3:4)', wide: 'Широкий (2.4:1)' },
  en: { auto: 'Auto (4:3)', square: 'Square (1:1)', landscape: 'Landscape (16:9)', portrait: 'Portrait (3:4)', wide: 'Wide (2.4:1)' },
  ky: { auto: 'Авто (4:3)', square: 'Чарчы (1:1)', landscape: 'Пейзаж (16:9)', portrait: 'Портрет (3:4)', wide: 'Кең (2.4:1)' },
};

export const QUICK_PROMPTS_KEYS = [
  'cozy',
  'plants',
  'windows',
  'fireplace',
  'highCeiling',
  'wood',
  'rug',
  'pendants',
  'art',
  'open',
  'books',
  'mirror',
] as const;

// Конкретные английские промпты, отправляемые на бэкенд
export const QUICK_PROMPTS: Record<(typeof QUICK_PROMPTS_KEYS)[number], string> = {
  cozy: 'cozy atmosphere',
  plants: 'lots of plants',
  windows: 'large windows',
  fireplace: 'fireplace',
  highCeiling: 'high ceiling',
  wood: 'wooden floor',
  rug: 'rug on the floor',
  pendants: 'pendant lights',
  art: 'artwork on walls',
  open: 'open plan',
  books: 'bookshelves',
  mirror: 'mirror',
};

// Локализованные подписи
export const QUICK_PROMPTS_LABELS: Record<Locale, Record<(typeof QUICK_PROMPTS_KEYS)[number], string>> = {
  ru: {
    cozy: 'уютно', plants: 'растения', windows: 'большие окна', fireplace: 'камин',
    highCeiling: 'высокий потолок', wood: 'паркет', rug: 'ковёр', pendants: 'подвесы',
    art: 'картины', open: 'open-space', books: 'книги', mirror: 'зеркало',
  },
  en: {
    cozy: 'cozy', plants: 'plants', windows: 'big windows', fireplace: 'fireplace',
    highCeiling: 'high ceiling', wood: 'wood floor', rug: 'rug', pendants: 'pendants',
    art: 'artworks', open: 'open plan', books: 'books', mirror: 'mirror',
  },
  ky: {
    cozy: 'жайлуу', plants: 'өсүмдүктөр', windows: 'чоң терезелер', fireplace: 'камин',
    highCeiling: 'бийик чатыр', wood: 'жыгач пол', rug: 'килем', pendants: 'чырактар',
    art: 'сүрөттөр', open: 'ачык план', books: 'китептер', mirror: 'күзгү',
  },
};

// Локализованные имена для всех селекторов
type LocalizedNames<T extends string> = Record<Locale, Record<T, string>>;

export const ROOM_LABELS: LocalizedNames<string> = {
  ru: {
    living_room: 'Гостиная', bedroom: 'Спальня', kitchen: 'Кухня', bathroom: 'Ванная',
    dining_room: 'Столовая', home_office: 'Кабинет', kids_room: 'Детская',
    hallway: 'Прихожая', studio: 'Студия', outdoor: 'Терраса',
    gym: 'Спортзал', sunroom: 'Оранжерея', nursery: 'Детская (младенец)', garage: 'Гараж/мастерская',
  },
  en: {
    living_room: 'Living room', bedroom: 'Bedroom', kitchen: 'Kitchen', bathroom: 'Bathroom',
    dining_room: 'Dining', home_office: 'Office', kids_room: 'Kids', hallway: 'Hallway',
    studio: 'Studio', outdoor: 'Outdoor',
    gym: 'Home gym', sunroom: 'Sunroom', nursery: 'Nursery', garage: 'Garage/workshop',
  },
  ky: {
    living_room: 'Мейманкана', bedroom: 'Жаткана', kitchen: 'Ашкана', bathroom: 'Ванна',
    dining_room: 'Тамак бөлмөсү', home_office: 'Кабинет', kids_room: 'Балдар',
    hallway: 'Коридор', studio: 'Студия', outdoor: 'Тышкы',
    gym: 'Спортзал', sunroom: 'Күн бөлмөсү', nursery: 'Бала бөлмөсү', garage: 'Гараж',
  },
};

export const STYLE_LABELS: LocalizedNames<string> = {
  ru: {
    modern: 'Современный', minimalist: 'Минимализм', scandinavian: 'Скандинавский',
    industrial: 'Лофт', bohemian: 'Бохо', midcentury: 'Mid-century',
    farmhouse: 'Фермерский', luxury: 'Люкс', coastal: 'Морской', japanese: 'Japandi',
    artdeco: 'Ар-деко', rustic: 'Рустик', tropical: 'Тропики', classic: 'Классика',
    mediterranean: 'Средиземноморский', wabi_sabi: 'Wabi-sabi', cottagecore: 'Коттеджный', maximalist: 'Максимализм',
  },
  en: {
    modern: 'Modern', minimalist: 'Minimalist', scandinavian: 'Scandinavian',
    industrial: 'Industrial', bohemian: 'Bohemian', midcentury: 'Mid-century',
    farmhouse: 'Farmhouse', luxury: 'Luxury', coastal: 'Coastal', japanese: 'Japandi',
    artdeco: 'Art Deco', rustic: 'Rustic', tropical: 'Tropical', classic: 'Classic',
    mediterranean: 'Mediterranean', wabi_sabi: 'Wabi-sabi', cottagecore: 'Cottagecore', maximalist: 'Maximalist',
  },
  ky: {
    modern: 'Заманбап', minimalist: 'Минимализм', scandinavian: 'Скандинав',
    industrial: 'Лофт', bohemian: 'Бохо', midcentury: 'Mid-century',
    farmhouse: 'Фермалык', luxury: 'Люкс', coastal: 'Деңиз', japanese: 'Japandi',
    artdeco: 'Ар-деко', rustic: 'Рустик', tropical: 'Тропик', classic: 'Классика',
    mediterranean: 'Жер орто деңизи', wabi_sabi: 'Wabi-sabi', cottagecore: 'Коттедж', maximalist: 'Максимализм',
  },
};

export const STYLE_DESCRIPTIONS: LocalizedNames<string> = {
  ru: {
    modern: 'Чистые линии, актуальные тренды', minimalist: 'Лаконично и функционально',
    scandinavian: 'Светлое дерево, уют', industrial: 'Кирпич, металл, бетон',
    bohemian: 'Текстиль, узоры, растения', midcentury: 'Ретро 50-60-х',
    farmhouse: 'Дерево, винтаж, кантри', luxury: 'Мрамор, золото, шик',
    coastal: 'Бело-голубая палитра', japanese: 'Дзен и натуральность',
    artdeco: 'Геометрия и гламур', rustic: 'Дерево и камень',
    tropical: 'Растения и ротанг', classic: 'Резьба и элегантность',
    mediterranean: 'Терракота, арки, камень', wabi_sabi: 'Несовершенство и природа',
    cottagecore: 'Цветы, винтаж, уют', maximalist: 'Много, ярко, эклектично',
  },
  en: {
    modern: 'Clean lines, current trends', minimalist: 'Simple and functional',
    scandinavian: 'Light wood, hygge', industrial: 'Brick, metal, concrete',
    bohemian: 'Textiles, patterns, plants', midcentury: 'Retro 50s-60s',
    farmhouse: 'Wood, vintage, country', luxury: 'Marble, gold, glam',
    coastal: 'White and blue palette', japanese: 'Zen and natural',
    artdeco: 'Geometric and glam', rustic: 'Wood and stone',
    tropical: 'Plants and rattan', classic: 'Carved and elegant',
    mediterranean: 'Terracotta, arches, stone', wabi_sabi: 'Imperfection and nature',
    cottagecore: 'Florals, vintage, cozy', maximalist: 'Bold, layered, eclectic',
  },
  ky: {
    modern: 'Заманбап тренддер', minimalist: 'Жөнөкөй жана функционалдуу',
    scandinavian: 'Жеңил жыгач, жайлуулук', industrial: 'Кирпич, металл, бетон',
    bohemian: 'Текстиль, өсүмдүктөр', midcentury: 'Ретро 50-60-чу',
    farmhouse: 'Жыгач, винтаж', luxury: 'Мрамор, алтын',
    coastal: 'Ак-көк палитра', japanese: 'Дзен жана табигый',
    artdeco: 'Геометрия жана гламур', rustic: 'Жыгач жана таш',
    tropical: 'Өсүмдүктөр менен ратан', classic: 'Оймо жана сулуулук',
    mediterranean: 'Терракота, жаалар, таш', wabi_sabi: 'Кемчилик жана табигат',
    cottagecore: 'Гүлдөр, винтаж, жайлуу', maximalist: 'Жарык, катмарлуу, эклектика',
  },
};

export const PALETTE_LABELS: LocalizedNames<string> = {
  ru: {
    warm_neutrals: 'Тёплые нейтральные', cool_neutrals: 'Холодные нейтральные',
    earth_tones: 'Земляные', monochrome: 'Монохром', pastel: 'Пастель',
    jewel_tones: 'Драгоценные камни', ocean_blue: 'Океан', forest_green: 'Лес',
    warm_sunset: 'Закат', cool_lavender: 'Лаванда', bold_red: 'Дерзкий красный',
    charcoal_gold: 'Графит и золото', sage_terracotta: 'Шалфей и терракота',
    navy_brass: 'Синий и латунь', blush_gold: 'Розовый и золото',
    emerald_gold: 'Изумруд и золото',
  },
  en: {
    warm_neutrals: 'Warm neutrals', cool_neutrals: 'Cool neutrals',
    earth_tones: 'Earth tones', monochrome: 'Monochrome', pastel: 'Pastel',
    jewel_tones: 'Jewel tones', ocean_blue: 'Ocean blue', forest_green: 'Forest green',
    warm_sunset: 'Warm sunset', cool_lavender: 'Lavender', bold_red: 'Bold red',
    charcoal_gold: 'Charcoal & gold', sage_terracotta: 'Sage & terracotta',
    navy_brass: 'Navy & brass', blush_gold: 'Blush & gold',
    emerald_gold: 'Emerald & gold',
  },
  ky: {
    warm_neutrals: 'Жылуу бейтарап', cool_neutrals: 'Суук бейтарап',
    earth_tones: 'Жер тондору', monochrome: 'Монохром', pastel: 'Пастель',
    jewel_tones: 'Баалуу таштар', ocean_blue: 'Океан', forest_green: 'Токой',
    warm_sunset: 'Күн батышы', cool_lavender: 'Лаванда', bold_red: 'Кызыл',
    charcoal_gold: 'Графит жана алтын', sage_terracotta: 'Шалфей',
    navy_brass: 'Көк жана жез', blush_gold: 'Кызгылт',
    emerald_gold: 'Зүмүрөт',
  },
};

export const LIGHTING_LABELS: LocalizedNames<string> = {
  ru: { natural_day: 'Дневной', golden_hour: 'Золотой час', evening: 'Вечер', night: 'Ночь', bright: 'Яркий' },
  en: { natural_day: 'Daylight', golden_hour: 'Golden hour', evening: 'Evening', night: 'Night', bright: 'Bright' },
  ky: { natural_day: 'Күндүзгү', golden_hour: 'Алтын саат', evening: 'Кечки', night: 'Түнкү', bright: 'Жарык' },
};

export const CAMERA_LABELS: LocalizedNames<string> = {
  ru: { wide: 'Широкий', standard: 'Стандарт', corner: 'Угол', detail: 'Деталь' },
  en: { wide: 'Wide', standard: 'Standard', corner: 'Corner', detail: 'Detail' },
  ky: { wide: 'Кең', standard: 'Стандарт', corner: 'Бурч', detail: 'Деталь' },
};

export const DENSITY_LABELS: LocalizedNames<string> = {
  ru: { minimal: 'Мало', balanced: 'Баланс', rich: 'Богато' },
  en: { minimal: 'Sparse', balanced: 'Balanced', rich: 'Rich' },
  ky: { minimal: 'Аз', balanced: 'Баланс', rich: 'Мол' },
};

export const MATERIAL_LABELS: LocalizedNames<string> = {
  ru: { default: 'Авто', wood: 'Дерево', marble: 'Мрамор', concrete: 'Бетон', fabric: 'Текстиль', glass: 'Стекло' },
  en: { default: 'Auto', wood: 'Wood', marble: 'Marble', concrete: 'Concrete', fabric: 'Fabric', glass: 'Glass' },
  ky: { default: 'Авто', wood: 'Жыгач', marble: 'Мрамор', concrete: 'Бетон', fabric: 'Кездеме', glass: 'Айнек' },
};

export const MODEL_LABELS: LocalizedNames<string> = {
  ru: { flux: 'Flux (качество)', turbo: 'Turbo (быстро)' },
  en: { flux: 'Flux (quality)', turbo: 'Turbo (fast)' },
  ky: { flux: 'Flux (сапа)', turbo: 'Turbo (тез)' },
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
