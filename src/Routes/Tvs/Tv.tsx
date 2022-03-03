import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { DEFAULT_IMG, getAiringTodayTv, IGetTvResult } from "../../api";
import { makeImagePath } from "../../utils";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import TopRatedTv from "./TopRatedTv";
import TvModal from "./TvModal";
import PopularTv from "./PopularTv";
import { theme } from "../../theme";

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
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
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

function Tv() {
  const history = useHistory();
  const { data: tvsData, isLoading: tvsIsLoading } = useQuery<IGetTvResult>(
    ["tv", "airing_today"],
    getAiringTodayTv
  );
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const decreaseIndex = () => {
    if (tvsData) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalMovies = tvsData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const increaseIndex = () => {
    if (tvsData) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalTvs = tvsData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  return (
    <Wrapper>
      {tvsIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(tvsData?.results[0].backdrop_path || "")}
          >
            <Title>{tvsData?.results[0].name}</Title>
            <Overview>{tvsData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>Airing today</SliderTitle>
            <Prev whileHover={{ opacity: 1 }} onClick={decreaseIndex}>
              <FontAwesomeIcon icon={faChevronLeft} size="2x" />
            </Prev>
            <AnimatePresence
              custom={back}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {tvsData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <Next whileHover={{ opacity: 1 }} onClick={increaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2x" />
            </Next>
          </Slider>
          <TopRatedTv />
          <PopularTv />
          <TvModal />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
