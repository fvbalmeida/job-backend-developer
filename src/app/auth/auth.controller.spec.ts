import { TestingModule, Test } from "@nestjs/testing"

import { authServiceMock } from "@/shared/__mocks__/review.mock"
import { AuthController } from "./auth.controller"

describe("AuthController Test", () => {
  let authController: AuthController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock],
    }).compile()

    authController = moduleFixture.get<AuthController>(AuthController)
  })

  it("Should be defined", () => {
    expect(authController).toBeDefined()
  })

  it("Should login", async () => {
    const result = await authController.login(authServiceMock)
    expect(result).toEqual({ access_token: "mockToken" })
  })
})
