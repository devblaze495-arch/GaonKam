import {
  AvailabilityMode,
  DayOfWeek,
  SkillExperience,
  UserIntent,
  VehicleType,
} from '@prisma/client'

// --- Skill Experience ---
export function frontendToPrismaExperience(exp: string): SkillExperience {
  switch (exp) {
    case 'less-than-year':
      return SkillExperience.LESS_THAN_YEAR
    case 'one-three':
      return SkillExperience.ONE_THREE
    case 'three-five':
      return SkillExperience.THREE_FIVE
    case 'five-plus':
      return SkillExperience.FIVE_PLUS
    default:
      return SkillExperience.ONE_THREE
  }
}

export function prismaToFrontendExperience(exp: SkillExperience): string {
  switch (exp) {
    case SkillExperience.LESS_THAN_YEAR:
      return 'less-than-year'
    case SkillExperience.ONE_THREE:
      return 'one-three'
    case SkillExperience.THREE_FIVE:
      return 'three-five'
    case SkillExperience.FIVE_PLUS:
      return 'five-plus'
    default:
      return 'one-three'
  }
}

// --- Availability Mode ---
export function frontendToPrismaAvailability(avail: string): AvailabilityMode {
  switch (avail) {
    case 'today':
      return AvailabilityMode.TODAY
    case 'this-week':
      return AvailabilityMode.THIS_WEEK
    case 'selected-days':
      return AvailabilityMode.SELECTED_DAYS
    case 'unavailable':
      return AvailabilityMode.UNAVAILABLE
    default:
      return AvailabilityMode.THIS_WEEK
  }
}

export function prismaToFrontendAvailability(avail: AvailabilityMode | null | undefined): string {
  if (!avail) return 'this-week'
  switch (avail) {
    case AvailabilityMode.TODAY:
      return 'today'
    case AvailabilityMode.THIS_WEEK:
      return 'this-week'
    case AvailabilityMode.SELECTED_DAYS:
      return 'selected-days'
    case AvailabilityMode.UNAVAILABLE:
      return 'unavailable'
    default:
      return 'this-week'
  }
}

// --- Days Of Week ---
export function frontendToPrismaDay(day: string): DayOfWeek {
  const upper = day.toUpperCase() as keyof typeof DayOfWeek
  return DayOfWeek[upper] || DayOfWeek.MONDAY
}

export function prismaToFrontendDay(day: DayOfWeek): string {
  return day.toLowerCase()
}

// --- Vehicle Type ---
export function frontendToPrismaVehicle(veh: string): VehicleType {
  const upper = veh.toUpperCase() as keyof typeof VehicleType
  return VehicleType[upper] || VehicleType.NONE
}

export function prismaToFrontendVehicle(veh: VehicleType): string {
  return veh.toLowerCase()
}

// --- User Intent ---
export function frontendToPrismaIntent(intent: string): UserIntent {
  switch (intent) {
    case 'find-work':
      return UserIntent.FIND_WORK
    case 'post-work':
      return UserIntent.POST_WORK
    case 'find-service':
      return UserIntent.FIND_SERVICE
    case 'offer-service':
      return UserIntent.OFFER_SERVICE
    default:
      return UserIntent.FIND_WORK
  }
}

export function prismaToFrontendIntent(intent: UserIntent): string {
  switch (intent) {
    case UserIntent.FIND_WORK:
      return 'find-work'
    case UserIntent.POST_WORK:
      return 'post-work'
    case UserIntent.FIND_SERVICE:
      return 'find-service'
    case UserIntent.OFFER_SERVICE:
      return 'offer-service'
    default:
      return 'find-work'
  }
}
