import React from 'react'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'
import { StyleSheet } from 'react-native'

interface Props {
  selectedClaim: DecoratedClaims
  saveClaim: (claimsItem: DecoratedClaims) => void
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 164,
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
  buttonTextDisabled: {
    fontFamily: JolocomTheme.contentFontFamily,
    color: 'rgba(255,255,255, 0.4)',
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  }
})

// TODO Polish dynamic key
interface State {
  line_1: string
  line_2: string
  pending: boolean
  [key: string]: string | boolean
}

export class ClaimDetailsComponent extends React.Component<Props, State> {
  state = {
    line_1: '',
    line_2: '',
    pending: false
  }

  componentWillMount() {
    // TODO: adjust for multiline when enabled
    const { value } = this.props.selectedClaim.claims[0]
    const claimField = this.props.selectedClaim.type[1]
    if (value && (claimField.toString() === 'ProofOfNameCredential')) {
      const fullName = value.split(',')
      console.log('full name: ', fullName)
      this.setState({
        line_1: fullName[0],
        line_2: fullName[1] ? fullName[1] : ''
      })
    } else if (value) {
      this.setState({ line_1: value })
    }
  }

  private handleFieldInput = (fieldValue: string, fieldName: string) => {
    this.setState({[fieldName]: fieldValue})
  }

  private onSubmit = (claimsItem: DecoratedClaims) => {
    claimsItem.claims[0].value = (claimsItem.type[1] === 'ProofOfNameCredential') ? this.prepareNameValue() : this.state.line_1
    this.setState({pending: true})
    this.props.saveClaim(claimsItem)
  }

  private prepareNameValue = () => {
    const { line_1, line_2 } = this.state
    return line_1 && line_2 ? line_1 + "," + line_2 : line_1 + line_2
  }

  private renderInputFields = (fieldName: string, displayName: string) => {
    const { line_1, line_2 } = this.state
    switch(displayName) {
      case ('Name'):
        return (
          <Block>
            <TextInputField
              fieldName={ 'line_1' }
              fieldValue={ line_1 }
              displayName={ 'First Name' }
              handleFieldInput={ this.handleFieldInput }
            />
            <TextInputField
              fieldName={ 'line_2' }
              fieldValue={ line_2 }
              displayName={ 'Last Name' }
              handleFieldInput={ this.handleFieldInput }
            />
          </Block>
        )
      default:
        return (
          <TextInputField
            fieldName={ 'line_1' }
            fieldValue={ line_1 }
            displayName={ displayName }
            handleFieldInput={ this.handleFieldInput }
          />
        )
    }
  }

  render() {
    if (this.props.selectedClaim.claims.length === 0) {
      return
    }
    const displayName = this.props.selectedClaim.displayName
    const fieldName = this.props.selectedClaim.claims[0].name
    return (
      <Container>
        <Block>
          <CenteredText
            style={ JolocomTheme.textStyles.light.subheader }
            msg={ displayName } />
          { this.renderInputFields(fieldName, displayName) }
        </Block>
          <Button
            onPress={ () => this.onSubmit(this.props.selectedClaim) }
            style={ (!this.state.line_1 || this.state.pending)
              ? { container: styles.buttonContainer, text: styles.buttonTextDisabled}
              : { container: styles.buttonContainer, text: styles.buttonText }
            }
            disabled={ !this.state.line_1 || this.state.pending }
            upperCase={false}
            text="Add claim"
        />
      </Container>
    )
  }
}
