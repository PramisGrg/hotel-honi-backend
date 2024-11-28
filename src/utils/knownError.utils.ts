/* 
! this class below will be used to throw error in any level of the app, it will be responsible for
! sending response with a suitable message to client. Will be handled by generic error handler
*/
export default class KnownError extends Error {
  message: string
  status: number
  constructor(message: string, status?: number) {
    super()
    this.message = message
    this.status = status ? status : 400
  }
}
