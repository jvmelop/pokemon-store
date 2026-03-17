import React from 'react';
import './App.css';
import PokeList from './components/pokeList/pokeList'
import FilterMenu from './components/filterMenu/filterMenu';
import SideCart from './components/sideCart/sideCart';
import { Row, Container, Nav, Navbar } from 'react-bootstrap';
import brand from './asserts/images/ball-pixel-big.png'

function App() {

  return (
    <div className="App">

      <Navbar id="nav" variant="dark" >
        <Navbar.Brand href="/">
          <img src={brand} alt="brandimg" className="mr-3"></img>
          Master PokéMart
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="https://about.me/jvmelop" target="_blank">Developer</Nav.Link>
        </Nav>
      </Navbar>

      <Container fluid >
        <Row className="main-div">
          <FilterMenu />
          <PokeList />
          <SideCart/>
        </Row>
      </Container>

      <footer>
        João Vítor de Melo @ 2020
        <br/>
        <a href="https://about.me/jvmelop" target="_blank" rel="noopener noreferrer" >{"> About me & Contact <"}</a>
        <br/>
        Hiring Coders | Gama Academy
      </footer>
    </div>
  );
}

export default App;
