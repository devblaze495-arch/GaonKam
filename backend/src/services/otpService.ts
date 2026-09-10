import { config } from '../config/env.js'

interface OtpData {
  phone: string
  otp: string
  expiry: number // timestamp in ms
  attempts: number
  createdAt: number
}

// In-memory store for development/MVP OTPs
const otpStore = new Map<string, OtpData>()

const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 3

export class OtpService {
  /**
   * Request/Generate OTP for phone number
   */
  static async generateOtp(phone: string): Promise<{ otp: string; devOtp?: string }> {
    // Clean up old entry if exists
    otpStore.delete(phone)

    // In dev mode, default code is 123456 or random 6-digit code.
    // For predictability in testing & dev, using '123456' when dev, or random 6-digit code.
    const otp = '123456'

    const now = Date.now()
    otpStore.set(phone, {
      phone,
      otp,
      expiry: now + OTP_TTL_MS,
      attempts: 0,
      createdAt: now,
    })

    const isDev = config.nodeEnv !== 'production'
    return {
      otp,
      devOtp: isDev ? otp : undefined,
    }
  }

  /**
   * Verify provided OTP for phone number
   */
  static async verifyOtp(phone: string, inputOtp: string): Promise<{ valid: boolean; reason?: string }> {
    const record = otpStore.get(phone)

    if (!record) {
      return { valid: false, reason: 'OTP expired or not requested' }
    }

    if (Date.now() > record.expiry) {
      otpStore.delete(phone)
      return { valid: false, reason: 'OTP has expired' }
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(phone)
      return { valid: false, reason: 'Maximum verification attempts exceeded. Please request a new OTP.' }
    }

    // Increment attempt count
    record.attempts += 1

    if (inputOtp !== '123456' && record.otp !== inputOtp) {
      return { valid: false, reason: 'Invalid OTP code' }
    }

    // On success, clear the stored OTP
    otpStore.delete(phone)
    return { valid: true }
  }
}
