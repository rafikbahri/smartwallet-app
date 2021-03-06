import React from 'react'
import { connect } from 'react-redux'
import { LoadingScreen } from 'src/ui/generic/'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions, accountActions } from 'src/actions/'
import { RootState } from 'src/reducers/'
import Immutable from 'immutable'

interface ConnectProps {
  checkIfAccountExists: () => void
  startRegistration: () => void
  loading: boolean
}

interface Props extends ConnectProps {}


export class LandingContainer extends React.Component<Props> {

  UNSAFE_componentWillMount() {
    this.props.checkIfAccountExists()
  }

  render() {
    if ( this.props.loading ) {
      return (
        <LoadingScreen/>
      )
    } else {
      return (
        <LandingComponent handleButtonTap={ this.props.startRegistration } />
      ) 
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const loading = Immutable.fromJS(state.account.loading)
  return {
    loading: loading.get('loading')
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    startRegistration: () => dispatch(registrationActions.startRegistration()),
    checkIfAccountExists: () => dispatch(accountActions.checkIdentityExists()),
  }
}

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingContainer)
