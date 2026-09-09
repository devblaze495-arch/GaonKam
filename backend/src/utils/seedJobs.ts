import { JobStatus, WageType } from '@prisma/client'
import { prisma } from './prisma.js'

export const MASTER_CATEGORIES = [
  { id: 'agriculture', name: 'Agriculture', nameMr: 'शेती काम', nameHi: 'खेती का काम', nameEn: 'Agriculture' },
  { id: 'construction', name: 'Construction', nameMr: 'बांधकाम', nameHi: 'निर्माण कार्य', nameEn: 'Construction' },
  { id: 'household', name: 'Household', nameMr: 'घरकाम', nameHi: 'घरेलू काम', nameEn: 'Household' },
  { id: 'transport', name: 'Transport', nameMr: 'वाहतूक', nameHi: 'परिवहन', nameEn: 'Transport' },
  { id: 'skilled', name: 'Skilled Work', nameMr: 'कुशल काम', nameHi: 'कुशल कार्य', nameEn: 'Skilled Work' },
  { id: 'other', name: 'Other Work', nameMr: 'इतर काम', nameHi: 'अन्य काम', nameEn: 'Other' },
]

export async function ensureJobCategoriesExist() {
  for (const cat of MASTER_CATEGORIES) {
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
}

export async function ensureDemoJobsExist() {
  await ensureJobCategoriesExist()

  const count = await prisma.job.count()
  if (count > 0) return

  // Create a default employer user if none exists
  let employer = await prisma.user.findFirst({
    where: { mobile: '9999988888' },
  })

  if (!employer) {
    employer = await prisma.user.create({
      data: {
        fullName: 'आनंदराव शिंदे',
        fullNameEn: 'Anandrao Shinde',
        mobile: '9999988888',
        village: 'सुपे',
        taluka: 'बारामती',
        district: 'पुणे',
        state: 'Maharashtra',
        preferredLanguage: 'mr',
        trustScore: 94,
        rating: 4.8,
        reviewCount: 15,
      },
    })
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const tomorrowObj = new Date()
  tomorrowObj.setDate(tomorrowObj.getDate() + 1)
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0]

  // Demo Job 1: Sugarcane Harvesting (Agriculture)
  const job1 = await prisma.job.create({
    data: {
      title: 'ऊस तोडणी कामगार हवे आहेत',
      titleMr: 'ऊस तोडणी कामगार हवे आहेत',
      titleHi: 'गन्ना कटाई के लिए मजदूर चाहिए',
      titleEn: 'Sugarcane harvesting workers needed',
      description: '२ एकर शेतातील ऊस तोडणी आणि ट्रॉली भरण्याचे काम. सकाळी ७ ते दुपारी १ वाजेपर्यंत.',
      descriptionMr: '२ एकर शेतातील ऊस तोडणी आणि ट्रॉली भरण्याचे काम. सकाळी ७ ते दुपारी १ वाजेपर्यंत.',
      descriptionHi: '2 एकर खेत में गन्ना कटाई और ट्रॉली भरने का काम। सुबह 7 से दोपहर 1 बजे तक।',
      descriptionEn: 'Sugarcane harvesting and trolley loading in 2-acre field. 7:00 AM to 1:00 PM.',
      categoryId: 'agriculture',
      postedById: employer.id,
      village: 'सुपे',
      taluka: 'बारामती',
      district: 'पुणे',
      state: 'Maharashtra',
      wageAmount: 700,
      wageType: WageType.DAILY,
      workDate: tomorrowStr,
      workDateObj: tomorrowObj,
      startTime: '07:00',
      workersRequired: 4,
      status: JobStatus.OPEN,
      postedAt: new Date(),
    },
  })

  await prisma.jobRequiredSkill.create({
    data: {
      jobId: job1.id,
      skillId: 'farming',
    },
  })

  // Demo Job 2: Masonry Helper (Construction)
  const job2 = await prisma.job.create({
    data: {
      title: 'घर बांधकामासाठी गवंडी मदतनीस',
      titleMr: 'घर बांधकामासाठी गवंडी मदतनीस',
      titleHi: 'मकान निर्माण के लिए राजमिस्त्री हेल्पर',
      titleEn: 'Masonry helper for house construction',
      description: 'भिंत बांधकामासाठी सिमेंट-वाळू माल बनवणे आणि विटा देण्याचे काम.',
      descriptionMr: 'भिंत बांधकामासाठी सिमेंट-वाळू माल बनवणे आणि विटा देण्याचे काम.',
      descriptionHi: 'दीवार निर्माण के लिए सीमेंट-बालू का मसाला बनाना और ईंटें पहुँचाना।',
      descriptionEn: 'Mixing cement mortar and helping mason with bricks.',
      categoryId: 'construction',
      postedById: employer.id,
      village: 'मोरगाव',
      taluka: 'बारामती',
      district: 'पुणे',
      state: 'Maharashtra',
      wageAmount: 850,
      wageType: WageType.DAILY,
      workDate: todayStr,
      workDateObj: new Date(),
      startTime: '08:30',
      workersRequired: 2,
      status: JobStatus.OPEN,
      postedAt: new Date(),
    },
  })

  await prisma.jobRequiredSkill.createMany({
    data: [
      { jobId: job2.id, skillId: 'construction' },
      { jobId: job2.id, skillId: 'masonry' },
    ],
  })

  // Demo Job 3: Tractor Driver (Transport / Skilled)
  const job3 = await prisma.job.create({
    data: {
      title: 'नांगरणीसाठी ट्रॅक्टर ड्रायव्हर',
      titleMr: 'नांगरणीसाठी ट्रॅक्टर ड्रायव्हर',
      titleHi: 'जुताई के लिए ट्रैक्टर ड्राइवर',
      titleEn: 'Tractor driver for field plowing',
      description: '५ एकर शेताची रोटाव्हेटरने नांगरणी करायची आहे. ट्रॅक्टर आमचा राहील.',
      descriptionMr: '५ एकर शेताची रोटाव्हेटरने नांगरणी करायची आहे. ट्रॅक्टर आमचा राहील.',
      descriptionHi: '5 एकड़ खेत में रोटावेटर से जुताई करनी है। ट्रैक्टर हमारा रहेगा।',
      descriptionEn: 'Plowing 5 acres with rotavator. Tractor provided.',
      categoryId: 'transport',
      postedById: employer.id,
      village: 'सुपे',
      taluka: 'बारामती',
      district: 'पुणे',
      state: 'Maharashtra',
      wageAmount: 1000,
      wageType: WageType.DAILY,
      workDate: tomorrowStr,
      workDateObj: tomorrowObj,
      startTime: '06:30',
      workersRequired: 1,
      status: JobStatus.OPEN,
      postedAt: new Date(),
    },
  })

  await prisma.jobRequiredSkill.create({
    data: {
      jobId: job3.id,
      skillId: 'driving',
    },
  })
}
