import CollectionRunLayout from 'components/collectionRuns/CollectionRunLayout'
import ErrorPage from './ErrorPage'
import RequestList from './RequestList'
import {createBrowserRouter} from 'react-router-dom'
import Collection from './Collection'
import CollectionRuns from './CollectionRuns'
import Collections from './Collections'
import CreateMonitor from './CreateMonitor'
import CreateRequest from './CreateRequest'
import EditMonitor from './EditMonitor'
import EditRequest from './EditRequest'
import Monitor from './Monitor'
import Monitors from './Monitors'
import Root from './Root'

const router = createBrowserRouter([
  {
    'path': '/',
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: 'collections',
        element: <Collections/>,
        children: [
          {
            path: ':collectionId',
            element: <Collection/>,
            children: [
              {
                path: 'requests',
                element: <RequestList/>,
                children: [
                  {
                    path: 'new',
                    element: <CreateRequest/>
                  },
                  {
                    path: ':requestId/edit',
                    element: <EditRequest/>
                  },
                ],
              },
            ],
          },
        ]
      },
      {
        path: 'monitors',
        element: <Monitors/>,
        children: [
          {
            path: 'new',
            element: <CreateMonitor/>
          },
          {
            path: ':id/edit',
            element: <EditMonitor/>,
          },
          {
            path: ':id',
            element: <Monitor/>,
            children: [
              {
                path: ':collectionId',
                element: <CollectionRuns/>
              },
            ],
          },
        ]
      },
      {
        path: 'collection-runs/:collectionId',
        element: <CollectionRunLayout>
          <CollectionRuns/>
        </CollectionRunLayout>
      },
    ]
  }
])

export default router