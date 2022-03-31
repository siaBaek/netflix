import { useQuery } from "react-query";
import { IGetMoviesResult, IGetTvResult } from "../api";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { makeImagePath } from "./../utils";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DEFAULT_IMG, searchMovie, searchTv } from "../api";
import { useLocation } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SearchModal from "./SearchModal";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { theme } from "../theme";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 100px;
`;

const Loader = styled.div`
  height: 20vh;
  ${theme.flexCenter}
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
`;

const Slider = styled.div`
  position: relative;
  top: 20px;
  margin-bottom: 300px;
  padding: 30px 0%;
`;

const SliderTitle = styled.h3`
  position: absolute;
  top: -10px;
  font-weight: 600;
  color: white;
  font-size: 28px;
  margin-left: 60px;
`;

const Prev = styled(motion.div)`
  height: 80%;
  cursor: pointer;
  ${theme.flexCenter}
  opacity: 0.3;
  position: absolute;
  left: 1rem;
  top: 100px;
  background-color: rgba(0, 0, 0, 1);
  z-index: 9;
`;

const Next = styled(motion.div)`
  height: 80%;
  cursor: pointer;
  ${theme.flexCenter}
  opacity: 0.3;
  position: absolute;
  right: 1rem;
  top: 100px;
  background-color: rgba(0, 0, 0, 1);
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 60px;
  margin-bottom: 400px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

export const Search = () => {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(
      ["movies", keyword],
      async () => keyword && searchMovie(keyword)
    );

  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
    ["tv", keyword],
    async () => keyword && searchTv(keyword)
  );

  const [movieIndex, setMovieIndex] = useState(0);
  const [tvIndex, setTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const right = faChevronRight as IconProp;

  const increaseMovieIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const increaseTvIndex = () => {
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = tvData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onMovieClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onTvClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  return (
    <Wrapper>
      {movieLoading && tvLoading && movieData && tvData ? (
        <Loader>검색 결과가 없습니다.</Loader>
      ) : movieData || tvData ? (
        <>
          {movieData && movieData.total_results > 0 && (
            <>
              <Banner
                bgPhoto={makeImagePath(
                  movieData?.results[0].backdrop_path || ""
                )}
              >
                <Title>{movieData?.results[0].title}</Title>
                <Overview>{movieData?.results[0].overview}</Overview>
              </Banner>
              <Slider>
                <SliderTitle>{keyword}로 찾은 영화</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={movieIndex}
                  >
                    {movieData?.results
                      .slice(offset * movieIndex, offset * movieIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onMovieClicked(movie.id)}
                          transition={{ type: "tween" }}
                          bgPhoto={
                            movie.backdrop_path
                              ? makeImagePath(movie.backdrop_path, "w500")
                              : DEFAULT_IMG
                          }
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <Next whileHover={{ opacity: 1 }} onClick={increaseMovieIndex}>
                  <FontAwesomeIcon icon={right} size="2x" />
                </Next>
              </Slider>
            </>
          )}
          {tvData && tvData.total_results > 0 && (
            <>
              <Banner
                bgPhoto={makeImagePath(tvData?.results[0].backdrop_path || "")}
              >
                <Title>{tvData?.results[0].name}</Title>
                <Overview>{tvData?.results[0].overview}</Overview>
              </Banner>
              <Slider>
                <SliderTitle>{keyword}로 찾은 TV 시리즈</SliderTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={tvIndex}
                  >
                    {tvData?.results
                      .slice(offset * tvIndex, offset * tvIndex + offset)
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + ""}
                          key={tv.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onTvClicked(tv.id)}
                          transition={{ type: "tween" }}
                          bgPhoto={
                            tv.backdrop_path
                              ? makeImagePath(tv.backdrop_path, "w500")
                              : DEFAULT_IMG
                          }
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <Next whileHover={{ opacity: 1 }} onClick={increaseTvIndex}>
                  <FontAwesomeIcon icon={right} size="2x" />
                </Next>
              </Slider>
            </>
          )}
          <SearchModal />
        </>
      ) : (
        <>
          <div>No Results</div>
        </>
      )}
    </Wrapper>
  );
};

export default Search;
