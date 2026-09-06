import type { Job, Service } from '../types'

export const nearbyJobs: Job[] = [
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
  },
]

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
