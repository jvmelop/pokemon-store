import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { getFilteredPokeList, getTypesIcon } from "../../back-end/getAPI";
import type { FilterState } from "../../redux/reducers/filters";
import store from "../../redux/store/store";
import loading from "../../asserts/images/big-loading.gif";
import notFound from "../../asserts/images/not-found.png";
import PokeCard from "../pokeCard/pokeCard";
import "./style.css";

const pokeTypesIcons = getTypesIcon();
const pageLimit = 24;

const PokeList = () => {
  const [pokeNameList, setPokeNameList] = useState<string[] | undefined>();
  const [filters, setFilters] = useState<FilterState>(store.getState().filters);
  const [curPage, setCurPage] = useState(1);

  useEffect(() => {
    const updateFilters = () => setFilters(store.getState().filters);
    const unsubscribe = store.subscribe(updateFilters);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let isCurrent = true;
    const hasFilters = Object.values(filters).some(
      (value) => value !== null && value.trim() !== "",
    );
    if (!hasFilters) setCurPage(1);

    const timeout = window.setTimeout(async () => {
      try {
        const list = await getFilteredPokeList(hasFilters ? filters : null);
        if (isCurrent) setPokeNameList(list);
      } catch {
        if (isCurrent) setPokeNameList([]);
      }
    }, 500);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeout);
    };
  }, [filters]);

  const getArrayForPage = useCallback((): string[] => {
    if (!pokeNameList) return [];
    return pokeNameList.slice(pageLimit * (curPage - 1), pageLimit * curPage);
  }, [pokeNameList, curPage]);

  const getPageButtons = () => {
    if (!pokeNameList) return null;
    const pageCount = Math.ceil(pokeNameList.length / pageLimit);
    if (pageCount <= 1) return null;

    return (
      <div className="page-btn-div">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
          <Button
            key={page}
            id="page-btn"
            onClick={() => setCurPage(page)}
            active={page === curPage}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Col xs={7} sm={8} md={8} className="poke-list-div">
      <Container fluid className="px-3 mx-0">
        <h1 id="title-catalog" className="mt-3">PokéCatalog</h1>
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
