declare module 'serverless-http' {
  import type { RequestHandler } from 'express'
  function serverless(handler: RequestHandler): any
  export default serverless
}
