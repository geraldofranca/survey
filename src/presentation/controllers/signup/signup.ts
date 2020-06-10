import { HttpResponse, HttpRequest, Controller, AddAccount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpResquest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpResquest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
