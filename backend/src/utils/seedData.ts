import { RoleName } from '@prisma/client'
import { prisma } from './prisma.js'

export const MASTER_ROLES = [
  { name: RoleName.USER, description: 'Standard User Role' },
  { name: RoleName.ADMIN, description: 'System Administrator' },
]

export const MASTER_SKILLS_SEED = [
  { id: 'farming', category: 'agriculture', name: 'Farming / Shetkaam', nameMr: 'शेती काम', nameHi: 'खेती का काम', nameEn: 'Farming', description: 'Agricultural labor, harvesting, and field work' },
  { id: 'general-labor', category: 'labor', name: 'General Labor', nameMr: 'इतर मजुरी', nameHi: 'सामान्य मजदूरी', nameEn: 'General Labor', description: 'Unskilled and general daily labor work' },
  { id: 'construction', category: 'construction', name: 'Construction Worker', nameMr: 'बांधकाम कामगार', nameHi: 'निर्माण मजदूर', nameEn: 'Construction Worker', description: 'Building and site construction work' },
  { id: 'masonry', category: 'construction', name: 'Masonry / Gavandi', nameMr: 'गवंडी काम', nameHi: 'राजमिस्त्री', nameEn: 'Masonry', description: 'Bricklaying, plastering, and stone masonry' },
  { id: 'carpentry', category: 'skilled', name: 'Carpentry / Sutar', nameMr: 'सुतारकाम', nameHi: 'बढ़ई का काम', nameEn: 'Carpentry', description: 'Woodwork, furniture repair, and wooden structure framing' },
  { id: 'electrician', category: 'skilled', name: 'Electrician', nameMr: 'इलेक्ट्रिशियन', nameHi: 'इलेक्ट्रिशियन', nameEn: 'Electrician', description: 'Electrical wiring, motor repair, and switchboard installation' },
  { id: 'plumbing', category: 'skilled', name: 'Plumbing', nameMr: 'प्लंबिंग', nameHi: 'प्लंबर', nameEn: 'Plumbing', description: 'Pipe fitting, pump installation, and water leak repairs' },
  { id: 'painting', category: 'skilled', name: 'Painting', nameMr: 'रंगकाम', nameHi: 'पेंटिंग', nameEn: 'Painting', description: 'House painting, whitewashing, and wall finishing' },
  { id: 'welding', category: 'skilled', name: 'Welding', nameMr: 'वेल्डिंग', nameHi: 'वेल्डिंग', nameEn: 'Welding', description: 'Metal welding, gate fabrication, and machinery repair' },
  { id: 'driving', category: 'transport', name: 'Driving', nameMr: 'ड्रायव्हिंग', nameHi: 'ड्राइविंग', nameEn: 'Driving', description: 'Tractor, auto, pickup, and car driving' },
  { id: 'animal-care', category: 'agriculture', name: 'Animal Care', nameMr: 'पशुपोषण / काळजी', nameHi: 'पशुपालन', nameEn: 'Animal Care', description: 'Cattle feeding, milking, and livestock management' },
  { id: 'household', category: 'household', name: 'Household Help', nameMr: 'घरकाम', nameHi: 'घरेलू काम', nameEn: 'Household Help', description: 'Domestic assistance and home maintenance' },
  { id: 'cooking', category: 'household', name: 'Cooking', nameMr: 'स्वयंपाक', nameHi: 'खाना बनाना', nameEn: 'Cooking', description: 'Meal preparation for events and households' },
  { id: 'cleaning', category: 'household', name: 'Cleaning', nameMr: 'सफाई काम', nameHi: 'सफाई', nameEn: 'Cleaning', description: 'Premises cleaning and sanitation' },
  { id: 'gardening', category: 'household', name: 'Gardening', nameMr: 'बागायत काम', nameHi: 'बागवानी', nameEn: 'Gardening', description: 'Lawn trimming, plant watering, and orchard maintenance' },
  { id: 'machine-operator', category: 'skilled', name: 'Machine Operator', nameMr: 'मशीन ऑपरेटर', nameHi: 'मशीन ऑपरेटर', nameEn: 'Machine Operator', description: 'Thresher, harvester, and pump set operation' },
]

export const MASTER_JOB_CATEGORIES_SEED = [
  { id: 'agriculture', name: 'Agriculture', nameMr: 'शेती काम', nameHi: 'खेती का काम', nameEn: 'Agriculture' },
  { id: 'construction', name: 'Construction', nameMr: 'बांधकाम', nameHi: 'निर्माण कार्य', nameEn: 'Construction' },
  { id: 'household', name: 'Household', nameMr: 'घरकाम', nameHi: 'घरेलू काम', nameEn: 'Household' },
  { id: 'transport', name: 'Transport', nameMr: 'वाहतूक', nameHi: 'परिवहन', nameEn: 'Transport' },
  { id: 'skilled', name: 'Skilled Work', nameMr: 'कुशल काम', nameHi: 'कुशल कार्य', nameEn: 'Skilled Work' },
  { id: 'other', name: 'Other Work', nameMr: 'इतर काम', nameHi: 'अन्य काम', nameEn: 'Other' },
]

