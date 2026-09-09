import http from 'node:http'
import { RoleName } from '@prisma/client'
import app from '../app.js'
import { AuthService } from '../services/authService.js'
import { prisma } from '../utils/prisma.js'

let server: http.Server
let baseUrl: string

let posterToken = ''
let posterId = ''
let workerAToken = ''
let workerAId = ''
let workerBToken = ''
let workerBId = ''
let workerCToken = ''
let workerCId = ''
let workerDToken = ''
let workerDId = ''
let adminToken = ''
let adminId = ''

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
  console.log('--- STARTING COMPLETE LIFECYCLE INTEGRATION TEST SUITE ---')

  baseUrl = await startServer()
  let testPassed = true

  try {
    // 0. Setup Users (Poster, Worker A, B, C, D, Admin)
    console.log('\n[Setup] Authenticating test users & setup Admin role...')

    await AuthService.requestOtp('9800000001')
    const posterAuth = await AuthService.verifyOtp('9800000001', '123456')
    posterToken = posterAuth.token
    posterId = posterAuth.user.id

    await AuthService.requestOtp('9800000002')
    const wA = await AuthService.verifyOtp('9800000002', '123456')
    workerAToken = wA.token
    workerAId = wA.user.id

    await AuthService.requestOtp('9800000003')
    const wB = await AuthService.verifyOtp('9800000003', '123456')
    workerBToken = wB.token
    workerBId = wB.user.id

    await AuthService.requestOtp('9800000004')
    const wC = await AuthService.verifyOtp('9800000004', '123456')
    workerCToken = wC.token
    workerCId = wC.user.id

    await AuthService.requestOtp('9800000005')
    const wD = await AuthService.verifyOtp('9800000005', '123456')
    workerDToken = wD.token
    workerDId = wD.user.id

    await AuthService.requestOtp('9800000099')
    const adm = await AuthService.verifyOtp('9800000099', '123456')
    adminToken = adm.token
    adminId = adm.user.id

    // Assign ADMIN role to admin user
    let adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } })
    if (!adminRole) {
      adminRole = await prisma.role.create({ data: { name: RoleName.ADMIN, description: 'Admin' } })
    }
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminId, roleId: adminRole.id } },
      update: {},
      create: { userId: adminId, roleId: adminRole.id },
    })

    // Ensure category 'agriculture' and skill 'farming' exist
    await prisma.jobCategory.upsert({
      where: { id: 'agriculture' },
      update: {},
      create: { id: 'agriculture', name: 'Agriculture', nameMr: 'शेती काम', nameEn: 'Agriculture' },
    })
    await prisma.skill.upsert({
      where: { id: 'farming' },
      update: {},
      create: { id: 'farming', category: 'agriculture', name: 'Farming', nameMr: 'शेती काम', nameEn: 'Farming' },
    })

    // 1. Job Creation Validation
    console.log('\n[Test 1] Job Creation (Unauthenticated)')
    const unauthRes = await makeRequest('POST', '/api/jobs', { title: 'Test Job', categoryId: 'agriculture', wageAmount: 500, workDate: '2026-10-01' })
    if (unauthRes.status !== 401) throw new Error('Test 1 failed: Unauthenticated job creation should return 401')

    console.log('[Test 1b] Job Creation (Invalid Wage ₹50)')
    const invalidWageRes = await makeRequest('POST', '/api/jobs', { title: 'Test Job', description: 'Description text', categoryId: 'agriculture', wageAmount: 50, workDate: '2026-10-01' }, posterToken)
    if (invalidWageRes.status !== 400) throw new Error('Test 1b failed: Wage under ₹100 should fail validation')

    console.log('[Test 1c] Job Creation (Valid Multi-worker Job: workersRequired = 3)')
    const createJobRes = await makeRequest(
      'POST',
      '/api/jobs',
      {
        title: { mr: 'द्राक्ष बाग फवारणी काम', en: 'Grape orchard spraying' },
        description: { mr: '१० एकर द्राक्ष बागेत फवारणी काम करणे.', en: 'Spraying 10 acre grape orchard.' },
        categoryId: 'agriculture',
        village: 'सुपे',
        taluka: 'बारामती',
        district: 'पुणे',
        wageAmount: 800,
        workDate: '2026-10-01',
        startTime: '07:00',
        workersRequired: 3,
        requiredSkills: ['farming'],
      },
      posterToken,
    )
    console.log('Create Job Status:', createJobRes.status, 'Job ID:', createJobRes.body.data?.id)
    if (createJobRes.status !== 201 || !createJobRes.body.data?.id) throw new Error('Test 1c failed: Valid job creation failed')
    const multiJobId = createJobRes.body.data.id

    // 2. Poster Management
    console.log('\n[Test 2] GET /api/jobs/me/posted (Poster views own jobs)')
    const myJobsRes = await makeRequest('GET', '/api/jobs/me/posted', undefined, posterToken)
    console.log('Status:', myJobsRes.status, 'Posted count:', myJobsRes.body.data?.length)
    if (myJobsRes.status !== 200 || myJobsRes.body.data.length === 0) throw new Error('Test 2 failed: Poster viewing own jobs failed')

    console.log('[Test 2b] PATCH /api/jobs/:id (Unauthorized user editing poster job)')
    const unauthorizedEdit = await makeRequest('PATCH', `/api/jobs/${multiJobId}`, { wageAmount: 900 }, workerAToken)
    if (unauthorizedEdit.status !== 403) throw new Error('Test 2b failed: Unauthorized user should not be able to edit job')

    console.log('[Test 2c] PATCH /api/jobs/:id (Poster edits job)')
    const validEdit = await makeRequest('PATCH', `/api/jobs/${multiJobId}`, { wageAmount: 850 }, posterToken)
    if (validEdit.status !== 200 || validEdit.body.data.paymentDetails.amount !== 850) throw new Error('Test 2c failed: Poster editing job failed')

    // 3. Multi-Worker Applications & Acceptance (Capacity = 3)
    console.log('\n[Test 3] Multi-Worker Applications (Workers A, B, C, D apply)')
    const appA = await makeRequest('POST', `/api/jobs/${multiJobId}/applications`, { message: 'Worker A applying' }, workerAToken)
    const appB = await makeRequest('POST', `/api/jobs/${multiJobId}/applications`, { message: 'Worker B applying' }, workerBToken)
    const appC = await makeRequest('POST', `/api/jobs/${multiJobId}/applications`, { message: 'Worker C applying' }, workerCToken)
    const appD = await makeRequest('POST', `/api/jobs/${multiJobId}/applications`, { message: 'Worker D applying' }, workerDToken)
    if (appA.status !== 201 || appB.status !== 201 || appC.status !== 201 || appD.status !== 201) {
      throw new Error('Test 3 failed: Applications for workers A, B, C, D failed')
    }
    const appIdA = appA.body.data.id
    const appIdB = appB.body.data.id
    const appIdC = appC.body.data.id
    const appIdD = appD.body.data.id

    console.log('\n[Test 3b] Poster views applications')
    const appsList = await makeRequest('GET', `/api/jobs/${multiJobId}/applications`, undefined, posterToken)
    console.log('Status:', appsList.status, 'Applications count:', appsList.body.data?.length)
    if (appsList.status !== 200 || appsList.body.data.length !== 4) throw new Error('Test 3b failed: Poster applications list failed')

    console.log('\n[Test 3c] Poster accepts Worker A, Worker B, Worker C (Capacity reached: 3/3)')
    const acceptA = await makeRequest('PATCH', `/api/jobs/${multiJobId}/applications/${appIdA}`, { status: 'accepted' }, posterToken)
    console.log('Accept A Status:', acceptA.status, 'Response:', JSON.stringify(acceptA.body))
    
    const acceptB = await makeRequest('PATCH', `/api/jobs/${multiJobId}/applications/${appIdB}`, { status: 'accepted' }, posterToken)
    console.log('Accept B Status:', acceptB.status, 'Response:', JSON.stringify(acceptB.body))
    
    const acceptC = await makeRequest('PATCH', `/api/jobs/${multiJobId}/applications/${appIdC}`, { status: 'accepted' }, posterToken)
    console.log('Accept C Status:', acceptC.status, 'Response:', JSON.stringify(acceptC.body))

    if (acceptA.status !== 200 || acceptB.status !== 200 || acceptC.status !== 200) {
      throw new Error('Test 3c failed: Accepting workers A, B, C failed')
    }

    console.log('[Test 3d] Poster tries to accept Worker D beyond capacity (Capacity Reached Error)')
    const acceptD = await makeRequest('PATCH', `/api/jobs/${multiJobId}/applications/${appIdD}`, { status: 'accepted' }, posterToken)
    console.log('Accept D Status:', acceptD.status, 'Response:', JSON.stringify(acceptD.body))
    if (acceptD.status !== 400 || acceptD.body.errorCode !== 'CAPACITY_REACHED') {
      throw new Error('Test 3d failed: Accepting beyond capacity should fail with CAPACITY_REACHED')
    }

    console.log('[Test 3e] Poster rejects Worker D')
    const rejectD = await makeRequest('PATCH', `/api/jobs/${multiJobId}/applications/${appIdD}`, { status: 'rejected' }, posterToken)
    if (rejectD.status !== 200) throw new Error('Test 3e failed: Rejecting Worker D failed')

    // 4. Assignments Verification
    console.log('\n[Test 4] GET /api/jobs/:id/assignments (Poster checks assignments)')
    const posterAssigns = await makeRequest('GET', `/api/jobs/${multiJobId}/assignments`, undefined, posterToken)
    console.log('Status:', posterAssigns.status, 'Assignments count:', posterAssigns.body.data?.length)
    if (posterAssigns.status !== 200 || posterAssigns.body.data.length !== 3) throw new Error('Test 4 failed: Poster assignments list failed')
    const assignAId = posterAssigns.body.data.find((a: any) => a.workerId === workerAId).id
    const assignBId = posterAssigns.body.data.find((a: any) => a.workerId === workerBId).id
    const assignCId = posterAssigns.body.data.find((a: any) => a.workerId === workerCId).id

    console.log('[Test 4b] GET /api/assignments/me (Worker A views assignments)')
    const workerAAssignments = await makeRequest('GET', '/api/assignments/me', undefined, workerAToken)
    if (workerAAssignments.status !== 200 || workerAAssignments.body.data.length === 0) throw new Error('Test 4b failed: Worker A assignments failed')

    // 5. Work Completion & Confirmation
    console.log('\n[Test 5] Worker A submits completion')
    const submitA = await makeRequest('POST', `/api/jobs/${multiJobId}/assignments/${assignAId}/completion`, undefined, workerAToken)
    if (submitA.status !== 200) throw new Error('Test 5 failed: Worker A submitting completion failed')

    console.log('[Test 5b] Duplicate completion submission by Worker A should fail')
    const dupSubmitA = await makeRequest('POST', `/api/jobs/${multiJobId}/assignments/${assignAId}/completion`, undefined, workerAToken)
    if (dupSubmitA.status !== 400 || dupSubmitA.body.errorCode !== 'DUPLICATE_COMPLETION') throw new Error('Test 5b failed: Duplicate completion should fail')

    console.log('[Test 5c] Poster confirms Worker A completion')
    const confirmA = await makeRequest('PATCH', `/api/jobs/${multiJobId}/assignments/${assignAId}/completion`, undefined, posterToken)
    if (confirmA.status !== 200) throw new Error('Test 5c failed: Poster confirming Worker A completion failed')

    console.log('[Test 5d] Worker B & C completions confirmed by Poster')
    await makeRequest('POST', `/api/jobs/${multiJobId}/assignments/${assignBId}/completion`, undefined, workerBToken)
    await makeRequest('PATCH', `/api/jobs/${multiJobId}/assignments/${assignBId}/completion`, undefined, posterToken)

    await makeRequest('POST', `/api/jobs/${multiJobId}/assignments/${assignCId}/completion`, undefined, workerCToken)
    await makeRequest('PATCH', `/api/jobs/${multiJobId}/assignments/${assignCId}/completion`, undefined, posterToken)

    // 6. Ratings & Reviews
    console.log('\n[Test 6] Ratings & Reviews (Worker A rates Poster)')
    const ratePoster = await makeRequest('POST', `/api/jobs/${multiJobId}/ratings`, { revieweeId: posterId, rating: 5, reviewText: 'उत्कृष्ट नियोजन आणि वेळेवर पेमेंट!' }, workerAToken)
    console.log('Status:', ratePoster.status, 'Response:', JSON.stringify(ratePoster.body))
    if (ratePoster.status !== 201) throw new Error('Test 6 failed: Worker A rating poster failed')

    console.log('[Test 6b] Self-rating should fail')
    const selfRate = await makeRequest('POST', `/api/jobs/${multiJobId}/ratings`, { revieweeId: workerAId, rating: 5 }, workerAToken)
    if (selfRate.status !== 400 || selfRate.body.errorCode !== 'RATING_NOT_ALLOWED') throw new Error('Test 6b failed: Self rating should fail')

    console.log('[Test 6c] Poster rates Worker A')
    const rateWorkerA = await makeRequest('POST', `/api/jobs/${multiJobId}/ratings`, { revieweeId: workerAId, rating: 5, reviewText: 'अतिशय प्रामाणिक कामगार.' }, posterToken)
    if (rateWorkerA.status !== 201) throw new Error('Test 6c failed: Poster rating worker A failed')

    // 7. Disputes
    console.log('\n[Test 7] Disputes (Worker A raises dispute)')
    const disputeRes = await makeRequest('POST', `/api/jobs/${multiJobId}/disputes`, { reason: 'काही कामाबाबत स्पष्टीकरण हवे आहे' }, workerAToken)
    console.log('Status:', disputeRes.status, 'Dispute ID:', disputeRes.body.data?.id)
    if (disputeRes.status !== 201 || !disputeRes.body.data?.id) throw new Error('Test 7 failed: Raising dispute failed')
    const disputeId = disputeRes.body.data.id

    console.log('[Test 7b] Non-participant user trying to raise dispute should fail')
    const nonPartDispute = await makeRequest('POST', `/api/jobs/${multiJobId}/disputes`, { reason: 'अनोळखी व्यक्तीचा दावा' }, workerDToken)
    if (nonPartDispute.status !== 403) throw new Error('Test 7b failed: Non-participant dispute should be forbidden')

    console.log('[Test 7c] Admin views disputes')
    const adminDisputes = await makeRequest('GET', '/api/admin/disputes', undefined, adminToken)
    console.log('Status:', adminDisputes.status, 'Disputes count:', adminDisputes.body.data?.length)
    if (adminDisputes.status !== 200 || adminDisputes.body.data.length === 0) throw new Error('Test 7c failed: Admin viewing disputes failed')

    console.log('[Test 7d] Admin resolves dispute')
    const resolveDispute = await makeRequest('PATCH', `/api/admin/disputes/${disputeId}`, { status: 'resolved', resolution: 'दोन्ही बाजूंचे समाधान झाले' }, adminToken)
    if (resolveDispute.status !== 200 || resolveDispute.body.data.status !== 'resolved') throw new Error('Test 7d failed: Admin resolving dispute failed')

    // 8. Single Job Cancellation Test
    console.log('\n[Test 8] Job Cancellation')
    const singleJobRes = await makeRequest('POST', '/api/jobs', { title: 'रद्द करायचे काम', description: 'चाचणीसाठी काम', categoryId: 'agriculture', wageAmount: 600, workDate: '2026-10-05' }, posterToken)
    const singleJobId = singleJobRes.body.data.id
    const cancelRes = await makeRequest('PATCH', `/api/jobs/${singleJobId}/cancel`, undefined, posterToken)
    if (cancelRes.status !== 200) throw new Error('Test 8 failed: Job cancellation failed')

    console.log('\n✅ ALL COMPLETE LIFECYCLE INTEGRATION TESTS PASSED SUCCESSFULLY!\n')
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
