import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createCart, deleteCart, getCarts, patchCart } from '../api/carts-api'
import Auth from '../auth/Auth'
import { Cart } from '../types/Cart'

interface CartsProps {
  auth: Auth
  history: History
}

interface CartsState {
  carts: Cart[]
  newCartName: string
  newCartPrice: string
  newCartDescription: string
  loadingCarts: boolean
}

export class Carts extends React.PureComponent<CartsProps, CartsState> {
  state: CartsState = {
    carts: [],
    newCartName: '',
    newCartPrice: '',
    newCartDescription: '',
    loadingCarts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCartName: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCartPrice: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCartDescription: event.target.value })
  }

  onEditButtonClick = (cartId: string) => {
    this.props.history.push(`/carts/${cartId}/edit`)
  }

  onCartCreate = async () => {
    try {
      if(this.state.newCartName !== '' && this.state.newCartPrice !== ''){
        const newCart = await createCart(this.props.auth.getIdToken(), {
          name: this.state.newCartName,
          price: this.state.newCartPrice,
          description: this.state.newCartDescription
        })
        this.setState({
          carts: [...this.state.carts, newCart],
          newCartName: '',
          newCartPrice: '',
          newCartDescription: ''
        })
      }
      else{
        alert('Name or price of new Cart must not empty!')
      }
      
    } catch {
      alert('Cart creation failed')
    }
  }

  onCartDelete = async (cartId: string) => {
    try {
      await deleteCart(this.props.auth.getIdToken(), cartId)
      this.setState({
        carts: this.state.carts.filter(cart => cart.cartId !== cartId)
      })
    } catch {
      alert('Cart deletion failed')
    }
  }

  onCartCheck = async (pos: number) => {
    try {
      const cart = this.state.carts[pos]
      await patchCart(this.props.auth.getIdToken(), cart.cartId, {
        name: cart.name,
        description: cart.description,
        price: cart.price,
        done: !cart.done
      })
      this.setState({
        carts: update(this.state.carts, {
          [pos]: { done: { $set: !cart.done } }
        })
      })
    } catch {
      alert('Cart deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const carts = await getCarts(this.props.auth.getIdToken())
      this.setState({
        carts,
        loadingCarts: false
      })
    } catch (e) {
      alert(`Failed to fetch carts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">CARTs</Header>

        {this.renderCreateCartInput()}

        {this.renderCarts()}
      </div>
    )
  }

  renderCreateCartInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            fluid
            placeholder="Name Cart..."
            onChange={this.handleNameChange}
          />
          <Input
            fluid
            placeholder="Price Cart..."
            onChange={this.handlePriceChange}
          />
          <Input
            fluid
            placeholder="Description Cart..."
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Button
            icon
            color="teal"
            onClick={() => this.onCartCreate()}
          >
            <Icon name="add" /> New Cart
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCarts() {
    if (this.state.loadingCarts) {
      return this.renderLoading()
    }

    return this.renderCartsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading CARTs
        </Loader>
      </Grid.Row>
    )
  }

  renderCartsList() {
    return (
      <Grid padded>
        {this.state.carts?.map((cart, pos) => {
          return (
            <Grid.Row key={cart.cartId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onCartCheck(pos)}
                  checked={cart.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {cart.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {cart.price}$
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {cart.description}$
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(cart.cartId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCartDelete(cart.cartId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {cart.attachmentUrl && (
                <Image src={cart.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