export const MASTER_SERVICE_CATEGORIES_SEED = [
  { id: 'home-repair', name: 'Home Repair', description: 'Electrician, plumbing, and masonry services' },
  { id: 'agricultural-machinery', name: 'Agricultural Machinery', description: 'Tractor rental, thresher, and Rotavator services' },
  { id: 'transport-goods', name: 'Goods Transport', description: 'Pickup, tempo, and trolley transport' },
  { id: 'crop-care', name: 'Crop Care & Spraying', description: 'Pesticide spraying and crop protection services' },
  { id: 'appliance-repair', name: 'Appliance & Pump Repair', description: 'Submersible pump set and motor repairs' },
  { id: 'general-help', name: 'General Help', description: 'Misc local assistance and labor supply' },
]

export async function seedAllMasterData() {
  // 1. Roles
  for (const role of MASTER_ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
    })
  }

  // 2. Skills
  for (const skill of MASTER_SKILLS_SEED) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {
        category: skill.category,
        name: skill.name,
        nameMr: skill.nameMr,
        nameHi: skill.nameHi,
        nameEn: skill.nameEn,
        description: skill.description,
      },
      create: {
        id: skill.id,
        category: skill.category,
        name: skill.name,
        nameMr: skill.nameMr,
        nameHi: skill.nameHi,
        nameEn: skill.nameEn,
        description: skill.description,
      },
    })
  }

  // 3. Job Categories
  for (const cat of MASTER_JOB_CATEGORIES_SEED) {
    await prisma.jobCategory.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        nameMr: cat.nameMr,
        nameHi: cat.nameHi,
        nameEn: cat.nameEn,
      },
      create: {
        id: cat.id,
        name: cat.name,
        nameMr: cat.nameMr,
        nameHi: cat.nameHi,
        nameEn: cat.nameEn,
        isActive: true,
      },
    })
  }

  // 4. Service Categories
  for (const cat of MASTER_SERVICE_CATEGORIES_SEED) {
    await prisma.serviceCategory.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        id: cat.id,
        name: cat.name,
        description: cat.description,
      },
    })
  }

  // 5. Demo Services if empty
  const serviceCount = await prisma.service.count()
  if (serviceCount === 0) {
    await prisma.service.create({
      data: {
        title: 'ट्रॅक्टर आणि रोटाव्हेटर भाड्याने',
        nameMr: 'ट्रॅक्टर भाडे सेवा',
        nameHi: 'ट्रैक्टर किराया सेवा',
        nameEn: 'Tractor Rental Service',
        description: '५५ HP ट्रॅक्टर, रोटाव्हेटर आणि नांगरणी उपकरणांसह उपलब्ध.',
        descriptionMr: '५५ HP ट्रॅक्टर, रोटाव्हेटर आणि नांगरणी उपकरणांसह उपलब्ध.',
        descriptionHi: '55 HP ट्रैक्टर, रोटावेटर और जुताई उपकरणों के साथ उपलब्ध।',
        descriptionEn: '55 HP tractor with rotavator and plowing tools.',
        providerNameMr: 'राजू जगताप',
        providerNameHi: 'राजू जगताप',
        providerNameEn: 'Raju Jagtap',
        location: 'सुपे, बारामती, पुणे',
        village: 'सुपे',
        taluka: 'बारामती',
        district: 'पुणे',
        rateMr: '₹१,२०० / तास',
        rateHi: '₹1,200 / घंटा',
        rateEn: '₹1,200 / hr',
        rating: 4.9,
        available: true,
        categoryId: 'agricultural-machinery',
      },
    })

    await prisma.service.create({
      data: {
        title: 'औषध फवारणी पंप सेवा',
        nameMr: 'पिक फवारणी सेवा',
        nameHi: 'फसल छिड़काव सेवा',
        nameEn: 'Crop Spraying Service',
        description: 'बॅटरी चालित व पेट्रोल स्प्रेअरने पिकांवर औषध फवारणी.',
        descriptionMr: 'बॅटरी चालित व पेट्रोल स्प्रेअरने पिकांवर औषध फवारणी.',
        descriptionHi: 'बैटरी चालित और पेट्रोल स्प्रेयर से फसलों पर दवा छिड़काव।',
        descriptionEn: 'Pesticide spraying with battery & petrol sprayers.',
        providerNameMr: 'विकास काळे',
        providerNameHi: 'विकास काले',
        providerNameEn: 'Vikas Kale',
        location: 'सुपे, बारामती, पुणे',
        village: 'सुपे',
        taluka: 'बारामती',
        district: 'पुणे',
        rateMr: '₹३०० / एकर',
        rateHi: '₹300 / एकड़',
        rateEn: '₹300 / acre',
        rating: 4.7,
        available: true,
        categoryId: 'crop-care',
      },
    })
  }
}
