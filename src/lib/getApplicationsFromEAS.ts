import { ApplicationEASSchemaId } from '@/constants/ApplicationEASAttestation'
import { EASGraphqlEndpoints } from '@/constants/EASGraphqlEndpoints'
import { gql, request } from 'graphql-request'
import { hexToBigInt, isHex } from 'viem'
import { z } from 'zod'

const TAKE = 21

// This parses the decoded json blob from the attestation
// alternative is to get the raw payload and schema and decode it on the frontend using the eas-sdk
const applicationAttestationDataSchema = z
  .tuple([
    z.object({
      name: z.literal('displayName'),
      type: z.literal('string'),
      signature: z.literal('string displayName'),
      value: z.object({
        name: z.literal('displayName'),
        type: z.literal('string'),
        value: z.string(),
      }),
    }),
    z.object({
      name: z.literal('applicationMetadataPtrType'),
      type: z.literal('uint256'),
      signature: z.literal('uint256 applicationMetadataPtrType'),
      value: z.object({
        name: z.literal('applicationMetadataPtrType'),
        type: z.literal('uint256'),
        value: z.object({
          type: z.literal('BigNumber'),
          hex: z.string().startsWith('0x').refine(isHex),
        }),
      }),
    }),
    z.object({
      name: z.literal('applicationMetadataPtr'),
      type: z.literal('string'),
      signature: z.literal('string applicationMetadataPtr'),
      value: z.object({
        name: z.literal('applicationMetadataPtr'),
        type: z.literal('string'),
        value: z.string(),
      }),
    }),
  ])
  .transform(([displayNameVal, metadataPtrTypeVal, metadataPtrVal]) => {
    const displayName = displayNameVal.value.value
    const applicationMetadataPtrType = hexToBigInt(
      metadataPtrTypeVal.value.value.hex,
    )
    const applicationMetadataPtr = metadataPtrVal.value.value
    return {
      displayName,
      applicationMetadataPtrType,
      applicationMetadataPtr,
    }
  })

// I'm a graphql n00b so I'm pretty sure there's a way to make this more concise
const GetApplicationAttestationFirstQuery = gql`
  query GetApplicationAttestationsFirst(
    $where: AttestationWhereInput!
    $orderBy: [AttestationOrderByWithRelationInput!]
    $take: Int
  ) {
    attestations(where: $where, orderBy: $orderBy, take: $take) {
      id
      decodedDataJson
      timeCreated
      txid
    }
  }
`

const GetApplicationAttestationSubsequentQuery = gql`
  query GetApplicationAttestationsSubsequent(
    $where: AttestationWhereInput!
    $orderBy: [AttestationOrderByWithRelationInput!]
    $take: Int
    $cursor: String
  ) {
    attestations(where: $where, orderBy: $orderBy, cursor: {id: $cursor}, take: $take) {
      id
      decodedDataJson
      timeCreated
      txid
    }
  }

`

const baseQueryParams = {
  where: {
    schemaId: {
      equals: ApplicationEASSchemaId,
    },
    revoked: {
      equals: false,
    },
  },
  orderBy: [
    {
      timeCreated: 'desc',
    },
  ],
  take: TAKE,
}

// calls the EAS public graphql API to fetch the attestation
export const getApplicationsFromEAS = async (
  chainId: number,
  cursor: string | null,
) => {
  const result = await request<{
    attestations: Array<{ id: string; decodedDataJson: string }>
  }>(
    EASGraphqlEndpoints[chainId],
    cursor
      ? GetApplicationAttestationSubsequentQuery
      : GetApplicationAttestationFirstQuery,
    {
      ...baseQueryParams,
      ...(cursor ? { cursor } : {}),
    },
  )

  if (!result || !result.attestations) {
    throw Error('Graphql query error')
  }

  if (result.attestations.length === 0) {
    // React Query will not accept undefined as a value
    // better to delineate between no attestation and an error
    return {
      data: [],
      nextCursor: null,
    }
  }

  const dataResult = result.attestations.map((attestation) => {
    return {
      id: attestation.id,
      attestation: applicationAttestationDataSchema.parse(
        JSON.parse(attestation.decodedDataJson),
      ),
    }
  })

  if (dataResult.length === TAKE) {
    return {
      data: dataResult.slice(0, -1),
      nextCursor: dataResult[dataResult.length - 1].id,
    }
  }
  return {
    data: dataResult,
    nextCursor: null,
  }
}
