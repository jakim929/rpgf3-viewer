import { OffchainPublicRPGF3ApplicationSchema } from '@/lib/RPGF3ApplicationSchema'
import { useQuery } from '@tanstack/react-query'

export const fetchApplicationMetadata = async (metadataPtr?: string) => {
  if (!metadataPtr) {
    throw new Error('Metadata PTR is not defined')
  }
  const response = await fetch(metadataPtr)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const result = await response.json()

  return OffchainPublicRPGF3ApplicationSchema.parse(result)
}

export const useApplicationMetadata = (metadataPtr?: string) => {
  return useQuery([metadataPtr], () => fetchApplicationMetadata(metadataPtr), {
    enabled: !!metadataPtr, // Only run the query if metadataPTR is defined
  })
}
