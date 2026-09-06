import type { DayId, Skill, VehicleId } from '../types/profile'

export const skillOptions: Skill[] = [
  { id: 'farming', category: 'farm', name: { mr: 'शेती काम', hi: 'खेती का काम', en: 'Farming' } },
  { id: 'general-labor', category: 'work', name: { mr: 'मजुरी', hi: 'मजदूरी', en: 'General labor' } },
  { id: 'construction', category: 'work', name: { mr: 'बांधकाम', hi: 'निर्माण', en: 'Construction' } },
  { id: 'masonry', category: 'work', name: { mr: 'गवंडी', hi: 'राजमिस्त्री', en: 'Masonry' } },
  { id: 'carpentry', category: 'repair', name: { mr: 'सुतारकाम', hi: 'बढ़ई का काम', en: 'Carpentry' } },
  { id: 'electrician', category: 'repair', name: { mr: 'इलेक्ट्रिशियन', hi: 'इलेक्ट्रीशियन', en: 'Electrician' } },
  { id: 'plumbing', category: 'repair', name: { mr: 'प्लंबिंग', hi: 'प्लंबिंग', en: 'Plumbing' } },
  { id: 'painting', category: 'repair', name: { mr: 'पेंटिंग', hi: 'पेंटिंग', en: 'Painting' } },
  { id: 'welding', category: 'repair', name: { mr: 'वेल्डिंग', hi: 'वेल्डिंग', en: 'Welding' } },
  { id: 'driving', category: 'transport', name: { mr: 'ड्रायव्हिंग', hi: 'ड्राइविंग', en: 'Driving' } },
  { id: 'animal-care', category: 'farm', name: { mr: 'पशुपालन', hi: 'पशुपालन', en: 'Animal care' } },
  { id: 'household', category: 'home', name: { mr: 'घरकाम', hi: 'घर का काम', en: 'Household work' } },
  { id: 'cooking', category: 'home', name: { mr: 'स्वयंपाक', hi: 'खाना बनाना', en: 'Cooking' } },
  { id: 'cleaning', category: 'home', name: { mr: 'साफसफाई', hi: 'सफाई', en: 'Cleaning' } },
  { id: 'gardening', category: 'farm', name: { mr: 'बागकाम', hi: 'बागवानी', en: 'Gardening' } },
  { id: 'machine-operator', category: 'work', name: { mr: 'मशीन ऑपरेटर', hi: 'मशीन ऑपरेटर', en: 'Machine operator' } },
]

export const dayIds: DayId[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
export const vehicleIds: VehicleId[] = ['none', 'bicycle', 'motorcycle', 'scooter', 'auto', 'tractor', 'car', 'pickup', 'other']