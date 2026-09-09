import http from 'node:http'
import { JobStatus, WageType } from '@prisma/client'
import app from '../app.js'
import { AuthService } from '../services/authService.js'
import { prisma } from '../utils/prisma.js'

let server: http.Server
let baseUrl: string

let workerToken = ''
let workerUserId = ''
let employerToken = ''
let employerUserId = ''
let sampleJobId = ''
let ownJobId = ''
let expiredJobId = ''

function makeRequest(
  method: string,
  path: string,
  body?: any,
  token?: string,
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl)
    const payload = body ? JSON.stringify(body) : undefined

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload).toString()
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let responseData = ''
        res.on('data', (chunk) => {
          responseData += chunk
        })
        res.on('end', () => {
          let parsed: any
          try {
            parsed = JSON.parse(responseData)
          } catch {
            parsed = responseData
          }
          resolve({ status: res.statusCode || 500, body: parsed })
        })
      },
    )

    req.on('error', (err) => reject(err))

    if (payload) {
      req.write(payload)
    }
    req.end()
  })
}

async function startServer(): Promise<string> {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const address = server.address()
      if (typeof address === 'object' && address !== null) {
        resolve(`http://localhost:${address.port}`)
      } else {
        resolve('http://localhost:4000')
      }
    })
  })
}

