import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import PokeList from "./components/pokeList/pokeList";
import FilterMenu from "./components/filterMenu/filterMenu";
import SideCart from "./components/sideCart/sideCart";
import brand from "./asserts/images/ball-pixel-big.png";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar id="nav" variant="dark">
        <Navbar.Brand href="/">
          <img src={brand} alt="PokéMart brand" className="mr-3" />
          Master PokéMart
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="https://about.me/jvmelop" target="_blank" rel="noreferrer">
            Developer
          </Nav.Link>
        </Nav>
      </Navbar>

      <Container fluid>
        <Row className="main-div">
          <FilterMenu />
          <PokeList />
          <SideCart />
        </Row>
      </Container>

      <footer>
        João Vítor de Melo @ 2020
        <br />
        <a href="https://about.me/jvmelop" target="_blank" rel="noopener noreferrer">
          {"> About me & Contact <"}
        </a>
        <br />
        Hiring Coders | Gama Academy
      </footer>
    </div>
  );
}

export default App;
