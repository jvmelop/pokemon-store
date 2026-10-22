import React, { Component } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import store from "../../redux/store/store";
import type { CartItem } from "../../redux/reducers/cartItems";
import cartIcon from "../../asserts/images/cart-ball.png";
import "./style.css";

interface SideCartState {
  items: CartItem[];
  totalPriceNum: number;
  totalPriceStr: string;
  canDelete: boolean;
  showModal: boolean;
}

function formatMoney(value: number): string {
  const [whole, decimal = "00"] = value.toFixed(2).split(".");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${groupedWhole},${decimal}`;
}

export default class SideCart extends Component<Record<string, never>, SideCartState> {
  private unsubscribe?: () => void;

  state: SideCartState = {
    items: [],
    totalPriceNum: 0,
    totalPriceStr: "0,00",
    canDelete: false,
    showModal: false,
  };

  componentDidMount(): void {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ items: store.getState().cartItems }, this.updateElements);
    });

    try {
      const localItems = JSON.parse(localStorage.getItem("cartItems") ?? "[]") as CartItem[];
      this.setState({ items: localItems }, this.updateElements);
    } catch {
      this.setState({ items: [] }, this.updateElements);
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe?.();
  }

  private updateElements = (): void => {
    const total = this.state.items.reduce((sum, item) => sum + item.priceNum, 0);
    this.setState({ totalPriceNum: total, totalPriceStr: formatMoney(total) });
  };

  private handleClickDelBtn = (): void => {
    this.setState((state) => ({ canDelete: !state.canDelete }));
  };

  private handleClickDelItem = (code: number): void => {
    store.dispatch({ type: "DELETE_ITEM", code });
  };

  private handleBuy = (action: "show" | "close"): void => {
    this.setState({ showModal: action === "show" });
    if (action === "close") store.dispatch({ type: "CLEAR_LIST" });
  };

  private renderCartItems(items: CartItem[], buyMode = false): React.ReactNode {
    return items.map((item) => (
      <Row
        key={item.code}
        onClick={
          !buyMode && this.state.canDelete
            ? () => this.handleClickDelItem(item.code)
            : undefined
        }
        className={buyMode ? "cart-item-row-buy" : "cart-item-row"}
        style={{
          backgroundColor:
            !buyMode && this.state.canDelete ? "rgb(255,0,0,0.1)" : "transparent",
          cursor: !buyMode && this.state.canDelete ? "pointer" : "auto",
        }}
      >
        <Col xs={1} id="item-quantity">{item.quantity}x </Col>
        <Col xs={9} lg={5} id="item-poke-name">{item.name}</Col>
        <Col xs={1} id="item-shiny">{item.shiny ? "★" : ""}</Col>
        <Col xs={12} lg={5} id="item-price">$ {item.priceStr}</Col>
      </Row>
    ));
  }

  render(): React.ReactNode {
    return (
      <Col xs={5} sm={4} md={2} lg={2} className="poke-cart-div">
        <Row id="cart-title-row" className="py-2">
          <Col xs={8} md={6}><h1 id="cart-title-text">Cart</h1></Col>
          <Col xs={2} md={3}><img src={cartIcon} height="45px" alt="cartn-ball" /></Col>
        </Row>

        {this.state.items.length > 0 && (
          <Row style={{ display: "flex", flexDirection: "row" }}>
            <Col xs={{ span: 2, offset: 8 }}>
              <Button
                size="sm"
                id="del-item-btn"
                onClick={this.handleClickDelBtn}
                style={{
                  backgroundColor: "red",
                  opacity: this.state.canDelete ? "100%" : "30%",
                  color: "white",
                  fontWeight: 700,
                  border: "none",
                  width: "20px",
                }}
              >
                <span role="img" aria-label="del-item">↓🗑️</span>
              </Button>
            </Col>
          </Row>
        )}

        <Container fluid className="poke-cart-container">
          {this.renderCartItems(this.state.items)}
        </Container>
        <Row id="total-price-row">
          <Col xs={12} md={2}>Total </Col>
          <Col xs={12} md={10} style={{ color: "rgb(255,56,92)" }}>
            $ {this.state.totalPriceStr}
          </Col>
        </Row>
        {this.state.items.length > 0 && (
          <Button id="buy-btn" className="mt-3" onClick={() => this.handleBuy("show")}>
            Buy
          </Button>
        )}

        <Modal show={this.state.showModal} onHide={() => this.handleBuy("close")}>
          <Modal.Header closeButton>
            <Modal.Title>Thanks, trainer!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="modal-thanks-div" xs={12}>
              <img
                src="https://25.media.tumblr.com/tumblr_lh013m9gyV1qgjv7io1_500.gif"
                height="100px"
                alt="thanks"
              />
              <p>Your Pokémon have been successfully purchased :)</p>
            </Col>
            <Container className="px-4">{this.renderCartItems(this.state.items, true)}</Container>
            <Row id="total-price-row-buy">
              <Col xs={12} md={2}>Total </Col>
              <Col xs={12} md={10} style={{ color: "rgb(255,56,92)" }}>
                $ {this.state.totalPriceStr}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button id="buy-btn" onClick={() => this.handleBuy("close")}>Buy More</Button>
          </Modal.Footer>
        </Modal>
      </Col>
    );
  }
}