async function runTests() {
  console.log('--- STARTING JOBS & APPLICATIONS AUTOMATED TESTS ---')

  baseUrl = await startServer()
  let testPassed = true

  try {
    // 0. Setup test users and test jobs
    console.log('\n[Setup] Authenticating test worker & employer users...')

    // Create/Verify Worker User
    await AuthService.requestOtp('9811122233')
    const workerAuth = await AuthService.verifyOtp('9811122233', '123456')
    workerToken = workerAuth.token
    workerUserId = workerAuth.user.id

    // Create/Verify Employer User
    await AuthService.requestOtp('9844455566')
    const employerAuth = await AuthService.verifyOtp('9844455566', '123456')
    employerToken = employerAuth.token
    employerUserId = employerAuth.user.id

    // Create Category 'agriculture' if missing
    await prisma.jobCategory.upsert({
      where: { id: 'agriculture' },
      update: {},
      create: { id: 'agriculture', name: 'Agriculture', nameMr: 'शेती काम', nameEn: 'Agriculture' },
    })

    // Create sample open job posted by employer
    const sampleJob = await prisma.job.create({
      data: {
        title: 'कापूस वेचणी कामगार',
        titleMr: 'कापूस वेचणी कामगार',
        titleEn: 'Cotton picking workers',
        description: '३ एकर शेतात कापूस वेचणीचे काम.',
        categoryId: 'agriculture',
        postedById: employerUserId,
        village: 'सुपे',
        taluka: 'बारामती',
        district: 'पुणे',
        wageAmount: 750,
        wageType: WageType.DAILY,
        workDate: new Date().toISOString().split('T')[0],
        workDateObj: new Date(),
        status: JobStatus.OPEN,
        workersRequired: 3,
      },
    })
    sampleJobId = sampleJob.id

    // Create job posted by worker himself (for testing applying to own job)
    const ownJob = await prisma.job.create({
      data: {
        title: 'माझे वैयक्तिक काम',
        categoryId: 'agriculture',
        postedById: workerUserId,
        village: 'सुपे',
        wageAmount: 600,
        status: JobStatus.OPEN,
        workersRequired: 1,
      },
    })
    ownJobId = ownJob.id

    // Create expired job
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)
    const expiredJob = await prisma.job.create({
      data: {
        title: 'जुने संपलेले काम',
        categoryId: 'agriculture',
        postedById: employerUserId,
        village: 'सुपे',
        wageAmount: 500,
        status: JobStatus.EXPIRED,
        applicationDeadline: pastDate,
        workDateObj: pastDate,
        workersRequired: 1,
      },
    })
    expiredJobId = expiredJob.id

    // 1. GET /api/jobs (List jobs)
    console.log('\n[Test 1] GET /api/jobs (List jobs)')
    const listRes = await makeRequest('GET', '/api/jobs')
    console.log('Status:', listRes.status, 'Job count:', listRes.body.data?.length)
    if (listRes.status !== 200 || !listRes.body.success || !Array.isArray(listRes.body.data)) {
      throw new Error('Test 1 failed: GET /api/jobs returned invalid response')
    }

    // 2. GET /api/jobs?query=कापूस (Keyword search)
    console.log('\n[Test 2] GET /api/jobs?query=कापूस (Search keyword)')
    const searchRes = await makeRequest('GET', `/api/jobs?query=${encodeURIComponent('कापूस')}`)
    console.log('Status:', searchRes.status, 'Search count:', searchRes.body.data?.length)
    if (searchRes.status !== 200 || searchRes.body.data.length === 0) {
      throw new Error('Test 2 failed: Keyword search failed to match job')
    }

    // 3. GET /api/jobs?categoryId=agriculture (Category Filter)
    console.log('\n[Test 3] GET /api/jobs?categoryId=agriculture (Category filter)')
    const catRes = await makeRequest('GET', '/api/jobs?categoryId=agriculture')
    console.log('Status:', catRes.status, 'Count:', catRes.body.data?.length)
    if (catRes.status !== 200 || catRes.body.data.length === 0) {
      throw new Error('Test 3 failed: Category filter failed')
    }

    // 4. GET /api/jobs?minWage=700 (Wage Filter)
    console.log('\n[Test 4] GET /api/jobs?minWage=700 (Minimum wage filter)')
    const wageRes = await makeRequest('GET', '/api/jobs?minWage=700')
    console.log('Status:', wageRes.status, 'Count:', wageRes.body.data?.length)
    if (wageRes.status !== 200 || wageRes.body.data.some((j: any) => j.paymentDetails.amount < 700)) {
      throw new Error('Test 4 failed: Wage filter returned jobs below min wage')
    }

    // 5. GET /api/jobs?date=today (Date Filter)
    console.log('\n[Test 5] GET /api/jobs?date=today (Date filter)')
    const dateRes = await makeRequest('GET', '/api/jobs?date=today')
    console.log('Status:', dateRes.status, 'Count:', dateRes.body.data?.length)
    if (dateRes.status !== 200) {
      throw new Error('Test 5 failed: Date filter failed')
    }

    // 6. GET /api/jobs/nearby (Nearby Jobs)
    console.log('\n[Test 6] GET /api/jobs/nearby (Nearby jobs)')
    const nearbyRes = await makeRequest('GET', '/api/jobs/nearby?village=सुपे&district=पुणे')
    console.log('Status:', nearbyRes.status, 'Nearby count:', nearbyRes.body.data?.length)
    if (nearbyRes.status !== 200 || !Array.isArray(nearbyRes.body.data)) {
      throw new Error('Test 6 failed: GET /api/jobs/nearby failed')
    }

    // 7. GET /api/jobs/:id (Job details)
    console.log('\n[Test 7] GET /api/jobs/:id (Job details)')
    const detailsRes = await makeRequest('GET', `/api/jobs/${sampleJobId}`)
    console.log('Status:', detailsRes.status, 'Title:', JSON.stringify(detailsRes.body.data?.title))
    if (detailsRes.status !== 200 || detailsRes.body.data.id !== sampleJobId) {
      throw new Error('Test 7 failed: GET /api/jobs/:id failed')
    }

    // 8. GET /api/jobs/:jobId/application (Check non-applied status)
    console.log('\n[Test 8] GET /api/jobs/:jobId/application (Initial check - not applied)')
    const checkAppRes = await makeRequest('GET', `/api/jobs/${sampleJobId}/application`, undefined, workerToken)
    console.log('Status:', checkAppRes.status, 'Application data:', checkAppRes.body.data)
    if (checkAppRes.status !== 200 || checkAppRes.body.data !== null) {
      throw new Error('Test 8 failed: Initial check should be null')
    }

    // 9. POST /api/jobs/:jobId/applications (Apply for Job)
    console.log('\n[Test 9] POST /api/jobs/:jobId/applications (Apply for job)')
    const applyRes = await makeRequest(
      'POST',
      `/api/jobs/${sampleJobId}/applications`,
      { message: 'मी हे काम करण्यास उत्सुक आहे.' },
      workerToken,
    )
    console.log('Status:', applyRes.status, 'Response:', JSON.stringify(applyRes.body))
    if (applyRes.status !== 201 || !applyRes.body.success || applyRes.body.data.status !== 'pending') {
      throw new Error('Test 9 failed: Applying for job failed')
    }

    // 10. POST /api/jobs/:jobId/applications (Duplicate application check)
    console.log('\n[Test 10] POST /api/jobs/:jobId/applications (Duplicate application)')
    const dupRes = await makeRequest(
      'POST',
      `/api/jobs/${sampleJobId}/applications`,
      { message: 'Duplicate attempt' },
      workerToken,
    )
    console.log('Status:', dupRes.status, 'Response:', JSON.stringify(dupRes.body))
    if (dupRes.status !== 400 || dupRes.body.errorCode !== 'ALREADY_APPLIED') {
      throw new Error('Test 10 failed: Duplicate application should be rejected')
    }

    // 11. POST /api/jobs/:jobId/applications (Applying to own job check)
    console.log('\n[Test 11] POST /api/jobs/:jobId/applications (Apply to own job)')
    const ownAppRes = await makeRequest(
      'POST',
      `/api/jobs/${ownJobId}/applications`,
      { message: 'Applying to own job' },
      workerToken,
    )
    console.log('Status:', ownAppRes.status, 'Response:', JSON.stringify(ownAppRes.body))
    if (ownAppRes.status !== 400 || ownAppRes.body.errorCode !== 'CANNOT_APPLY_OWN_JOB') {
      throw new Error('Test 11 failed: Applying to own job should be rejected')
    }

    // 12. POST /api/jobs/:jobId/applications (Applying to expired job check)
    console.log('\n[Test 12] POST /api/jobs/:jobId/applications (Apply to expired job)')
    const expiredAppRes = await makeRequest(
      'POST',
      `/api/jobs/${expiredJobId}/applications`,
      { message: 'Applying to expired job' },
      workerToken,
    )
    console.log('Status:', expiredAppRes.status, 'Response:', JSON.stringify(expiredAppRes.body))
    if (expiredAppRes.status !== 400 || expiredAppRes.body.errorCode !== 'JOB_NOT_OPEN') {
      throw new Error('Test 12 failed: Applying to expired job should be rejected')
    }

    // 13. GET /api/applications/me (My Applications)
    console.log('\n[Test 13] GET /api/applications/me (User applications)')
    const myAppsRes = await makeRequest('GET', '/api/applications/me', undefined, workerToken)
    console.log('Status:', myAppsRes.status, 'Count:', myAppsRes.body.data?.length)
    if (myAppsRes.status !== 200 || !Array.isArray(myAppsRes.body.data) || myAppsRes.body.data.length === 0) {
      throw new Error('Test 13 failed: My applications retrieval failed')
    }

    console.log('\n✅ ALL JOBS & APPLICATIONS AUTOMATED TEST SUITES PASSED SUCCESSFULLY!\n')
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error)
    testPassed = false
  } finally {
    server.close()
    await prisma.$disconnect()
    process.exit(testPassed ? 0 : 1)
  }
}

runTests()
