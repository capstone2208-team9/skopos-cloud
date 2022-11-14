import { GetCollection, GetCollectionNames } from "graphql/queries";
import { CreateOneMonitor} from "graphql/mutations";
import { graphql } from "msw";

let lastMonitorId = 0
const monitors: any = []

export const handlers = [
  graphql.query(GetCollectionNames, (req, res, ctx) =>{
    console.log('mock')
    return res(
      ctx.data({
        collections: [
          {id: 1, title: 'Collection 1'},
          {id: 2, title: 'Collection 2'},
        ]
      })
    )
  }),

  graphql.query(GetCollection, (req, res,ctx) =>{
    const collection1 =  {collection:{id:1,title:"Collection 1",requests:[{id:2,title:"Post 1",body:"",url:"https://jsonplaceholder.typicode.com/posts/1",method:"GET",headers:{},stepNumber:1,assertions:[{id:2,expected:"200",property: "status",comparison:"is equal to",__typename:"Assertion"}],__typename:"Request"}],"__typename":"Collection"}}
    const collection2 =  {collection:{id:2,title:"Collection 2",requests:[{id:2,title:"Post 1",body:"",url:"https://jsonplaceholder.typicode.com/posts/1",method:"GET",headers:{},stepNumber:1,assertions:[{id:2,expected:"200",property:"status",comparison:"is equal to",__typename:"Assertion"}],__typename:"Request"}],"__typename":"Collection"}}
    const {where} = req.variables
    return res(
      ctx.data(where.id === 1 ? collection1 : collection2)
    )
  }),

  graphql.mutation(CreateOneMonitor, (req, res, ctx) => {
    console.log(req.variables)
    const newMonitor = {...req.variables.data, id: lastMonitorId++, __typename: "Monitor"}
    monitors.push()
    return res(
      ctx.data(newMonitor)
    )
  })
]