export type LanguageCode = 'mr' | 'hi' | 'en'

export const translations: Record<LanguageCode, Record<string, string>> = {
  mr: {
    appTitle: 'गावकाम',
    headline: 'स्थानीय काम, सेवां आणि विश्वासपूर्ण सामर्थ्याची एक ठिकाणे.',
    subheadline:
      'गावातील मजूर, सेवा देणारे आणि काम मागणारे यांना जोडणारी समजूतदार प्लॅटफॉर्म.',
    primaryCta: 'काम शोधा',
    secondaryCta: 'सेवा पाहिजे आहे',
    statsTitle: 'प्रमुख वैशिष्ट्ये',
    jobs: 'काम',
    services: 'सेवा',
    trust: 'विश्वास',
    local: 'स्थानिक',
    userFlow: 'प्रकार: काम, सेवा, वाहन, रेटिंग आणि विश्वास प्रणाली',
  },
  hi: {
    appTitle: 'गावकाम',
    headline: 'स्थानीय काम, सेवाएं और भरोसेमंद सहयोग का मंच।',
    subheadline:
      'गांव के श्रमिकों, सेवा प्रदाताओं और ज़रूरतमंद लोगों को जोड़ने वाला सरल प्लेटफ़ॉर्म।',
    primaryCta: 'काम ढूंढें',
    secondaryCta: 'सेवा चाहिए',
    statsTitle: 'मुख्य सुविधाएँ',
    jobs: 'काम',
    services: 'सेवाएं',
    trust: 'भरोसा',
    local: 'स्थानीय',
    userFlow: 'प्रकार: काम, सेवा, वाहन, रेटिंग और ट्रस्ट सिस्टम',
  },
  en: {
    appTitle: 'GaavKaam',
    headline: 'A trusted local network for jobs, services, and community work.',
    subheadline:
      'Connecting rural workers, local service providers, and people needing support in one practical platform.',
    primaryCta: 'Find work',
    secondaryCta: 'Need a service',
    statsTitle: 'Key features',
    jobs: 'Jobs',
    services: 'Services',
    trust: 'Trust',
    local: 'Local',
    userFlow: 'Built for work, services, vehicles, ratings, and trust tracking',
  },
}
