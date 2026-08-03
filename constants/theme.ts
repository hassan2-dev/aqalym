export const Colors = {
  primary: '#1E275E',
  secondary: '#6E7078',
  accent: '#B08A5A',
  background: '#F7F8FA',
  card: '#FFFFFF',
  white: '#FFFFFF',
  black: '#0A0A0A',
  border: '#E8EAEE',
  success: '#2E7D4F',
  warning: '#C4912E',
  error: '#C44536',
  info: '#3B6BA5',
  text: {
    primary: '#1E275E',
    secondary: '#6E7078',
    muted: '#9A9CA3',
    inverse: '#FFFFFF',
  },
  dark: {
    background: '#0F1115',
    card: '#1A1C22',
    border: '#2A2D36',
    text: {
      primary: '#F2F3F7',
      secondary: '#A0A3AD',
      muted: '#6E7078',
    },
  },
} as const;

export const ORDER_STATUS_META: Record<
  string,
  { label: string; labelAr: string; color: string; bg: string; step: number }
> = {
  submitted: {
    label: 'تم الإرسال',
    labelAr: 'تم الإرسال',
    color: '#3B6BA5',
    bg: '#E8F0F8',
    step: 0,
  },
  under_review: {
    label: 'قيد المراجعة',
    labelAr: 'قيد المراجعة',
    color: '#7A5C9E',
    bg: '#F0EAF5',
    step: 1,
  },
  approved: {
    label: 'تمت الموافقة',
    labelAr: 'تمت الموافقة',
    color: '#2E7D4F',
    bg: '#E6F4EC',
    step: 2,
  },
  sent_to_factory: {
    label: 'أُرسل للمصنع',
    labelAr: 'أُرسل للمصنع',
    color: '#1E275E',
    bg: '#EEF0F7',
    step: 3,
  },
  in_production: {
    label: 'قيد التصنيع',
    labelAr: 'قيد التصنيع',
    color: '#B08A5A',
    bg: '#F8F4EF',
    step: 4,
  },
  ready: {
    label: 'جاهز',
    labelAr: 'جاهز',
    color: '#2A9D8F',
    bg: '#E6F6F4',
    step: 5,
  },
  transport: {
    label: 'النقل',
    labelAr: 'النقل',
    color: '#457B9D',
    bg: '#EAF2F7',
    step: 6,
  },
  installation: {
    label: 'التركيب',
    labelAr: 'التركيب',
    color: '#C4912E',
    bg: '#FBF3E3',
    step: 7,
  },
  completed: {
    label: 'مكتمل',
    labelAr: 'مكتمل',
    color: '#1B7A3D',
    bg: '#E4F5EA',
    step: 8,
  },
  cancelled: {
    label: 'ملغي',
    labelAr: 'ملغي',
    color: '#C44536',
    bg: '#F9EBE9',
    step: -1,
  },
};

export const ORDER_TIMELINE_STEPS = [
  'submitted',
  'under_review',
  'approved',
  'sent_to_factory',
  'in_production',
  'ready',
  'transport',
  'installation',
  'completed',
] as const;

export const IRAQ_GOVERNORATES = [
  { id: 'baghdad', name: 'بغداد', cities: ['الكرخ', 'الرصافة', 'الكرادة', 'المنصور', 'الأعظمية', 'الدورة'] },
  { id: 'basra', name: 'البصرة', cities: ['المركز', 'الزبير', 'أبو الخصيب', 'القرنة', 'شط العرب'] },
  { id: 'nineveh', name: 'نينوى', cities: ['الموصل', 'تلكيف', 'الحمدانية', 'سنجار'] },
  { id: 'erbil', name: 'أربيل', cities: ['المركز', 'شقلاوة', 'كويسنجق', 'سوران'] },
  { id: 'sulaymaniyah', name: 'السليمانية', cities: ['المركز', 'رانية', 'حلبجة', 'دوكان'] },
  { id: 'duhok', name: 'دهوك', cities: ['المركز', 'زاخو', 'عمادية', 'سميل'] },
  { id: 'kirkuk', name: 'كركوك', cities: ['المركز', 'داقوق', 'الحويجة'] },
  { id: 'najaf', name: 'النجف', cities: ['المركز', 'الكوفة', 'المناذرة'] },
  { id: 'karbala', name: 'كربلاء', cities: ['المركز', 'الهندية', 'عين التمر'] },
  { id: 'babylon', name: 'بابل', cities: ['الحلة', 'المسيب', 'المحاويل', 'الهاشمية'] },
  { id: 'wasit', name: 'واسط', cities: ['الكوت', 'الصويرة', 'الحي', 'النعمانية'] },
  { id: 'diyala', name: 'ديالى', cities: ['بعقوبة', 'المقدادية', 'الخالص', 'خانقين'] },
  { id: 'anbar', name: 'الأنبار', cities: ['الرمادي', 'الفلوجة', 'هيت', 'حديثة'] },
  { id: 'saladin', name: 'صلاح الدين', cities: ['تكريت', 'سامراء', 'بيجي', 'بلد'] },
  { id: 'qadisiyyah', name: 'القادسية', cities: ['الديوانية', 'عفك', 'الشامية'] },
  { id: 'maysan', name: 'ميسان', cities: ['العمارة', 'المجر الكبير', 'قلعة صالح'] },
  { id: 'muthanna', name: 'المثنى', cities: ['السماوة', 'الرميثة', 'الخضر'] },
  { id: 'dhi_qar', name: 'ذي قار', cities: ['الناصرية', 'الشطرة', 'سوق الشيوخ'] },
] as const;

export const COMPANY = {
  name: 'أقاليم',
  nameAr: 'أقاليم',
  tagline: 'أنظمة ألمنيوم معمارية فاخرة',
  phone: '+964 770 000 0000',
  email: 'info@aqalym.iq',
  website: 'https://aqalym.iq',
  address: 'بغداد، العراق',
  whatsapp: '+9647700000000',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;
