import { isAddress } from 'viem'
import { z } from 'zod'

const AddressSchema = z
  .string()
  .refine(isAddress, { message: 'Invalid address' })

export const BasicInfoSectionSchema = z.object({
  applicantType: z.enum(['PROJECT', 'INDIVIDUAL']),
  displayName: z.string().min(1).max(80),
  websiteUrl: z.string().url().min(1).max(2000),
  bio: z.string().min(1).max(80),
  fundingEmail: z.string().email().min(1).max(80),
  howDidYouHear: z.string().max(2000).optional(),
})

export const ContributionCategoryEnum = z.enum([
  'CONTRACT_ADDRESS',
  'GITHUB_REPO',
  'OTHER',
])

const ContributionLinkSchema = z
  .object({
    type: ContributionCategoryEnum,
    url: z.string().url().min(1).max(2000),
    description: z.string().min(1).max(80),
  })
  .strict()

const ImpactMetricSchema = z
  .object({
    description: z.string().min(1).max(40),
    number: z.number(),
    url: z.string().url().min(1).max(2000),
  })
  .strict()

export const ImpactCategoryEnum = z.enum([
  'OP_STACK',
  'COLLECTIVE_GOVERNANCE',
  'DEVELOPER_ECOSYSTEM',
  'END_USER_EXPERIENCE_AND_ADOPTION',
])

export const ImpactStatementSectionSchema = z.object({
  contributionDescription: z.string().min(250).max(800),
  contributionLinks: z.array(ContributionLinkSchema),
  impactCategory: z.array(ImpactCategoryEnum).min(1),
  impactDescription: z.string().min(250).max(800),
  impactMetrics: z.array(ImpactMetricSchema).min(1),
})

export const FundingSourceEnum = z.enum([
  'GOVERNANCE_FUND',
  'PARTNER_FUND',
  'RETROPGF_1',
  'RETROPGF_2',
  'REVENUE',
  'OTHER',
])

export const FundingSourceCurrencyEnum = z.enum(['OP', 'USD'])

const FundingSourceSchema = z.union([
  z.object({
    type: z.enum([
      FundingSourceEnum.Enum.GOVERNANCE_FUND,
      FundingSourceEnum.Enum.PARTNER_FUND,
      FundingSourceEnum.Enum.RETROPGF_2,
    ]),
    currency: z.enum([FundingSourceCurrencyEnum.Enum.OP]),
    amount: z.number().min(1),
    description: z.string().max(80).optional(),
  }),
  z.object({
    type: z.enum([
      FundingSourceEnum.Enum.RETROPGF_1,
      FundingSourceEnum.Enum.REVENUE,
      FundingSourceEnum.Enum.OTHER,
    ]),
    currency: z.enum([FundingSourceCurrencyEnum.Enum.USD]),
    amount: z.number().min(1),
    description: z.string().max(80).optional(),
  }),
])

export const FundingInfoSectionSchema = z.object({
  fundingSources: z.array(FundingSourceSchema),
})

export const understoodKYCRequirements = 'understoodKYCRequirements' as const
export const understoodFundClaimPeriod = 'understoodFundClaimPeriod' as const
export const certifiedNotDesignatedOrSanctionedOrBlocked =
  'certifiedNotDesignatedOrSanctionedOrBlocked' as const
export const certifiedNotSponsoredByPoliticalFigureOrGovernmentEntity =
  'certifiedNotSponsoredByPoliticalFigureOrGovernmentEntity' as const
export const certifiedNotBarredFromParticipating =
  'certifiedNotBarredFromParticipating' as const

export const PayoutInfoSectionSchema = z.object({
  payoutAddress: AddressSchema,
  [understoodKYCRequirements]: z.literal(true),
  [understoodFundClaimPeriod]: z.literal(true),
  [certifiedNotDesignatedOrSanctionedOrBlocked]: z.literal(true),
  [certifiedNotSponsoredByPoliticalFigureOrGovernmentEntity]: z.literal(true),
  [certifiedNotBarredFromParticipating]: z.literal(true),
})

export const RPGF3ApplicationSchema = BasicInfoSectionSchema.merge(
  ImpactStatementSectionSchema,
)
  .merge(FundingInfoSectionSchema)
  .merge(PayoutInfoSectionSchema)
  .strict()

export const OffchainRPGF3ApplicationSchema = RPGF3ApplicationSchema.omit({
  displayName: true,
}).strict()

export const RPGF3ApplicationToOnOffChainTransformer =
  RPGF3ApplicationSchema.transform((profile) => {
    const { displayName, ...metadata } = profile
    return {
      onchain: {
        displayName,
      },
      offchain: {
        ...metadata,
      },
    }
  })

export const OffchainPublicRPGF3ApplicationSchema =
  OffchainRPGF3ApplicationSchema.omit({
    fundingEmail: true,
    howDidYouHear: true,
  }).strict()

export const OffchainPublicAndPrivateRPGF3ApplicationParser =
  OffchainRPGF3ApplicationSchema.transform(
    ({ fundingEmail, howDidYouHear, ...rest }) => ({
      privateSection: {
        fundingEmail,
        howDidYouHear,
      },
      publicSection: {
        ...rest,
      },
    }),
  )

export type OffchainRPGF3Application = z.infer<
  typeof OffchainRPGF3ApplicationSchema
>

export type FundingCurrency = z.infer<typeof FundingSourceCurrencyEnum>
export type FundingCategory = z.infer<typeof FundingSourceEnum>
export type FundingSource = z.infer<typeof FundingSourceSchema>
export type ContributionLink = z.infer<typeof ContributionLinkSchema>
export type ContributionCategory = z.infer<typeof ContributionCategoryEnum>
export type ImpactMetric = z.infer<typeof ImpactMetricSchema>
export type ImpactCategory = z.infer<typeof ImpactCategoryEnum>
export type RPGF3Application = z.infer<typeof RPGF3ApplicationSchema>
