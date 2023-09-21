import { getApplicationsFromEAS } from '@/lib/getApplicationsFromEAS'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment } from 'react'
import { optimism } from 'viem/chains'
import { Button } from './components/ui/button'
import { ApplicationCard } from './components/ApplicationCard/ApplicationCard'

import { json2csv } from 'json-2-csv'
import { fetchApplicationMetadata } from '@/lib/useApplicationMetadata'

const useApplications = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['applications'],
    queryFn: async ({ pageParam }) =>
      getApplicationsFromEAS(optimism.id, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}

const ExportToCSVButton = () => {
  const { data } = useApplications()
  const queryClient = useQueryClient()

  return (
    <Button
      disabled={!data}
      onClick={async () => {
        if (!data) {
          return
        }

        const exportableData = (
          await Promise.all(
            data.pages.flatMap((page) =>
              page.data.map(async (applicationAttestation) => {
                const metadata = await queryClient
                  .fetchQuery({
                    queryKey: [
                      applicationAttestation.attestation.applicationMetadataPtr,
                    ],
                    queryFn: () =>
                      fetchApplicationMetadata(
                        applicationAttestation.attestation
                          .applicationMetadataPtr,
                      ),
                  })
                  .catch((err) => {
                    return
                  })
                if (!metadata) {
                  return
                }
                return {
                  projectId: applicationAttestation.id,
                  displayName: applicationAttestation.attestation.displayName,
                  applicantType: metadata.applicantType,
                  websiteUrl: metadata.websiteUrl,
                  bio: metadata.bio,
                  metadataPtr:
                    applicationAttestation.attestation.applicationMetadataPtr,
                }
              }),
            ),
          )
        ).filter((x) => !!x)

        const csvText = await json2csv(exportableData as any)

        const blob = new Blob([csvText], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'rpgf3-data.csv'
        link.href = url
        link.click()
      }}
    >
      Export to CSV
    </Button>
  )
}

export const AttestationListView = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useApplications()
  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div>
      <ExportToCSVButton />
      <div className="flex flex-col gap-3 m-3">
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.data.map((project) => (
              <ApplicationCard key={project.id} project={project} />
            ))}
          </Fragment>
        ))}
      </div>

      <div>
        <Button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  )
}
