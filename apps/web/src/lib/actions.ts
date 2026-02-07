"use server"

import { prisma } from "./prisma"

export interface SchoolWithLocation {
  id: number
  name_latin: string
  name_arabic: string
  address_latin: string
  address_arabic: string
  type: string
  level: string
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
    name_latin: school.name_latin,
    name_arabic: school.name_arabic,
    address_latin: school.address_latin,
    address_arabic: school.address_arabic,
    type: school.type,
    level: school.level,
    latitude: school.latitude,
    longitude: school.longitude,
    commune: school.commune.name_latin,
    province: school.commune.province.name_latin,
    region: school.commune.province.region.name_latin
  }))
}

// Fetch all filter options (regions, provinces, communes)
export async function getFilterOptions(): Promise<FilterOptionsData> {
  const [regions, provinces, communes] = await Promise.all([
    prisma.region.findMany({ orderBy: { name_latin: 'asc' } }),
    prisma.province.findMany({ orderBy: { name_latin: 'asc' } }),
    prisma.commune.findMany({ orderBy: { name_latin: 'asc' } })
  ])

  return {
    regions: regions.map(r => r.name_latin),
    provinces: provinces.map(p => p.name_latin),
    communes: communes.map(c => c.name_latin)
  }
}

// Get provinces by selected regions
export async function getProvincesByRegions(regionNames: string[]): Promise<string[]> {
  if (regionNames.length === 0) {
    const provinces = await prisma.province.findMany({ orderBy: { name_latin: 'asc' } })
    return provinces.map(p => p.name_latin)
  }

  const provinces = await prisma.province.findMany({
    where: {
      region: {
        name_latin: { in: regionNames }
      }
    },
    orderBy: { name_latin: 'asc' }
  })

  return provinces.map(p => p.name_latin)
}

// Get communes by selected provinces
export async function getCommunesByProvinces(provinceNames: string[]): Promise<string[]> {
  if (provinceNames.length === 0) {
    const communes = await prisma.commune.findMany({ orderBy: { name_latin: 'asc' } })
    return communes.map(c => c.name_latin)
  }

  const communes = await prisma.commune.findMany({
    where: {
      province: {
        name_latin: { in: provinceNames }
      }
    },
    orderBy: { name_latin: 'asc' }
  })

  return communes.map(c => c.name_latin)
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
    whereClause.commune = { name_latin: { in: filters.communes } }
  } else if (filters.provinces?.length) {
    whereClause.commune = {
      province: { name_latin: { in: filters.provinces } }
    }
  } else if (filters.regions?.length) {
    whereClause.commune = {
      province: {
        region: { name_latin: { in: filters.regions } }
      }
    }
  }

  // Add search query filter
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    whereClause.OR = [
      { name_latin: { contains: searchTerm } },
      { name_arabic: { contains: searchTerm } },
      { address_latin: { contains: searchTerm } },
      { address_arabic: { contains: searchTerm } },
      { commune: { name_latin: { contains: searchTerm } } },
      { commune: { province: { name_latin: { contains: searchTerm } } } },
      { commune: { province: { region: { name_latin: { contains: searchTerm } } } } }
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
    name_latin: school.name_latin,
    name_arabic: school.name_arabic,
    address_latin: school.address_latin,
    address_arabic: school.address_arabic,
    type: school.type,
    level: school.level,
    latitude: school.latitude,
    longitude: school.longitude,
    commune: school.commune.name_latin,
    province: school.commune.province.name_latin,
    region: school.commune.province.region.name_latin
  }))
}

export async function getStarCount() {
  const response = await fetch('https://api.github.com/repos/avycenna/opendata');
  const data = await response.json();
  const stars = data.stargazers_count || 0;
  return stars;
}
