import type { Job, Service, JobLocation } from '../types'

type LegacyJob = Omit<Job, 'locationDetails' | 'distanceKm'>

const rawNearbyJobs: LegacyJob[] = [
  {
    id: 'job-1',
    title: { mr: 'ऊस कापणीसाठी मदतनीस', hi: 'गन्ने की कटाई के लिए मददगार', en: 'Sugarcane harvesting helper' },
    description: { mr: 'शेतात ऊस कापणीसाठी दोन मदतनीस हवे आहेत.', hi: 'खेत में गन्ने की कटाई के लिए दो मददगार चाहिए।', en: 'Two helpers are needed for sugarcane harvesting.' },
    category: { mr: 'शेती', hi: 'खेती', en: 'Farming' },
    location: { mr: 'कराड, सातारा', hi: 'कराड, सातारा', en: 'Karad, Satara' },
    distance: { mr: '२.४ किमी', hi: '२.४ किमी', en: '2.4 km' },
    payment: { mr: '₹६५०', hi: '₹६५०', en: '₹650' },
    dateLabel: { mr: 'उद्या, सकाळी ७:००', hi: 'कल, सुबह ७:०० बजे', en: 'Tomorrow, 7:00 AM' },
    postedBy: { mr: 'प्रकाश पाटील', hi: 'प्रकाश पाटील', en: 'Prakash Patil' },
    status: 'open',
    categoryId: 'agriculture', requiredSkillIds: ['farming', 'general-labor'], paymentDetails: { amount: 650, type: 'daily' }, schedule: { date: '2026-09-10', time: '07:00' }, employer: { name: { mr: 'प्रकाश पाटील', hi: 'प्रकाश पाटील', en: 'Prakash Patil' }, location: { mr: 'कराड', hi: 'कराड', en: 'Karad' }, trustScore: 91, rating: 4.7, reviewCount: 18 }, workersRequired: 2, postedAt: '2026-09-06T08:00:00.000Z',
  },
  {
    id: 'job-2',
    title: { mr: 'घराच्या भिंतीला रंगकाम', hi: 'घर की दीवारों पर रंगकाम', en: 'House wall painting' },
    description: { mr: 'दोन खोल्यांच्या भिंतींना रंग देण्यासाठी कामगार हवा आहे.', hi: 'दो कमरों की दीवारों पर रंग करने के लिए कामगार चाहिए।', en: 'A worker is needed to paint the walls of two rooms.' },
    category: { mr: 'बांधकाम', hi: 'निर्माण', en: 'Construction' },
    location: { mr: 'मलकापूर, सातारा', hi: 'मलकापुर, सातारा', en: 'Malkapur, Satara' },
    distance: { mr: '५.१ किमी', hi: '५.१ किमी', en: '5.1 km' },
    payment: { mr: '₹८००', hi: '₹८००', en: '₹800' },
    dateLabel: { mr: '१२ ऑक्टोबर', hi: '१२ अक्टूबर', en: '12 October' },
    postedBy: { mr: 'सविता जाधव', hi: 'सविता जाधव', en: 'Savita Jadhav' },
    status: 'open',
    categoryId: 'construction', requiredSkillIds: ['painting', 'general-labor'], paymentDetails: { amount: 800, type: 'daily' }, schedule: { date: '2026-09-12', time: '09:00' }, employer: { name: { mr: 'सविता जाधव', hi: 'सविता जाधव', en: 'Savita Jadhav' }, location: { mr: 'मलकापूर', hi: 'मलकापुर', en: 'Malkapur' }, trustScore: 87, rating: 4.5, reviewCount: 12 }, workersRequired: 1, postedAt: '2026-09-05T10:30:00.000Z',
  },
  {
    id: 'job-3', title: { mr: 'भाजीपाला तोडणीसाठी मजूर', hi: 'सब्ज़ी तोड़ने के लिए मजदूर', en: 'Vegetable harvesting workers' }, description: { mr: 'भाजीपाला तोडणी आणि वर्गीकरणासाठी मजूर आवश्यक आहेत. सकाळी शेतावर पोहोचणे आवश्यक.', hi: 'सब्ज़ी तोड़ने और छांटने के लिए मजदूर चाहिए। सुबह खेत पर पहुंचना होगा।', en: 'Workers needed for vegetable harvesting and sorting. Please reach the farm in the morning.' }, category: { mr: 'शेती', hi: 'खेती', en: 'Farming' }, location: { mr: 'फलटण, सातारा', hi: 'फलटण, सातारा', en: 'Phaltan, Satara' }, distance: { mr: '८ किमी', hi: '८ किमी', en: '8 km' }, payment: { mr: '₹७००', hi: '₹७००', en: '₹700' }, dateLabel: { mr: 'आज, सकाळी ८:००', hi: 'आज, सुबह ८:०० बजे', en: 'Today, 8:00 AM' }, postedBy: { mr: 'मंगेश मोरे', hi: 'मंगेश मोरे', en: 'Mangesh More' }, status: 'open', categoryId: 'agriculture', requiredSkillIds: ['farming'], paymentDetails: { amount: 700, type: 'daily' }, schedule: { date: '2026-09-06', time: '08:00' }, employer: { name: { mr: 'मंगेश मोरे', hi: 'मंगेश मोरे', en: 'Mangesh More' }, location: { mr: 'फलटण', hi: 'फलटण', en: 'Phaltan' }, trustScore: 84, rating: 4.4, reviewCount: 9 }, workersRequired: 3, postedAt: '2026-09-04T09:00:00.000Z',
  },
  {
    id: 'job-4', title: { mr: 'गवंडी कामासाठी मदतनीस', hi: 'राजमिस्त्री के लिए मददगार', en: 'Masonry helper' }, description: { mr: 'घराच्या बांधकामासाठी गवंडीच्या हाताखाली मदतनीस हवा आहे.', hi: 'घर के निर्माण के लिए राजमिस्त्री के साथ मददगार चाहिए।', en: 'A helper is needed to assist with house construction.' }, category: { mr: 'बांधकाम', hi: 'निर्माण', en: 'Construction' }, location: { mr: 'पाटण, सातारा', hi: 'पाटन, सातारा', en: 'Patan, Satara' }, distance: { mr: '१२ किमी', hi: '१२ किमी', en: '12 km' }, payment: { mr: '₹१,०००', hi: '₹१,०००', en: '₹1,000' }, dateLabel: { mr: '१५ सप्टेंबर', hi: '१५ सितंबर', en: '15 September' }, postedBy: { mr: 'रमेश पाटील', hi: 'रमेश पाटील', en: 'Ramesh Patil' }, status: 'open', categoryId: 'construction', requiredSkillIds: ['masonry', 'general-labor'], paymentDetails: { amount: 1000, type: 'daily' }, schedule: { date: '2026-09-15', time: '08:30' }, employer: { name: { mr: 'रमेश पाटील', hi: 'रमेश पाटील', en: 'Ramesh Patil' }, location: { mr: 'पाटण', hi: 'पाटन', en: 'Patan' }, trustScore: 90, rating: 4.7, reviewCount: 18 }, workersRequired: 1, postedAt: '2026-09-03T12:00:00.000Z',
  },
  {
    id: 'job-5', title: { mr: 'गाईंची देखभाल', hi: 'गायों की देखभाल', en: 'Cattle care helper' }, description: { mr: 'सकाळी आणि संध्याकाळी जनावरांची देखभाल करण्यासाठी व्यक्ती हवी आहे.', hi: 'सुबह और शाम पशुओं की देखभाल के लिए व्यक्ति चाहिए।', en: 'A person is needed to care for cattle in the morning and evening.' }, category: { mr: 'घरकाम', hi: 'घर का काम', en: 'Household' }, location: { mr: 'कोरेगाव, सातारा', hi: 'कोरेगांव, सातारा', en: 'Koregaon, Satara' }, distance: { mr: '१८ किमी', hi: '१८ किमी', en: '18 km' }, payment: { mr: '₹६००', hi: '₹६००', en: '₹600' }, dateLabel: { mr: 'उद्या', hi: 'कल', en: 'Tomorrow' }, postedBy: { mr: 'सुनीता शिंदे', hi: 'सुनीता शिंदे', en: 'Sunita Shinde' }, status: 'expired', categoryId: 'household', requiredSkillIds: ['animal-care'], paymentDetails: { amount: 600, type: 'daily' }, schedule: { date: '2026-09-07', time: '06:30' }, employer: { name: { mr: 'सुनीता शिंदे', hi: 'सुनीता शिंदे', en: 'Sunita Shinde' }, location: { mr: 'कोरेगाव', hi: 'कोरेगांव', en: 'Koregaon' }, trustScore: 79, rating: 4.2, reviewCount: 7 }, workersRequired: 1, postedAt: '2026-08-30T08:00:00.000Z',
  },
]

