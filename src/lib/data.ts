// Sample school data for Morocco - includes realistic geographic distribution
export interface School {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  region: string
  province: string
  commune: string
  schoolType: string
}

export interface FilterOptions {
  regions?: string[]
  provinces?: string[]
  communes?: string[]
}

// Sample schools distributed across Morocco
export const SCHOOLS: School[] = [
  // Casablanca-Settat Region
  { id: '1', name: 'École Primaire Moulay Hassan', latitude: 33.5731, longitude: -7.5898, address: 'Boulevard de la Corniche', region: 'Casablanca-Settat', province: 'Casablanca', commune: 'Casablanca', schoolType: 'Primaire' },
  { id: '2', name: 'Collège Ibn Sina', latitude: 33.5847, longitude: -7.6116, address: 'Quartier Maarif', region: 'Casablanca-Settat', province: 'Casablanca', commune: 'Casablanca', schoolType: 'Collège' },
  { id: '3', name: 'Lycée Mohamed V', latitude: 33.5950, longitude: -7.6333, address: 'Quartier Gauthier', region: 'Casablanca-Settat', province: 'Casablanca', commune: 'Casablanca', schoolType: 'Lycée' },
  { id: '4', name: 'École Primaire Settat', latitude: 33.0089, longitude: -7.6297, address: 'Centre Ville', region: 'Casablanca-Settat', province: 'Settat', commune: 'Settat', schoolType: 'Primaire' },

  // Rabat-Salé-Kénitra Region
  { id: '5', name: 'École Moulay Rachid', latitude: 34.0209, longitude: -6.8416, address: 'Avenue Mohammed V', region: 'Rabat-Salé-Kénitra', province: 'Rabat', commune: 'Rabat', schoolType: 'Primaire' },
  { id: '6', name: 'Collège Al-Qadi Ayyad', latitude: 34.0347, longitude: -6.8500, address: 'Quartier Agdal', region: 'Rabat-Salé-Kénitra', province: 'Rabat', commune: 'Rabat', schoolType: 'Collège' },
  { id: '7', name: 'École Primaire Salé', latitude: 34.0461, longitude: -6.7988, address: 'Centre Médina', region: 'Rabat-Salé-Kénitra', province: 'Salé', commune: 'Salé', schoolType: 'Primaire' },
  { id: '8', name: 'Lycée Kénitra', latitude: 34.2563, longitude: -6.5789, address: 'Boulevard Hassan II', region: 'Rabat-Salé-Kénitra', province: 'Kénitra', commune: 'Kénitra', schoolType: 'Lycée' },

  // Fès-Meknès Region
  { id: '9', name: 'École Al-Quaraouine', latitude: 34.0637, longitude: -5.0088, address: 'Médina Fès', region: 'Fès-Meknès', province: 'Fès', commune: 'Fès', schoolType: 'Primaire' },
  { id: '10', name: 'Collège Ibn Rochd', latitude: 34.0756, longitude: -5.0012, address: 'Nouvelle Ville', region: 'Fès-Meknès', province: 'Fès', commune: 'Fès', schoolType: 'Collège' },
  { id: '11', name: 'Lycée Moulay Driss', latitude: 34.0869, longitude: -4.9911, address: 'Quartier Jnan', region: 'Fès-Meknès', province: 'Fès', commune: 'Fès', schoolType: 'Lycée' },
  { id: '12', name: 'École Primaire Meknès', latitude: 33.8869, longitude: -5.5469, address: 'Centre Ville', region: 'Fès-Meknès', province: 'Meknès', commune: 'Meknès', schoolType: 'Primaire' },
  { id: '13', name: 'Collège Meknès', latitude: 33.8945, longitude: -5.5567, address: 'Quartier Nouvelle', region: 'Fès-Meknès', province: 'Meknès', commune: 'Meknès', schoolType: 'Collège' },

  // Marrakech-Safi Region
  { id: '14', name: 'École Jemaa el-Fnaa', latitude: 31.6295, longitude: -8.0088, address: 'Médina Marrakech', region: 'Marrakech-Safi', province: 'Marrakech', commune: 'Marrakech', schoolType: 'Primaire' },
  { id: '15', name: 'Collège Menara', latitude: 31.6088, longitude: -8.0097, address: 'Jardins Menara', region: 'Marrakech-Safi', province: 'Marrakech', commune: 'Marrakech', schoolType: 'Collège' },
  { id: '16', name: 'Lycée Al-Hasan II', latitude: 31.6362, longitude: -8.0177, address: 'Guéliz', region: 'Marrakech-Safi', province: 'Marrakech', commune: 'Marrakech', schoolType: 'Lycée' },
  { id: '17', name: 'École Primaire Safi', latitude: 32.2928, longitude: -9.2389, address: 'Port City', region: 'Marrakech-Safi', province: 'Safi', commune: 'Safi', schoolType: 'Primaire' },

  // Tanger-Tétouan-Al Hoceïma Region
  { id: '18', name: 'École Tanger', latitude: 35.7595, longitude: -5.8369, address: 'Boulevard Pasteur', region: 'Tanger-Tétouan-Al Hoceïma', province: 'Tanger-Assilah', commune: 'Tanger', schoolType: 'Primaire' },
  { id: '19', name: 'Collège Ibn Battouta', latitude: 35.7674, longitude: -5.8247, address: 'Quartier Nouvelle', region: 'Tanger-Tétouan-Al Hoceïma', province: 'Tanger-Assilah', commune: 'Tanger', schoolType: 'Collège' },
  { id: '20', name: 'Lycée Tanger', latitude: 35.7756, longitude: -5.8155, address: 'Centre Ville', region: 'Tanger-Tétouan-Al Hoceïma', province: 'Tanger-Assilah', commune: 'Tanger', schoolType: 'Lycée' },
  { id: '21', name: 'École Tétouan', latitude: 35.5697, longitude: -5.3625, address: 'Médina', region: 'Tanger-Tétouan-Al Hoceïma', province: 'Tétouan', commune: 'Tétouan', schoolType: 'Primaire' },

  // Eastern Region
  { id: '22', name: 'École Oujda', latitude: 34.6852, longitude: -1.9118, address: 'Centre Ville', region: 'Oriental', province: 'Oujda-Angad', commune: 'Oujda', schoolType: 'Primaire' },
  { id: '23', name: 'Collège Oujda', latitude: 34.6945, longitude: -1.9212, address: 'Quartier Nouvelle', region: 'Oriental', province: 'Oujda-Angad', commune: 'Oujda', schoolType: 'Collège' },
  { id: '24', name: 'Lycée Oujda', latitude: 34.7038, longitude: -1.9306, address: 'Agdal', region: 'Oriental', province: 'Oujda-Angad', commune: 'Oujda', schoolType: 'Lycée' },

  // Souss-Massa Region
  { id: '25', name: 'École Agadir', latitude: 30.4202, longitude: -9.5676, address: 'Centre Ville', region: 'Souss-Massa', province: 'Agadir-Ida-Outanane', commune: 'Agadir', schoolType: 'Primaire' },
  { id: '26', name: 'Collège Agadir', latitude: 30.4289, longitude: -9.5754, address: 'Quartier Nouvelle', region: 'Souss-Massa', province: 'Agadir-Ida-Outanane', commune: 'Agadir', schoolType: 'Collège' },
  { id: '27', name: 'Lycée Agadir', latitude: 30.4376, longitude: -9.5832, address: 'Dakhla District', region: 'Souss-Massa', province: 'Agadir-Ida-Outanane', commune: 'Agadir', schoolType: 'Lycée' },
  { id: '28', name: 'École Taroudant', latitude: 30.2740, longitude: -8.8763, address: 'Medina', region: 'Souss-Massa', province: 'Taroudant', commune: 'Taroudant', schoolType: 'Primaire' },

  // Drâa-Tafilalet Region
  { id: '29', name: 'École Merzouga', latitude: 31.9456, longitude: -4.0119, address: 'Oasis', region: 'Drâa-Tafilalet', province: 'Errachidia', commune: 'Merzouga', schoolType: 'Primaire' },
  { id: '30', name: 'Collège Zagora', latitude: 29.9395, longitude: -5.8394, address: 'Centre', region: 'Drâa-Tafilalet', province: 'Zagora', commune: 'Zagora', schoolType: 'Collège' },
]

