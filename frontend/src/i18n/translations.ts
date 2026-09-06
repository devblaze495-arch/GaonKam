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
  | 'continue'
  | 'back'
  | 'skip'
  | 'onboardingWelcomeTitle'
  | 'onboardingWelcomeDescription'
  | 'onboardingFindWorkTitle'
  | 'onboardingFindWorkDescription'
  | 'onboardingPostWorkTitle'
  | 'onboardingPostWorkDescription'
  | 'onboardingServicesTitle'
  | 'onboardingServicesDescription'
  | 'onboardingLanguageTitle'
  | 'onboardingLanguageDescription'
  | 'loginTitle'
  | 'loginDescription'
  | 'mobileNumber'
  | 'mobileNumberPlaceholder'
  | 'mobileContinue'
  | 'mobileRequired'
  | 'mobileInvalid'
  | 'otpTitle'
  | 'otpDescription'
  | 'otpSentTo'
  | 'otpPlaceholder'
  | 'verifyOtp'
  | 'resendOtp'
  | 'resendIn'
  | 'otpRequired'
  | 'otpInvalid'
  | 'changeNumber'
  | 'profileSetupTitle'
  | 'profileSetupDescription'
  | 'fullName'
  | 'fullNamePlaceholder'
  | 'village'
  | 'villagePlaceholder'
  | 'taluka'
  | 'talukaPlaceholder'
  | 'district'
  | 'districtPlaceholder'
  | 'chooseLanguage'
  | 'saveContinue'
  | 'nameRequired'
  | 'nameTooShort'
  | 'villageRequired'
  | 'talukaRequired'
  | 'districtRequired'
  | 'intentTitle'
  | 'intentDescription'
  | 'findWorkIntent'
  | 'postWorkIntent'
  | 'findServiceIntent'
  | 'offerServiceIntent'
  | 'intentHint'
  | 'intentRequired'
  | 'finishSetup'
  | 'successTitle'
  | 'successDescription'
  | 'goToHome'
  | 'authLoading'
  | 'authError'
  | 'changeLanguage'

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
    continue: 'पुढे चला',
    back: 'मागे',
    skip: 'वगळा',
    onboardingWelcomeTitle: 'गावकाममध्ये आपले स्वागत आहे',
    onboardingWelcomeDescription: 'आपल्या गावातील कामे आणि स्थानिक सेवा एका सोप्या ठिकाणी शोधा.',
    onboardingFindWorkTitle: 'काम शोधा',
    onboardingFindWorkDescription: 'तुमच्या जवळची कामे पहा आणि तुमच्यासाठी योग्य संधी शोधा.',
    onboardingPostWorkTitle: 'काम द्या',
    onboardingPostWorkDescription: 'तुमचे काम सांगा आणि योग्य कामगार तुमच्या गावात शोधा.',
    onboardingServicesTitle: 'सेवा शोधा किंवा द्या',
    onboardingServicesDescription: 'आपल्या गावातील लोकांकडून सेवा घ्या किंवा तुमची कला आणि सेवा इतरांना द्या.',
    onboardingLanguageTitle: 'तुमची भाषा निवडा',
    onboardingLanguageDescription: 'तुम्ही ही भाषा नंतर कधीही बदलू शकता.',
    loginTitle: 'गावकाममध्ये प्रवेश करा',
    loginDescription: 'तुमचा मोबाइल नंबर वापरून पुढे चला.',
    mobileNumber: 'मोबाइल नंबर',
    mobileNumberPlaceholder: '१० अंकी मोबाइल नंबर',
    mobileContinue: 'पुढे चला',
    mobileRequired: 'मोबाइल नंबर टाका.',
    mobileInvalid: 'कृपया योग्य १० अंकी मोबाइल नंबर टाका.',
    otpTitle: 'मोबाइल नंबर तपासा',
    otpDescription: 'तुमच्या मोबाइलवर आलेला ६ अंकी कोड टाका.',
    otpSentTo: 'कोड पाठवला आहे',
    otpPlaceholder: '६ अंकी कोड',
    verifyOtp: 'कोड तपासा',
    resendOtp: 'कोड पुन्हा पाठवा',
    resendIn: 'पुन्हा पाठवण्यासाठी थांबा',
    otpRequired: '६ अंकी कोड टाका.',
    otpInvalid: 'कोड चुकीचा आहे. पुन्हा प्रयत्न करा.',
    changeNumber: 'मोबाइल नंबर बदला',
    profileSetupTitle: 'तुमची माहिती सांगा',
    profileSetupDescription: 'तुमच्यासाठी योग्य कामे आणि सेवा दाखवण्यासाठी ही माहिती आवश्यक आहे.',
    fullName: 'पूर्ण नाव',
    fullNamePlaceholder: 'तुमचे नाव',
    village: 'गाव',
    villagePlaceholder: 'तुमचे गाव',
    taluka: 'तालुका',
    talukaPlaceholder: 'तुमचा तालुका',
    district: 'जिल्हा',
    districtPlaceholder: 'तुमचा जिल्हा',
    chooseLanguage: 'आवडती भाषा',
    saveContinue: 'माहिती जतन करा',
    nameRequired: 'तुमचे नाव टाका.',
    nameTooShort: 'नाव किमान २ अक्षरांचे असावे.',
    villageRequired: 'तुमचे गाव टाका.',
    talukaRequired: 'तुमचा तालुका टाका.',
    districtRequired: 'तुमचा जिल्हा टाका.',
    intentTitle: 'तुम्हाला काय करायचे आहे?',
    intentDescription: 'एक किंवा अधिक पर्याय निवडा. हे पर्याय तुम्ही नंतर बदलू शकता.',
    findWorkIntent: 'काम शोधायचे आहे',
    postWorkIntent: 'काम द्यायचे आहे',
    findServiceIntent: 'सेवा शोधायची आहे',
    offerServiceIntent: 'सेवा द्यायची आहे',
    intentHint: 'तुम्ही सर्व पर्याय निवडू शकता.',
    intentRequired: 'किमान एक पर्याय निवडा.',
    finishSetup: 'गावकाम सुरू करा',
    successTitle: 'गावकाममध्ये स्वागत आहे!',
    successDescription: 'तुमचे प्रोफाइल तयार आहे. आता तुमच्या गावातील संधी पहा.',
    goToHome: 'गावकामवर जा',
    authLoading: 'थोडा वेळ थांबा...',
    authError: 'काहीतरी चुकले. पुन्हा प्रयत्न करा.',
    changeLanguage: 'भाषा बदला',
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
    continue: 'आगे बढ़ें',
    back: 'पीछे',
    skip: 'छोड़ें',
    onboardingWelcomeTitle: 'गांवकाम में आपका स्वागत है',
    onboardingWelcomeDescription: 'अपने गांव में काम और स्थानीय सेवाएं एक आसान जगह पर खोजें।',
    onboardingFindWorkTitle: 'काम ढूंढें',
    onboardingFindWorkDescription: 'अपने पास के काम देखें और अपने लिए सही अवसर चुनें।',
    onboardingPostWorkTitle: 'काम दें',
    onboardingPostWorkDescription: 'अपने काम के बारे में बताएं और अपने गांव में सही कामगार खोजें।',
    onboardingServicesTitle: 'सेवा ढूंढें या दें',
    onboardingServicesDescription: 'अपने गांव के लोगों से सेवा लें या अपनी कला और सेवा दूसरों तक पहुंचाएं।',
    onboardingLanguageTitle: 'अपनी भाषा चुनें',
    onboardingLanguageDescription: 'आप यह भाषा बाद में कभी भी बदल सकते हैं।',
    loginTitle: 'गांवकाम में प्रवेश करें',
    loginDescription: 'अपने मोबाइल नंबर से आगे बढ़ें।',
    mobileNumber: 'मोबाइल नंबर',
    mobileNumberPlaceholder: '१० अंकों का मोबाइल नंबर',
    mobileContinue: 'आगे बढ़ें',
    mobileRequired: 'मोबाइल नंबर डालें।',
    mobileInvalid: 'कृपया सही १० अंकों का मोबाइल नंबर डालें।',
    otpTitle: 'मोबाइल नंबर जांचें',
    otpDescription: 'अपने मोबाइल पर आया ६ अंकों का कोड डालें।',
    otpSentTo: 'कोड भेजा गया है',
    otpPlaceholder: '६ अंकों का कोड',
    verifyOtp: 'कोड जांचें',
    resendOtp: 'कोड फिर भेजें',
    resendIn: 'फिर भेजने के लिए रुकें',
    otpRequired: '६ अंकों का कोड डालें।',
    otpInvalid: 'कोड सही नहीं है। फिर कोशिश करें।',
    changeNumber: 'मोबाइल नंबर बदलें',
    profileSetupTitle: 'अपनी जानकारी बताएं',
    profileSetupDescription: 'आपके लिए सही काम और सेवाएं दिखाने के लिए यह जानकारी जरूरी है।',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'आपका नाम',
    village: 'गांव',
    villagePlaceholder: 'आपका गांव',
    taluka: 'तालुका',
    talukaPlaceholder: 'आपका तालुका',
    district: 'जिला',
    districtPlaceholder: 'आपका जिला',
    chooseLanguage: 'पसंदीदा भाषा',
    saveContinue: 'जानकारी सहेजें',
    nameRequired: 'अपना नाम डालें।',
    nameTooShort: 'नाम कम से कम २ अक्षरों का होना चाहिए।',
    villageRequired: 'अपना गांव डालें।',
    talukaRequired: 'अपना तालुका डालें।',
    districtRequired: 'अपना जिला डालें।',
    intentTitle: 'आप क्या करना चाहते हैं?',
    intentDescription: 'एक या अधिक विकल्प चुनें। आप इन्हें बाद में बदल सकते हैं।',
    findWorkIntent: 'काम ढूंढना है',
    postWorkIntent: 'काम देना है',
    findServiceIntent: 'सेवा ढूंढनी है',
    offerServiceIntent: 'सेवा देनी है',
    intentHint: 'आप सभी विकल्प चुन सकते हैं।',
    intentRequired: 'कम से कम एक विकल्प चुनें।',
    finishSetup: 'गांवकाम शुरू करें',
    successTitle: 'गांवकाम में आपका स्वागत है!',
    successDescription: 'आपकी प्रोफ़ाइल तैयार है। अब अपने गांव के अवसर देखें।',
    goToHome: 'गांवकाम पर जाएं',
    authLoading: 'थोड़ा इंतजार करें...',
    authError: 'कुछ गलत हुआ। फिर कोशिश करें।',
    changeLanguage: 'भाषा बदलें',
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
    continue: 'Continue',
    back: 'Back',
    skip: 'Skip',
    onboardingWelcomeTitle: 'Welcome to GaavKaam',
    onboardingWelcomeDescription: 'Find work and local services in your village, all in one simple place.',
    onboardingFindWorkTitle: 'Find work',
    onboardingFindWorkDescription: 'See nearby work and choose opportunities that suit you.',
    onboardingPostWorkTitle: 'Post work',
    onboardingPostWorkDescription: 'Share your work need and find the right worker in your village.',
    onboardingServicesTitle: 'Find or offer services',
    onboardingServicesDescription: 'Get help from local people or offer your skills and services to others.',
    onboardingLanguageTitle: 'Choose your language',
    onboardingLanguageDescription: 'You can change this language anytime later.',
    loginTitle: 'Enter GaavKaam',
    loginDescription: 'Continue with your mobile number.',
    mobileNumber: 'Mobile number',
    mobileNumberPlaceholder: '10-digit mobile number',
    mobileContinue: 'Continue',
    mobileRequired: 'Enter your mobile number.',
    mobileInvalid: 'Enter a valid 10-digit mobile number.',
    otpTitle: 'Check your mobile number',
    otpDescription: 'Enter the 6-digit code sent to your mobile.',
    otpSentTo: 'Code sent to',
    otpPlaceholder: '6-digit code',
    verifyOtp: 'Verify code',
    resendOtp: 'Resend code',
    resendIn: 'Wait before resending',
    otpRequired: 'Enter the 6-digit code.',
    otpInvalid: 'That code is not correct. Try again.',
    changeNumber: 'Change mobile number',
    profileSetupTitle: 'Tell us about yourself',
    profileSetupDescription: 'This helps us show work and services that are useful to you.',
    fullName: 'Full name',
    fullNamePlaceholder: 'Your name',
    village: 'Village',
    villagePlaceholder: 'Your village',
    taluka: 'Taluka',
    talukaPlaceholder: 'Your taluka',
    district: 'District',
    districtPlaceholder: 'Your district',
    chooseLanguage: 'Preferred language',
    saveContinue: 'Save and continue',
    nameRequired: 'Enter your name.',
    nameTooShort: 'Your name should have at least 2 letters.',
    villageRequired: 'Enter your village.',
    talukaRequired: 'Enter your taluka.',
    districtRequired: 'Enter your district.',
    intentTitle: 'What would you like to do?',
    intentDescription: 'Choose one or more options. You can change them later.',
    findWorkIntent: 'Find work',
    postWorkIntent: 'Post work',
    findServiceIntent: 'Find a service',
    offerServiceIntent: 'Offer a service',
    intentHint: 'You can choose all the options.',
    intentRequired: 'Choose at least one option.',
    finishSetup: 'Start using GaavKaam',
    successTitle: 'Welcome to GaavKaam!',
    successDescription: 'Your profile is ready. See opportunities in your village now.',
    goToHome: 'Go to GaavKaam',
    authLoading: 'Please wait...',
    authError: 'Something went wrong. Try again.',
    changeLanguage: 'Change language',
  },
}
