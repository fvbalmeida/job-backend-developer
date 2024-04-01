import axios from "axios"

import { TestingModule, Test } from "@nestjs/testing"
import { InternalServerErrorException, NotFoundException } from "@nestjs/common"

import { OmdbService } from "./omdb.service"
import {
  imdbIDSearchResponse,
  titleSearchResponse,
} from "@/shared/__mocks__/review.mock"

jest.mock("axios")

describe("OmdbService Test", () => {
  let omdbService: OmdbService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [OmdbService],
    }).compile()

    omdbService = moduleFixture.get<OmdbService>(OmdbService)
  })
  it("Should be defined", () => {
    expect(omdbService).toBeDefined()
  })

  it("should search movies by title and return an array of SearchByTitleResponse", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: { Search: titleSearchResponse } })

    const result = await omdbService.searchMoviesByTitle("Filme Mock")

    expect(result).toEqual(titleSearchResponse)
  })

  it("should search movies by imdbID and return a getByImdbIDResponse", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: imdbIDSearchResponse })

    const result = await omdbService.getMovieByImdbID("tt12345")

    expect(result).toEqual(imdbIDSearchResponse)
  })

  it("should throw NotFoundException when movie is not found searching by title", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: { Error: "Movie not found" } })

    expect(omdbService.searchMoviesByTitle("Filme Mock")).rejects.toThrow(
      NotFoundException,
    )
  })

  it("should throw NotFoundException when movie is not found searching by imdbID", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: { Error: "Movie not found" } })

    expect(omdbService.getMovieByImdbID("tt12345")).rejects.toThrow(
      NotFoundException,
    )
  })

  it("should throw InternalServerErrorException when an error occurs searching by title", async () => {
    axios.get = jest.fn().mockRejectedValue(new Error("Internal Server Error"))

    await expect(omdbService.searchMoviesByTitle("Filme Mock")).rejects.toThrow(
      InternalServerErrorException,
    )
  })

  it("should throw InternalServerErrorException when an error occurs searching by imdbID", async () => {
    axios.get = jest.fn().mockRejectedValue(new Error("Internal Server Error"))

    await expect(omdbService.getMovieByImdbID("tt12345")).rejects.toThrow(
      InternalServerErrorException,
    )
  })
})