const jobLocations: Record<string, { locationDetails: JobLocation; distanceKm: number }> = {
  'job-1': { locationDetails: { village: { mr: 'लवेल', hi: 'लवेल', en: 'Lavel' }, taluka: { mr: 'खेड', hi: 'खेड़', en: 'Khed' }, district: { mr: 'रत्नागिरी', hi: 'रत्नागिरी', en: 'Ratnagiri' } }, distanceKm: 1.2 },
  'job-2': { locationDetails: { village: { mr: 'लवेल', hi: 'लवेल', en: 'Lavel' }, taluka: { mr: 'खेड', hi: 'खेड़', en: 'Khed' }, district: { mr: 'रत्नागिरी', hi: 'रत्नागिरी', en: 'Ratnagiri' } }, distanceKm: 3 },
  'job-3': { locationDetails: { village: { mr: 'चिपळूण', hi: 'चिपलून', en: 'Chiplun' }, taluka: { mr: 'खेड', hi: 'खेड़', en: 'Khed' }, district: { mr: 'रत्नागिरी', hi: 'रत्नागिरी', en: 'Ratnagiri' } }, distanceKm: 7 },
  'job-4': { locationDetails: { village: { mr: 'लवेल', hi: 'लवेल', en: 'Lavel' }, taluka: { mr: 'खेड', hi: 'खेड़', en: 'Khed' }, district: { mr: 'पुणे', hi: 'पुणे', en: 'Pune' } }, distanceKm: 60 },
  'job-5': { locationDetails: { village: { mr: 'कराड', hi: 'कराड', en: 'Karad' }, taluka: { mr: 'कराड', hi: 'कराड', en: 'Karad' }, district: { mr: 'सातारा', hi: 'सातारा', en: 'Satara' } }, distanceKm: 80 },
}

