export type LanguageCode = 'mr' | 'hi' | 'en'

export const languageLabels: Record<LanguageCode, string> = {
  mr: 'मराठी',
  hi: 'हिंदी',
  en: 'English',
}

export type TranslationKey =
  | 'appTitle'
  | 'appTagline'
  | 'home'
  | 'jobs'
  | 'services'
  | 'profile'
  | 'notifications'
  | 'findWork'
  | 'postWork'
  | 'findService'
  | 'offerService'
  | 'nearbyWork'
  | 'nearbyServices'
  | 'viewAll'
  | 'location'
  | 'today'
  | 'open'
  | 'pending'
  | 'completed'
  | 'trustScore'
  | 'quickActions'
  | 'welcome'
  | 'homeIntro'
  | 'searchPlaceholder'
  | 'language'
  | 'loading'
  | 'emptyTitle'
  | 'emptyDescription'
  | 'errorTitle'
  | 'retry'
  | 'postedBy'
  | 'perDay'
  | 'viewDetails'
  | 'applications'
  | 'myWork'
  | 'settings'
  | 'mainNavigation'
  | 'notificationsUnavailable'

export type TranslationDictionary = Record<TranslationKey, string>

export const translations: Record<LanguageCode, TranslationDictionary> = {
  mr: {
    appTitle: 'गावकाम',
    appTagline: 'आपल्या गावासाठी, आपल्या माणसांसाठी',
    home: 'मुख्यपान',
    jobs: 'काम',
    services: 'सेवा',
    profile: 'माझे प्रोफाइल',
    notifications: 'सूचना',
    findWork: 'काम शोधा',
    postWork: 'काम द्या',
    findService: 'सेवा शोधा',
    offerService: 'सेवा द्या',
    nearbyWork: 'जवळची कामे',
    nearbyServices: 'जवळच्या सेवा',
    viewAll: 'सर्व पहा',
    location: 'सातारा, महाराष्ट्र',
    today: 'आज',
    open: 'उपलब्ध',
    pending: 'प्रलंबित',
    completed: 'पूर्ण',
    trustScore: 'विश्वास गुण',
    quickActions: 'तुम्हाला काय करायचे आहे?',
    welcome: 'नमस्कार, सुरेश!',
    homeIntro: 'आज तुमच्या गावात उपलब्ध असलेल्या संधी पहा.',
    searchPlaceholder: 'काम किंवा सेवा शोधा',
    language: 'भाषा',
    loading: 'लोड होत आहे...',
    emptyTitle: 'सध्या काहीही सापडले नाही',
    emptyDescription: 'तुमचे ठिकाण किंवा फिल्टर बदलून पुन्हा प्रयत्न करा.',
    errorTitle: 'माहिती आणता आली नाही',
    retry: 'पुन्हा प्रयत्न करा',
    postedBy: 'काम देणारे',
    perDay: 'दिवसाला',
    viewDetails: 'तपशील पहा',
    applications: 'अर्ज',
    myWork: 'माझी कामे',
    settings: 'सेटिंग्ज',
    mainNavigation: 'मुख्य नेव्हिगेशन',
    notificationsUnavailable: 'सूचना लवकरच उपलब्ध होतील',
  },
  hi: {
    appTitle: 'गावकाम',
    appTagline: 'आपके गांव के लिए, अपने लोगों के साथ',
    home: 'होम',
    jobs: 'काम',
    services: 'सेवाएं',
    profile: 'मेरी प्रोफ़ाइल',
    notifications: 'सूचनाएं',
    findWork: 'काम ढूंढें',
    postWork: 'काम दें',
    findService: 'सेवा ढूंढें',
    offerService: 'सेवा दें',
    nearbyWork: 'पास के काम',
    nearbyServices: 'पास की सेवाएं',
    viewAll: 'सभी देखें',
    location: 'सातारा, महाराष्ट्र',
    today: 'आज',
    open: 'उपलब्ध',
    pending: 'लंबित',
    completed: 'पूरा',
    trustScore: 'भरोसा अंक',
    quickActions: 'आप क्या करना चाहते हैं?',
    welcome: 'नमस्ते, सुरेश!',
    homeIntro: 'आज आपके गांव में उपलब्ध अवसर देखें।',
    searchPlaceholder: 'काम या सेवा खोजें',
    language: 'भाषा',
    loading: 'लोड हो रहा है...',
    emptyTitle: 'अभी कुछ नहीं मिला',
    emptyDescription: 'अपना स्थान या फ़िल्टर बदलकर फिर कोशिश करें।',
    errorTitle: 'जानकारी नहीं ला सके',
    retry: 'फिर कोशिश करें',
    postedBy: 'काम देने वाले',
    perDay: 'प्रतिदिन',
    viewDetails: 'विवरण देखें',
    applications: 'आवेदन',
    myWork: 'मेरे काम',
    settings: 'सेटिंग्स',
    mainNavigation: 'नेविगेशन',
    notificationsUnavailable: 'सूचनाएं जल्द उपलब्ध होंगी',
  },
  en: {
    appTitle: 'GaavKaam',
    appTagline: 'For your village, with your people',
    home: 'Home',
    jobs: 'Jobs',
    services: 'Services',
    profile: 'My profile',
    notifications: 'Notifications',
    findWork: 'Find work',
    postWork: 'Post work',
    findService: 'Find a service',
    offerService: 'Offer a service',
    nearbyWork: 'Nearby work',
    nearbyServices: 'Nearby services',
    viewAll: 'View all',
    location: 'Satara, Maharashtra',
    today: 'Today',
    open: 'Available',
    pending: 'Pending',
    completed: 'Completed',
    trustScore: 'Trust score',
    quickActions: 'What would you like to do?',
    welcome: 'Hello, Suresh!',
    homeIntro: 'See opportunities available in your village today.',
    searchPlaceholder: 'Search for work or a service',
    language: 'Language',
    loading: 'Loading...',
    emptyTitle: 'Nothing found yet',
    emptyDescription: 'Try changing your location or filters.',
    errorTitle: 'Could not load this information',
    retry: 'Try again',
    postedBy: 'Posted by',
    perDay: 'per day',
    viewDetails: 'View details',
    applications: 'Applications',
    myWork: 'My work',
    settings: 'Settings',
    mainNavigation: 'Main navigation',
    notificationsUnavailable: 'Notifications will be available soon',
  },
}
