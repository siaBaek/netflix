const API_KEY = "463887cc292e19068220ef7660901eae";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  vote_average: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// export interface IGetLatestResult {
//   title: string;
// }

interface ITopRated {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetTopRatedResult {
  results: ITopRated[];
}

interface IUpcoming {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetUpcomingResult {
  results: IUpcoming[];
}

interface IGenre {
  id: number;
  name: string;
}

export interface IGetMovieDetailResult {
  backdrop_path: string;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  release_date: Date;
  runtime: number;
  status: string;
  vote_average: number;
  vote_count: number;
  tagline: string;
  name?: string;
  title?: string;
}

interface ISeason {
  air_date: Date;
  episode_count: number;
  id: number;
  name: string;
}

export interface IGetTvDetailResult {
  backdrop_path: string;
  episode_run_time: number[];
  first_air_date: Date;
  genres: IGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: Date;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  overview: string;
  poster_path: string;
  seasons: ISeason[];
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_name: string;
  name: string;
  vote_average: string;
  overview: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export const getMovieDetail = (movieId: string) => {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=KR`
  ).then((response) => response.json());
};

export const getOnTheAirTv = () => {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
};

export const getAiringTodayTv = () => {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
};

export const getPopularTv = () => {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
};

export const getTopTv = () => {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
  ).then((response) => response.json());
};

export const getTvDetail = (tvId: string) => {
  return fetch(
    `${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR&append_to_response=KR`
  ).then((response) => response.json());
};

export const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1634157703702-3c124b455499?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80";

export const searchMovie = (query: string) => {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${query}&page=1&region=KR`
  ).then((response) => response.json());
};

export const searchTv = (query: string) => {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${query}&page=1&region=KR`
  ).then((response) => response.json());
};