const localizedLocation = (location: JobLocation) => ({
  mr: `${location.village.mr}, ${location.district.mr}`,
  hi: `${location.village.hi}, ${location.district.hi}`,
  en: `${location.village.en}, ${location.district.en}`,
})

export const nearbyJobs: Job[] = rawNearbyJobs.map((job) => {
  const location = jobLocations[job.id] ?? { locationDetails: { village: { mr: 'कराड', hi: 'कराड', en: 'Karad' }, taluka: { mr: 'कराड', hi: 'कराड', en: 'Karad' }, district: { mr: 'सातारा', hi: 'सातारा', en: 'Satara' } }, distanceKm: 20 }
  return { ...job, locationDetails: location.locationDetails, distanceKm: location.distanceKm, location: localizedLocation(location.locationDetails), distance: { mr: `${location.distanceKm.toLocaleString('mr-IN')} किमी`, hi: `${location.distanceKm.toLocaleString('hi-IN')} किमी`, en: `${location.distanceKm} km` }, employer: { ...job.employer, location: location.locationDetails.village } }
})

export const nearbyServices: Service[] = [
  {
    id: 'service-1',
    name: { mr: 'इलेक्ट्रिशियन', hi: 'इलेक्ट्रीशियन', en: 'Electrician' },
    description: { mr: 'घरातील वायरिंग आणि दुरुस्तीची कामे.', hi: 'घर की वायरिंग और मरम्मत का काम।', en: 'Home wiring and electrical repairs.' },
    provider: { mr: 'अमोल शिंदे', hi: 'अमोल शिंदे', en: 'Amol Shinde' },
    location: { mr: 'कराड', hi: 'कराड', en: 'Karad' },
    rate: { mr: '₹३०० पासून', hi: '₹३०० से', en: 'From ₹300' },
    rating: 4.8,
    available: true,
  },
  {
    id: 'service-2',
    name: { mr: 'ट्रॅक्टर सेवा', hi: 'ट्रैक्टर सेवा', en: 'Tractor service' },
    description: { mr: 'शेतीची कामे आणि वाहतुकीसाठी ट्रॅक्टर.', hi: 'खेती और ढुलाई के लिए ट्रैक्टर।', en: 'Tractor for farming and transport.' },
    provider: { mr: 'विठ्ठल मोरे', hi: 'विठ्ठल मोरे', en: 'Vitthal More' },
    location: { mr: 'मलकापूर', hi: 'मलकापुर', en: 'Malkapur' },
    rate: { mr: '₹१,२०० / तास', hi: '₹१,२०० / घंटा', en: '₹1,200 / hour' },
    rating: 4.6,
    available: true,
  },
]
