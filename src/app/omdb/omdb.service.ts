import axios from "axios"

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"

import {
  MovieType,
  SearchByTitleResponse,
  getByImdbIDResponse,
} from "@/shared/types/omdb.types"

@Injectable()
export class OmdbService {
  private readonly apiKey: string = process.env.API_KEY
  private readonly omdbUrl: string = process.env.OMDB_URL

  async fetchDatafromOmdb(params: Record<string, any>): Promise<any> {
    try {
      const endpoint = this.omdbUrl
      const response = await axios.get(endpoint, { params })
      if (response.data.Error) {
        throw new NotFoundException(response.data.Error)
      }
      return response.data
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException(
        `Error fetching data from OMDB: ${error.message}`,
      )
    }
  }

  async searchMoviesByTitle(
    title: string,
    type: MovieType = MovieType.Movie,
  ): Promise<SearchByTitleResponse[]> {
    const params = { apikey: this.apiKey, s: title, type }
    return await this.fetchDatafromOmdb(params).then(
      (response) => response.Search,
    )
  }

  async getMovieByImdbID(imdbID: string): Promise<getByImdbIDResponse> {
    const params = { apikey: this.apiKey, i: imdbID }
    return await this.fetchDatafromOmdb(params)
  }
}
