import { TestingModule, Test } from "@nestjs/testing"

import { userServiceMock } from "@/shared/__mocks__/review.mock"
import { UserController } from "./user.controller"

describe("ReviewController", () => {
  let userController: UserController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    }).compile()

    userController = moduleFixture.get<UserController>(UserController)
  })

  it("Should be defined", () => {
    expect(userController).toBeDefined()
  })

  it("Should seed users", async () => {
    const result = await userController.seedUsers()
    expect(result).toEqual("Users seeded")
  })
})
