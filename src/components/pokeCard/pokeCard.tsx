import React, { Component } from "react";
import { Col, Container, Form } from "react-bootstrap";
import { getPokeData } from "../../back-end/getAPI";
import type { PokemonData } from "../../back-end/getAPI";
import store from "../../redux/store/store";
import addCart from "../../asserts/images/add-to-cart.png";
import loading from "../../asserts/images/mini-loading.gif";
import missingSprite from "../../asserts/images/missing-sprite.png";
import "./style.css";

interface PokeCardProps {
  pokeName: string;
  pokeTypesIcons: Record<string, string>;
}

interface PokeCardState {
  pokeData?: PokemonData;
  shiny: boolean;
  priceNum: number;
  priceStr: string;
  sprite?: string;
  quantity: number;
  typesIcons: Record<string, string>;
}

function formatMoney(value: number): string {
  const [whole, decimal = "00"] = value.toFixed(2).split(".");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${groupedWhole},${decimal}`;
}

export default class PokeCard extends Component<PokeCardProps, PokeCardState> {
  state: PokeCardState = {
    shiny: false,
    priceNum: 0,
    priceStr: "0,00",
    quantity: 1,
    typesIcons: {},
  };

  async componentDidMount(): Promise<void> {
    try {
      const pokeData = await getPokeData(this.props.pokeName);
      const priceNum = Number(pokeData.price_default);
      this.setState({
        pokeData,
        typesIcons: this.props.pokeTypesIcons,
        priceNum,
        priceStr: formatMoney(priceNum),
        sprite: pokeData.sprites.front_default ?? missingSprite,
      });
    } catch {
      // Keep the loading state if the PokéAPI request fails; a later render can retry.
    }
  }

  private handleCheckShiny = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const shiny = event.target.checked;
    const pokeData = this.state.pokeData;
    if (!pokeData) return;

    const unitPrice = Number(shiny ? pokeData.price_shiny : pokeData.price_default);
    const sprite = shiny
      ? pokeData.sprites.front_shiny ?? missingSprite
      : pokeData.sprites.front_default ?? missingSprite;

    this.setState({
      shiny,
      sprite,
      priceNum: unitPrice * this.state.quantity,
      priceStr: formatMoney(unitPrice * this.state.quantity),
    });
  };

  private handleQuantityInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const parsedQuantity = Number.parseInt(event.target.value, 10);
    const quantity = Math.min(100, Math.max(1, Number.isNaN(parsedQuantity) ? 1 : parsedQuantity));
    const pokeData = this.state.pokeData;
    if (!pokeData) return;

    const unitPrice = Number(
      this.state.shiny ? pokeData.price_shiny : pokeData.price_default,
    );
    const priceNum = unitPrice * quantity;
    this.setState({ quantity, priceNum, priceStr: formatMoney(priceNum) });
  };

  private handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    const { pokeData, quantity, shiny, priceNum, priceStr } = this.state;
    if (!pokeData) return;

    store.dispatch({
      type: "ADD_ITEM",
      newItem: {
        name: pokeData.name,
        quantity,
        shiny,
        priceNum,
        priceStr,
        types: pokeData.types.map(({ type }) => type.name),
      },
    });
  };

  render(): React.ReactNode {
    const { pokeData, sprite, priceStr, quantity, typesIcons } = this.state;

    return (
      <Container fluid className="poke-card">
        {!pokeData ? (
          <img className="loading" src={loading} style={{ width: "50px" }} alt="loading" />
        ) : (
          <>
            <img className="poke-sprite" src={sprite} alt={`${pokeData.name} sprite`} />
            <div className="pokemon-card-info">
              <h5 className="pokemon-card-name">{pokeData.name}</h5>
              <div className="pokemon-type">
                {pokeData.types.map(({ type }) => (
                  <img
                    className="type-icon"
                    src={typesIcons[type.name]}
                    key={type.name}
                    alt={type.name}
                  />
                ))}
              </div>
              <h4 className="pokemon-price">R$ {priceStr}</h4>
            </div>

            <Form>
              <Form.Row>
                <Col xs={9}>
                  <Form.Row>
                    <Col xs={4}><Form.Label>Shiny</Form.Label></Col>
                    <Col className="input-div mt-0 pt-0">
                      <Form.Check onChange={this.handleCheckShiny} />
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col xs={4}><Form.Label>Qtd.</Form.Label></Col>
                    <Col className="input-div">
                      <Form.Control
                        value={quantity}
                        className="input-sm"
                        style={{
                          height: "25px",
                          width: "50px",
                          fontSize: "12px",
                          paddingLeft: "5px",
                          paddingRight: "3px",
                        }}
                        type="number"
                        min="1"
                        max="100"
                        onChange={this.handleQuantityInput}
                      />
                    </Col>
                  </Form.Row>
                </Col>
                <Col xs={3}>
                  <button className="submit-to-cart" type="submit" onClick={this.handleAddToCart}>
                    <img src={addCart} alt="Add to cart" />
                  </button>
                </Col>
              </Form.Row>
            </Form>
          </>
        )}
      </Container>
    );
  }
}
