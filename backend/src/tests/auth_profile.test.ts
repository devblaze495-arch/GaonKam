import http from 'node:http'
import app from '../app.js'
import { prisma } from '../utils/prisma.js'

let server: http.Server
let baseUrl: string
let authToken = ''
let userId = ''

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
  console.log('--- STARTING AUTH & PROFILE AUTOMATED TESTS ---')

  baseUrl = await startServer()
  let testPassed = true

  try {
    // 1. Request OTP (Valid Phone)
    console.log('\n[Test 1] POST /api/auth/request-otp (Valid phone)')
    const reqOtpRes = await makeRequest('POST', '/api/auth/request-otp', { phone: '9876543210' })
    console.log('Status:', reqOtpRes.status, 'Response:', JSON.stringify(reqOtpRes.body))
    if (reqOtpRes.status !== 200 || !reqOtpRes.body.success) {
      throw new Error('Test 1 failed: Request OTP failed')
    }

    // 2. Request OTP (Invalid Phone)
    console.log('\n[Test 2] POST /api/auth/request-otp (Invalid phone)')
    const invalidPhoneRes = await makeRequest('POST', '/api/auth/request-otp', { phone: '12345' })
    console.log('Status:', invalidPhoneRes.status, 'Response:', JSON.stringify(invalidPhoneRes.body))
    if (invalidPhoneRes.status !== 400 || invalidPhoneRes.body.success !== false) {
      throw new Error('Test 2 failed: Invalid phone should fail validation')
    }

    // 3. Verify OTP (Invalid OTP code)
    console.log('\n[Test 3] POST /api/auth/verify-otp (Invalid OTP)')
    const invalidOtpRes = await makeRequest('POST', '/api/auth/verify-otp', {
      phone: '9876543210',
      otp: '000000',
    })
    console.log('Status:', invalidOtpRes.status, 'Response:', JSON.stringify(invalidOtpRes.body))
    if (invalidOtpRes.status !== 400 || invalidOtpRes.body.success !== false) {
      throw new Error('Test 3 failed: Invalid OTP should be rejected')
    }

    // 4. Verify OTP (Valid OTP in dev mode = "123456")
    console.log('\n[Test 4] POST /api/auth/verify-otp (Valid OTP)')
    const verifyRes = await makeRequest('POST', '/api/auth/verify-otp', {
      phone: '9876543210',
      otp: '123456',
    })
    console.log('Status:', verifyRes.status, 'Response:', JSON.stringify(verifyRes.body))
    if (verifyRes.status !== 200 || !verifyRes.body.success || !verifyRes.body.data.token) {
      throw new Error('Test 4 failed: Valid OTP verification failed')
    }
    authToken = verifyRes.body.data.token
    userId = verifyRes.body.data.user.id

    // 5. Test Expired/Used OTP (reuse same OTP)
    console.log('\n[Test 5] POST /api/auth/verify-otp (Expired/Already Used OTP)')
    const reuseOtpRes = await makeRequest('POST', '/api/auth/verify-otp', {
      phone: '9876543210',
      otp: '123456',
    })
    console.log('Status:', reuseOtpRes.status, 'Response:', JSON.stringify(reuseOtpRes.body))
    if (reuseOtpRes.status !== 400 || reuseOtpRes.body.success !== false) {
      throw new Error('Test 5 failed: Reusing OTP should fail')
    }

    // 6. Unauthenticated protected route
    console.log('\n[Test 6] GET /api/auth/me (Unauthenticated)')
    const unauthRes = await makeRequest('GET', '/api/auth/me')
    console.log('Status:', unauthRes.status, 'Response:', JSON.stringify(unauthRes.body))
    if (unauthRes.status !== 401 || unauthRes.body.success !== false) {
      throw new Error('Test 6 failed: Unauthenticated request should return 401')
    }

    // 7. Authenticated /api/auth/me
    console.log('\n[Test 7] GET /api/auth/me (Authenticated)')
    const meRes = await makeRequest('GET', '/api/auth/me', undefined, authToken)
    console.log('Status:', meRes.status, 'Response:', JSON.stringify(meRes.body))
    if (meRes.status !== 200 || !meRes.body.success || meRes.body.data.id !== userId) {
      throw new Error('Test 7 failed: Me endpoint failed')
    }

    // 8. GET User Profile
    console.log('\n[Test 8] GET /api/users/me/profile')
    const profileRes = await makeRequest('GET', '/api/users/me/profile', undefined, authToken)
    console.log('Status:', profileRes.status, 'Response:', JSON.stringify(profileRes.body))
    if (profileRes.status !== 200 || !profileRes.body.success) {
      throw new Error('Test 8 failed: Fetch profile failed')
    }

    // 9. PATCH User Profile
    console.log('\n[Test 9] PATCH /api/users/me/profile')
    const patchProfileRes = await makeRequest(
      'PATCH',
      '/api/users/me/profile',
      {
        fullName: { original: 'राम पाटील', en: 'Ram Patil' },
        village: 'सुपे',
        taluka: 'बारामती',
        district: 'पुणे',
        preferredLanguage: 'mr',
        languagesKnown: ['marathi', 'hindi'],
      },
      authToken,
    )
    console.log('Status:', patchProfileRes.status, 'Response:', JSON.stringify(patchProfileRes.body))
    if (
      patchProfileRes.status !== 200 ||
      !patchProfileRes.body.success ||
      patchProfileRes.body.data.village !== 'सुपे'
    ) {
      throw new Error('Test 9 failed: Patch profile failed')
    }

    // 10. PUT User Intents
    console.log('\n[Test 10] PUT /api/users/me/intents')
    const intentsRes = await makeRequest(
      'PUT',
      '/api/users/me/intents',
      {
        intents: ['find-work', 'offer-service'],
      },
      authToken,
    )
    console.log('Status:', intentsRes.status, 'Response:', JSON.stringify(intentsRes.body))
    if (intentsRes.status !== 200 || !intentsRes.body.success) {
      throw new Error('Test 10 failed: Put intents failed')
    }

    // 11. PUT User Skills
    console.log('\n[Test 11] PUT /api/users/me/skills')
    const skillsRes = await makeRequest(
      'PUT',
      '/api/users/me/skills',
      [
        { skillId: 'farming', experience: 'three-five' },
        { skillId: 'driving', experience: 'one-three' },
      ],
      authToken,
    )
    console.log('Status:', skillsRes.status, 'Response:', JSON.stringify(skillsRes.body))
    if (skillsRes.status !== 200 || !skillsRes.body.success) {
      throw new Error('Test 11 failed: Put skills failed')
    }

    // 12. PUT Work Preferences (Valid & Invalid Wage)
    console.log('\n[Test 12a] PUT /api/users/me/preferences (Invalid wage ₹50)')
    const invalidWageRes = await makeRequest(
      'PUT',
      '/api/users/me/preferences',
      {
        dailyWage: 50,
        availability: 'today',
      },
      authToken,
    )
    console.log('Status:', invalidWageRes.status, 'Response:', JSON.stringify(invalidWageRes.body))
    if (invalidWageRes.status !== 400) {
      throw new Error('Test 12a failed: Wage under ₹100 should fail')
    }

    console.log('\n[Test 12b] PUT /api/users/me/preferences (Valid preferences)')
    const prefRes = await makeRequest(
      'PUT',
      '/api/users/me/preferences',
      {
        dailyWage: 750,
        availability: 'selected-days',
        selectedDays: ['monday', 'wednesday', 'friday'],
      },
      authToken,
    )
    console.log('Status:', prefRes.status, 'Response:', JSON.stringify(prefRes.body))
    if (prefRes.status !== 200 || !prefRes.body.success) {
      throw new Error('Test 12b failed: Put preferences failed')
    }

    // 13. PUT Transportation
    console.log('\n[Test 13] PUT /api/users/me/transportation')
    const transRes = await makeRequest(
      'PUT',
      '/api/users/me/transportation',
      {
        vehicles: ['motorcycle', 'tractor'],
        canTravel: true,
        maxDistance: '20',
      },
      authToken,
    )
    console.log('Status:', transRes.status, 'Response:', JSON.stringify(transRes.body))
    if (transRes.status !== 200 || !transRes.body.success) {
      throw new Error('Test 13 failed: Put transportation failed')
    }

    // 14. POST Logout
    console.log('\n[Test 14] POST /api/auth/logout')
    const logoutRes = await makeRequest('POST', '/api/auth/logout', undefined, authToken)
    console.log('Status:', logoutRes.status, 'Response:', JSON.stringify(logoutRes.body))
    if (logoutRes.status !== 200 || !logoutRes.body.success) {
      throw new Error('Test 14 failed: Logout failed')
    }

    console.log('\n✅ ALL 14 AUTOMATED TEST SUITES PASSED SUCCESSFULLY!\n')
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
