import http from 'node:http'
import app from '../app.js'
import { prisma } from '../utils/prisma.js'

let server: http.Server
let baseUrl: string

function makeRequest(
  method: string,
  path: string,
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl)
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
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
  console.log('--- STARTING SERVICES & MASTER DATA AUTOMATED TESTS ---')

  baseUrl = await startServer()
  let testPassed = true

  try {
    // 1. GET /api/skills
    console.log('\n[Test 1] GET /api/skills')
    const skillsRes = await makeRequest('GET', '/api/skills')
    console.log('Status:', skillsRes.status, 'Skills count:', skillsRes.body.data?.length)
    if (skillsRes.status !== 200 || !skillsRes.body.success || skillsRes.body.data.length < 10) {
      throw new Error('Test 1 failed: GET /api/skills failed or returned insufficient skills')
    }

    // 2. GET /api/categories/jobs
    console.log('\n[Test 2] GET /api/categories/jobs')
    const jobCatsRes = await makeRequest('GET', '/api/categories/jobs')
    console.log('Status:', jobCatsRes.status, 'Categories count:', jobCatsRes.body.data?.length)
    if (jobCatsRes.status !== 200 || !jobCatsRes.body.success || jobCatsRes.body.data.length !== 6) {
      throw new Error('Test 2 failed: GET /api/categories/jobs failed or did not return 6 categories')
    }

    // 3. GET /api/categories/services
    console.log('\n[Test 3] GET /api/categories/services')
    const svcCatsRes = await makeRequest('GET', '/api/categories/services')
    console.log('Status:', svcCatsRes.status, 'Categories count:', svcCatsRes.body.data?.length)
    if (svcCatsRes.status !== 200 || !svcCatsRes.body.success || svcCatsRes.body.data.length === 0) {
      throw new Error('Test 3 failed: GET /api/categories/services failed')
    }

    // 4. GET /api/services
    console.log('\n[Test 4] GET /api/services')
    const svcsRes = await makeRequest('GET', '/api/services')
    console.log('Status:', svcsRes.status, 'Services count:', svcsRes.body.data?.length)
    if (svcsRes.status !== 200 || !svcsRes.body.success || !Array.isArray(svcsRes.body.data)) {
      throw new Error('Test 4 failed: GET /api/services failed')
    }

    // 5. GET /api/services/nearby
    console.log('\n[Test 5] GET /api/services/nearby')
    const nearbySvcsRes = await makeRequest('GET', '/api/services/nearby?village=सुपे&district=पुणे')
    console.log('Status:', nearbySvcsRes.status, 'Nearby count:', nearbySvcsRes.body.data?.length)
    if (nearbySvcsRes.status !== 200 || !nearbySvcsRes.body.success || !Array.isArray(nearbySvcsRes.body.data)) {
      throw new Error('Test 5 failed: GET /api/services/nearby failed')
    }

    console.log('\n✅ ALL SERVICES & MASTER DATA AUTOMATED TEST SUITES PASSED SUCCESSFULLY!\n')
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