export const REGIONS = Array.from(new Set(SCHOOLS.map(s => s.region))).sort()
export const PROVINCES = Array.from(new Set(SCHOOLS.map(s => s.province))).sort()
export const COMMUNES = Array.from(new Set(SCHOOLS.map(s => s.commune))).sort()
export const SCHOOL_TYPES = Array.from(new Set(SCHOOLS.map(s => s.schoolType))).sort()

export function getProvincesByRegions(regions?: string[]): string[] {
  if (!regions || regions.length === 0) return PROVINCES
  return Array.from(new Set(
    SCHOOLS.filter(s => regions.includes(s.region)).map(s => s.province)
  )).sort()
}

export function getCommunesByProvinces(provinces?: string[]): string[] {
  if (!provinces || provinces.length === 0) return COMMUNES
  return Array.from(new Set(
    SCHOOLS.filter(s => provinces.includes(s.province)).map(s => s.commune)
  )).sort()
}

export function filterSchools(options: FilterOptions): School[] {
  return SCHOOLS.filter(school => {
    if (options.regions?.length && !options.regions.includes(school.region)) return false
    if (options.provinces?.length && !options.provinces.includes(school.province)) return false
    if (options.communes?.length && !options.communes.includes(school.commune)) return false
    return true
  })
}

export function filterAndSearchSchools(options: FilterOptions, query: string): School[] {
  let results = filterSchools(options)
  
  if (query.trim()) {
    const q = query.toLowerCase()
    results = results.filter(school =>
      school.name.toLowerCase().includes(q) ||
      school.commune.toLowerCase().includes(q) ||
      school.province.toLowerCase().includes(q) ||
      school.region.toLowerCase().includes(q) ||
      school.schoolType.toLowerCase().includes(q)
    )
  }
  
  return results
}
