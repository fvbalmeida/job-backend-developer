import { TestingModule, Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { BadRequestException } from "@nestjs/common"

import { userRepositoryMock, userMock } from "@/shared/__mocks__/review.mock"
import { UserService } from "./user.service"
import { User } from "./entities/user.entity"

describe("UserService Test", () => {
  let userService: UserService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock.useValue,
        },
      ],
    }).compile()

    userService = moduleFixture.get<UserService>(UserService)
  })

  it("Should be defined", () => {
    expect(userService).toBeDefined()
  })

  it("Should seed user in database", async () => {
    const result = await userService.createUser()
    expect(result).toEqual("User seeded")
  })

  it("should throw BadRequestException when user already exists", async () => {
    userRepositoryMock.useValue.count.mockResolvedValueOnce(2)
    await expect(userService.createUser()).rejects.toThrow(BadRequestException)
  })

  it("Should find user by email", async () => {
    const user = await userService.findUserByEmail("mock@mail.com")
    expect(user).toEqual(userMock)
  })

  it("should throw Error when user not found", async () => {
    userRepositoryMock.useValue.findOneOrFail.mockRejectedValueOnce(new Error())
    await expect(userService.findUserByEmail("mock@mail.com")).rejects.toThrow(
      Error,
    )
  })
})
