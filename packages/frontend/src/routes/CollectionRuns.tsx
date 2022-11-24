import {useLazyQuery} from '@apollo/client'
import CollectionRunsContainer from 'components/collectionRuns/CollectionRunsContainer'
import Loader from 'components/shared/Loader'
import {PaginateCollectionRuns} from 'graphql/queries'
import {useToast} from 'hooks/ToastProvider'
import {useEffect, useRef} from 'react'
import {Button, ButtonGroup} from 'react-daisyui'
import {AiOutlineToTop} from 'react-icons/ai'
import {IoMdRefresh} from 'react-icons/io'
import {useParams} from 'react-router-dom'
import {CollectionRun} from 'types'

const variables = (collectionId?: string, cursor = '') => {
  return (
    {
      data: {
        collectionIds: [Number(collectionId)],
        cursor,
        take: 4,
      }
    }
  )
}

export default function CollectionRuns() {
  const {collectionId} = useParams()
  const {addToast} = useToast()
  const bottomRef = useRef<HTMLButtonElement>(null)
  const topRef = useRef<HTMLButtonElement>(null)
  const [,
    {
      data,
      error,
      loading,
      refetch,
      fetchMore,
    }] = useLazyQuery<{ paginateCollectionRuns: { items: CollectionRun[], cursor: string, hasMore: boolean } }>(PaginateCollectionRuns,
    {
      notifyOnNetworkStatusChange: true,
      variables: variables(collectionId),
    })

  useEffect(() => {
    if (!collectionId) return
    console.log('new collection id', collectionId)
    refetch({
      variables: variables(collectionId)
    })
  }, [collectionId])


  useEffect(() => {
    if (error) addToast(error.message, 'error')
  }, [error])

  useEffect(() => {
    if (!data) return
    data.paginateCollectionRuns.items.length && bottomRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [bottomRef, data])


  if (loading) return <Loader/>
  if (!data) return <></>

  return (
    <div className='flex flex-col gap-4 items-start mx-auto w-full'>
      <Button ref={topRef} size='sm' className='bg-sky-blue' onClick={() => refetch({
        variables: variables(collectionId, data.paginateCollectionRuns.cursor)
      })}>
        {loading ? (<Loader size='20'/>) : (
          <IoMdRefresh size='24' className='text-white'/>
        )}
      </Button>
      <CollectionRunsContainer collectionRuns={data.paginateCollectionRuns.items}/>
      <ButtonGroup className='gap-4 items-end'>
        <Button size='md' disabled={!data.paginateCollectionRuns.hasMore}
                ref={bottomRef}
                className='bg-cadmium-orange'
                onClick={async () => {
                  await fetchMore({
                    variables: variables(collectionId, data.paginateCollectionRuns.cursor)
                  })
                }}
        >
          {loading ? (<Loader size='20'/>) : (
            'Load More'
          )}
        </Button>
        <Button size='md' className='bg-secondary' startIcon={<AiOutlineToTop size='24'
                                                                              onClick={() => topRef.current?.scrollIntoView({behavior: 'smooth'})}
        />}/>
      </ButtonGroup>
    </div>

  )
}