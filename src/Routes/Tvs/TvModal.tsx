import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { DEFAULT_IMG, getTvDetail, IGetTvDetailResult } from "../../api";
import { makeImagePath } from "../../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { useSetRecoilState } from "recoil";
import { isDetail } from "../../atom";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

function TvModal() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const setDetail = useSetRecoilState(isDetail);

  const {
    data: detailData,
    isLoading: detailIsLoading,
    refetch,
  } = useQuery<IGetTvDetailResult>(
    ["tv", bigTvMatch?.params.tvId],
    async () => bigTvMatch && getTvDetail(bigTvMatch?.params.tvId),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (bigTvMatch?.params.tvId) {
      refetch();
    }
  }, [bigTvMatch?.params.tvId, refetch]);

  const onOverlayClick = () => {
    history.push("/tv");
    setDetail(false);
  };

  return (
    <AnimatePresence>
      {bigTvMatch ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <BigMovie
            style={{ top: scrollY.get() + 100 }}
            layoutId={bigTvMatch.params.tvId}
          >
            {detailData && (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent),  url(${
                      detailData.backdrop_path
                        ? makeImagePath(detailData.backdrop_path)
                        : DEFAULT_IMG
                    })`,
                  }}
                />
                <BigTitle>{detailData.name}</BigTitle>
                <BigOverview>{detailData.overview}</BigOverview>
              </>
            )}
          </BigMovie>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default TvModal;
