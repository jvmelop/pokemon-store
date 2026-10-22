import React, { Component } from "react";
import { Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { getTypesList } from "../../back-end/getAPI";
import store from "../../redux/store/store";
import "./style.css";

interface FilterMenuState {
  typesNames: string[];
  regionNames: string[];
  searchName: string | null;
  type_1: string | null;
  type_2: string | null;
  region: string | null;
}

const regions = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola"];

export default class FilterMenu extends Component<Record<string, never>, FilterMenuState> {
  private unsubscribe?: () => void;

  state: FilterMenuState = {
    typesNames: ["-", ...getTypesList()],
    regionNames: ["-", ...regions],
    searchName: null,
    type_1: null,
    type_2: null,
    region: null,
  };

  componentDidMount(): void {
    const syncFilters = () => this.setState(store.getState().filters);
    syncFilters();
    this.unsubscribe = store.subscribe(syncFilters);
  }

  componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  private handleSelectType = (selected: string | null, which: 1 | 2): void => {
    if (which === 1) {
      store.dispatch({
        type: "SET_TYPE_1_FILTER",
        type_1: selected === "-" ? null : selected,
      });
    } else {
      store.dispatch({
        type: "SET_TYPE_2_FILTER",
        type_2: selected === "-" ? null : selected,
      });
    }
  };

  private handleSelectRegion = (selected: string | null): void => {
    store.dispatch({
      type: "SET_REGION_FILTER",
      region: selected === "-" ? null : selected,
    });
  };

  private handleSearchName = (): void => {
    const searchInput = document.getElementById("filter-input") as HTMLInputElement | null;
    const searchName = searchInput?.value ?? "";
    store.dispatch({
      type: "SET_SEARCH_NAME",
      searchName: searchName === "-" || searchName.trim() === "" ? null : searchName,
    });
  };

  private resetSelectsT1T2 = (): void => {
    store.dispatch({ type: "RESET_TYPE_FILTER" });
  };

  private resetSelectRegion = (): void => {
    store.dispatch({ type: "RESET_REGION_FILTER" });
  };

  private resetName = (): void => {
    const searchInput = document.getElementById("filter-input") as HTMLInputElement | null;
    if (searchInput) searchInput.value = "";
    store.dispatch({ type: "RESET_SEARCH_NAME" });
  };

  private resetButton = (handler: () => void): React.ReactNode => (
    <button onClick={handler} id="reset-button">
      <img
        src="https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-2.jpg"
        alt="Reset filter"
        height="15px"
      />
    </button>
  );

  render(): React.ReactNode {
    return (
      <Col xs={12} md={2} className="filter-menu-div">
        <Container fluid>
          <Row id="filter-title-row" className="py-3">
            <Col xs={12} className="filter-title">
              <h1 id="filter-title-text">Search Filters</h1>
            </Col>
          </Row>
          <Row className="px-0">
            <Col xs={4} md={12} className="filter-div px-0">
              <Row className="mx-0">
                <Col xs={12} style={{ fontSize: "16px" }} className="filter-title"><p>Name</p></Col>
                <Col xs={10} className="px-0 mx-0">
                  <Form.Control
                    id="filter-input"
                    placeholder="Type here"
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                      if (event.key === "Enter") this.handleSearchName();
                    }}
                    style={{ borderRadius: "3px 0 0 3px" }}
                  />
                </Col>
                <Col xs={2} className="px-0">
                  <button onClick={this.handleSearchName} id="search-button">
                    <span role="img" aria-label="search-btn">🔎</span>
                  </button>
                </Col>
                <Col xs={12} className="px-0 ml-1">{this.resetButton(this.resetName)}</Col>
              </Row>
            </Col>

            <Col xs={4} md={12} className="filter-div px-0">
              <Row className="mx-0">
                <Col xs={12} style={{ fontSize: "16px" }} className="filter-title"><p>By Types</p></Col>
                {[1, 2].map((which) => (
                  <Col xs={12} lg={5} className="px-0 mx-0" key={which}>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="filter-input">
                        {(which === 1 ? this.state.type_1 : this.state.type_2) || "None"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {this.state.typesNames.map((name) => (
                          <Dropdown.Item
                            eventKey={name}
                            key={`${name}_T${which}`}
                            onSelect={(selected) => this.handleSelectType(selected, which as 1 | 2)}
                          >
                            {name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                ))}
                <Col xs={12} lg={1} className="px-0 ml-1" id="div-reset-types">
                  {this.resetButton(this.resetSelectsT1T2)}
                </Col>
              </Row>
            </Col>

            <Col xs={4} md={12} className="filter-div px-0">
              <Row className="mx-0">
                <Col xs={12} style={{ fontSize: "16px" }} className="filter-title"><p>By Region</p></Col>
                <Col xs={12} lg={10} className="px-0 mx-0">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="filter-input">
                      {this.state.region || "None"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {this.state.regionNames.map((name) => (
                        <Dropdown.Item
                          eventKey={name}
                          key={name}
                          onSelect={this.handleSelectRegion}
                        >
                          {name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col xs={12} lg={1} className="px-0 ml-1">
                  {this.resetButton(this.resetSelectRegion)}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }
}
