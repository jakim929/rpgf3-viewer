import { getApplicationsFromEAS } from '@/lib/getApplicationsFromEAS';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import { optimism } from 'viem/chains';
import { Button } from './components/ui/button';
import { ApplicationCard } from './components/ApplicationCard/ApplicationCard';

export const AttestationListView = () => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['applications'],
    queryFn: async ({ pageParam }) => getApplicationsFromEAS(optimism.id, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div>
      <div className='flex flex-col gap-3 m-3'>
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.data.map((project) => (
              <ApplicationCard key={project.id} project={project} />
            ))}
          </Fragment>
        ))}
      </div>

      <div>
        <Button type='button' onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  );
};
