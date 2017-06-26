import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/money', {
  goToEtherManagement: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/ether'))
        dispatch(actions.goToEtherManagement.buildAction(params))
      }
    }
  },
  buyEther: {
    expectedParams: ['stripeToken'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.buyEther.buildAction(params, (backend) => {
          return backend.wallet.buyEther({
            stripeToken: params,
            walletAddress: services.auth.currentUser.wallet.mainAddress
          }).then((response) => {
            // eslint-disable-next-line no-console
            console.log('buyEther action: ', response)
            dispatch(actions.getBalance())
            return response
          })
        }))
      }
    }
  },
  getBalance: {
    async: true,
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getBalance.buildAction(params, () => {
          return services.auth.currentUser.wallet.getBalance()
        }))
      }
    }
  },
  getPrice: {
    async: true,
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.getPrice.buildAction(params, (backend) => {
          return backend.wallet.retrieveEtherPrice()
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  ether: {
    loaded: false,
    errorMsg: '',
    price: 0,
    amount: 0,
    checkingOut: false,
    buying: false
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.buyEther.id:
      return state

    case actions.buyEther.id_success:
      return state

    case actions.buyEther.id_fail:
      return state

    case actions.getBalance.id:
      return state

    case actions.getBalance.id_fail:
      return state

    case actions.getBalance.id_success:
      return state.mergeIn(['ether'], {
        amount: action.result
      })

    case actions.getPrice.id:
      return state

    case actions.getPrice.id_success:
      return state.mergeIn(['ether'], {
        price: action.result.ethForEur
      })

    case actions.getPrice.id_fail:
      return state

    default:
      return state
  }
}
