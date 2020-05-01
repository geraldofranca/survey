import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpResquest: HttpRequest): HttpResponse {
    if (!httpResquest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpResquest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
