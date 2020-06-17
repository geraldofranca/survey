import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpResquest.body)
    return new Promise(resolve => resolve(null))
  }
}
