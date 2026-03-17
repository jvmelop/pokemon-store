import React, { Component } from 'react';
import { getTypesList } from '../../back-end/getAPI';
import { Col, Row, Dropdown, Container, Form } from 'react-bootstrap';
import './style.css'
import store from '../../redux/store/store'

const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola']

export default class FilterMenu extends Component{

  constructor(props) {
    super(props)
    this.state = {
      typesNames: ["-"].concat(getTypesList()),
      regionNames: ["-"].concat(REGIONS),
      searchName: null,
      type_1: null,
      type_2: null,
      region: null,
    }
  }

  componentDidMount () {
    store.subscribe( () => {
      const {type_1, type_2, region, searchName} = store.getState().filters
      this.setState({
        type_1,
        type_2,
        region,
        searchName
      });
    });

  }


  handleSelect_Type = (selected, which) => {
    if (which === 1)
      store.dispatch({
        type: "SET_TYPE_1_FILTER",
        type_1: selected === "-" ? null : selected
      })
    else if (which === 2)
      store.dispatch({
        type: "SET_TYPE_2_FILTER",
        type_2: selected === "-" ? null : selected
      })
  }
  handleSelect_Region = (event) => {
    store.dispatch({
      type: "SET_REGION_FILTER",
      region: event === "-" ? null : event
    })
  }
  handleSearchName = () => {
    const searchName = document.getElementById('filter-input').value;
    store.dispatch({
      type: "SET_SEARCH_NAME",
      searchName: searchName === "-" ? null : searchName
    })
  }


  resetSelectsT1T2 = () => {
    store.dispatch({
      type: "RESET_TYPE_FILTER",
    })
  }
  resetSelectRegion = () => {
    store.dispatch({
      type: "RESET_REGION_FILTER",
    })
  }
  resetName = (event) => {
    document.getElementById('filter-input').value = '';
    store.dispatch({
      type: "RESET_SEARCH_NAME",
    })
  }

  resetBtn = (handler) => {
    return (
      <button onClick={handler} id="reset-button">
        <img 
          src={'https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-2.jpg'} 
          alt="Reset Filter"
          height="15px">
        </img>
      </button>
    )
  }

  render() {

    return (
      <Col xs={12} md={2} className="filter-menu-div">
        <Container fluid >
          <Row id="filter-title-row" className="py-3">
            <Col xs={12} className='filter-title'>
              <h1 id="filter-title-text">Search Filters</h1>
            </Col>
          </Row>
          <Row className="px-0">

            {/**  NAME SEARCH */}
          <Col xs={4} md={12} className="filter-div px-0" >
            <Row className="mx-0" >
              <Col xs={12} style={{fontSize: '16px'}} className='filter-title'>
                <p>Name</p>
              </Col>
              <Col xs={10} className="px-0 mx-0" >
                <Form.Control 
                    id="filter-input"
                    placeholder="Type here" 
                    onKeyPress={(event) => {
                      if (event.key==='Enter') 
                        this.handleSearchName()
                    }}
                    style={{borderRadius:"3px 0 0 3px"}}>
                </Form.Control>
              </Col>
              <Col xs={2} className="px-0">
                <button onClick={this.handleSearchName} id="search-button">
                  <span role="img" aria-label="search-btn">🔎</span>
                </button>
              </Col>
              <Col xs={12} className="px-0 ml-1">
                {this.resetBtn(this.resetName)}
              </Col>
            </Row>
          </Col>

            {/**  TYPE FILTER */}
            <Col xs={4} md={12} className="filter-div px-0" >
              <Row className="mx-0">
              <Col xs={12} style={{fontSize: '16px'}} className='filter-title'>
                <p>By Types</p>
              </Col>
              <Col xs={12} lg={5} className="px-0 mx-0">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="filter-input">
                    {this.state.type_1 || "None"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {this.state.typesNames.map( (name) => {
                      return <Dropdown.Item 
                                eventKey={name} 
                                key={name+"_T1"}
                                onSelect={(selected) => {this.handleSelect_Type(selected, 1)}}
                                >{name}</Dropdown.Item>
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={12} lg={5} className="px-0 mx-0">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="filter-input">
                    {this.state.type_2 || "None"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                  {this.state.typesNames.map( (name) => {
                      return <Dropdown.Item 
                              eventKey={name} 
                              key={name+"_T2"}
                              onSelect={ (selected) => {this.handleSelect_Type(selected, 2)}}
                              >{name}</Dropdown.Item>
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={12} lg={1} className="px-0 ml-1" id="div-reset-types">
                {this.resetBtn(this.resetSelectsT1T2)}
              </Col>
            </Row>
            </Col>

            {/**  REGION FILTER */}
            <Col xs={4} md={12} className="filter-div px-0" >
              <Row className="mx-0" >
              <Col xs={12} style={{fontSize: '16px'}} className='filter-title'>
                <p>By Region</p>
              </Col>
              <Col xs={12} lg={10} className="px-0 mx-0">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="filter-input">
                    {this.state.region || "None"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {this.state.regionNames.map( (name) => {
                      return <Dropdown.Item 
                                eventKey={name} 
                                key={name}
                                onSelect={this.handleSelect_Region}
                                >{name}</Dropdown.Item>
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={12} lg={1} className="px-0 ml-1">
                {this.resetBtn(this.resetSelectRegion)}
              </Col>
              </Row>
            </Col>

          </Row>
        </Container>
      </Col>
    )
  }

}