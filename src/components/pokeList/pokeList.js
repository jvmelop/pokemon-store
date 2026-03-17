import React, { useState, useEffect, useCallback } from "react";
import { getTypesIcon, getFilteredPokeList } from "../../back-end/getAPI";
import PokeCard from "./../pokeCard/pokeCard";
import { Col, Row, Container, Button } from "react-bootstrap";
import "./style.css";
import store from "../../redux/store/store";
import loading from "./../../asserts/images/big-loading.gif";
import notFound from "./../../asserts/images/not-found.png";

const PokeList = () => {
  const [pokeNameList, setPokeNameList] = useState(undefined);
  const [pokeTypesIcons] = useState(getTypesIcon());
  const [filters, setFilters] = useState({});
  const [curPage, setCurPage] = useState(1);
  const [limit] = useState(24);

  // Update filters from store
  useEffect(() => {
    const updateFilters = () => {
      setFilters({ ...store.getState().filters });
    };
    updateFilters();
    const unsubscribe = store.subscribe(updateFilters);
    return unsubscribe;
  }, []);

  // Update poke list when filters change
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const hasFilters = !Object.values(filters).every((v) => v === null);
      if (!hasFilters) setCurPage(1);
      const list = await getFilteredPokeList(
        hasFilters ? { ...filters } : null
      );
      if (isMounted) setPokeNameList(list);
    };
    const timeout = setTimeout(fetchData, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [filters]);

  const getArrayForPage = useCallback(() => {
    if (!pokeNameList) return [];
    return pokeNameList.slice(limit * (curPage - 1), limit * curPage);
  }, [pokeNameList, curPage, limit]);

  const handleChangePage = (num) => setCurPage(num);

  const getPageButtons = () => {
    if (!pokeNameList) return null;
    const n = Math.ceil(pokeNameList.length / limit);
    if (n <= 1) return null;
    const pageNums = Array.from({ length: n }, (_, i) => i + 1);
    return (
      <div className="page-btn-div">
        {pageNums.map((num) => (
          <Button
            key={num}
            id="page-btn"
            onClick={() => handleChangePage(num)}
            active={num === curPage}
          >
            {num}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Col xs={7} sm={8} md={8} className="poke-list-div">
      <Container fluid className="px-3 mx-0">
        <h1 id="title-catalog" className="mt-3">
          PokéCatalog
        </h1>
        <Container fluid className="poke-list-container pt-3 px-4">
          {pokeNameList === undefined ? (
            <img src={loading} alt="loading" />
          ) : pokeNameList.length === 0 ? (
            <>
              <img src={notFound} alt="not found" />
              <p style={{ color: "white", fontSize: "16px" }}>
                No results were found :(
              </p>
            </>
          ) : (
            <>
              <Row xs={12} style={{ display: "block", margin: "25px 0" }}>
                {getPageButtons()}
              </Row>
              <Row className="poke-list-row my-2">
                {getArrayForPage().map((name) => (
                  <Col xs={12} sm={6} md={6} lg={4} xl={3} key={name}>
                    <PokeCard pokeName={name} pokeTypesIcons={pokeTypesIcons} />
                  </Col>
                ))}
              </Row>
              {getPageButtons()}
            </>
          )}
        </Container>
      </Container>
    </Col>
  );
};

export default PokeList;
