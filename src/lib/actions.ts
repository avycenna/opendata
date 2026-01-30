"use server"

import { prisma } from "./prisma"

export interface SchoolWithLocation {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  commune: string
  province: string
  region: string
}

export interface FilterOptionsData {
  regions: string[]
  provinces: string[]
  communes: string[]
}

// Fetch all schools with their location hierarchy
export async function getSchools(): Promise<SchoolWithLocation[]> {
  const schools = await prisma.school.findMany({
    include: {
      commune: {
        include: {
          province: {
            include: {
              region: true
            }
          }
        }
      }
    }
  })

  return schools.map(school => ({
    id: school.id,
    name: school.name,
    address: school.address,
    latitude: school.latitude,
    longitude: school.longitude,
    commune: school.commune.name,
    province: school.commune.province.name,
    region: school.commune.province.region.name
  }))
}

// Fetch all filter options (regions, provinces, communes)
export async function getFilterOptions(): Promise<FilterOptionsData> {
  const [regions, provinces, communes] = await Promise.all([
    prisma.region.findMany({ orderBy: { name: 'asc' } }),
    prisma.province.findMany({ orderBy: { name: 'asc' } }),
    prisma.commune.findMany({ orderBy: { name: 'asc' } })
  ])

  return {
    regions: regions.map(r => r.name),
    provinces: provinces.map(p => p.name),
    communes: communes.map(c => c.name)
  }
}

// Get provinces by selected regions
export async function getProvincesByRegions(regionNames: string[]): Promise<string[]> {
  if (regionNames.length === 0) {
    const provinces = await prisma.province.findMany({ orderBy: { name: 'asc' } })
    return provinces.map(p => p.name)
  }

  const provinces = await prisma.province.findMany({
    where: {
      region: {
        name: { in: regionNames }
      }
    },
    orderBy: { name: 'asc' }
  })

  return provinces.map(p => p.name)
}

// Get communes by selected provinces
export async function getCommunesByProvinces(provinceNames: string[]): Promise<string[]> {
  if (provinceNames.length === 0) {
    const communes = await prisma.commune.findMany({ orderBy: { name: 'asc' } })
    return communes.map(c => c.name)
  }

  const communes = await prisma.commune.findMany({
    where: {
      province: {
        name: { in: provinceNames }
      }
    },
    orderBy: { name: 'asc' }
  })

  return communes.map(c => c.name)
}

// Filter and search schools
export async function filterAndSearchSchools(
  filters: { regions?: string[]; provinces?: string[]; communes?: string[] },
  query: string
): Promise<SchoolWithLocation[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {}

  // Build commune filter based on hierarchy
  if (filters.communes?.length) {
    whereClause.commune = { name: { in: filters.communes } }
  } else if (filters.provinces?.length) {
    whereClause.commune = {
      province: { name: { in: filters.provinces } }
    }
  } else if (filters.regions?.length) {
    whereClause.commune = {
      province: {
        region: { name: { in: filters.regions } }
      }
    }
  }

  // Add search query filter
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    whereClause.OR = [
      { name: { contains: searchTerm } },
      { address: { contains: searchTerm } },
      { commune: { name: { contains: searchTerm } } },
      { commune: { province: { name: { contains: searchTerm } } } },
      { commune: { province: { region: { name: { contains: searchTerm } } } } }
    ]
  }

  const schools = await prisma.school.findMany({
    where: whereClause,
    include: {
      commune: {
        include: {
          province: {
            include: {
              region: true
            }
          }
        }
      }
    }
  })

  return schools.map(school => ({
    id: school.id,
    name: school.name,
    address: school.address,
    latitude: school.latitude,
    longitude: school.longitude,
    commune: school.commune.name,
    province: school.commune.province.name,
    region: school.commune.province.region.name
  }))
}
