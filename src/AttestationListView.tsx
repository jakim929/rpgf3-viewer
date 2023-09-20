import { getApplicationsFromEAS } from '@/lib/getApplicationsFromEAS'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { optimism } from 'viem/chains'

export const AttestationListView = () => {
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
  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.data.map((project) => (
            <div>{JSON.stringify(project.id)}</div>
          ))}
        </Fragment>
      ))}
      <div>
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
}
