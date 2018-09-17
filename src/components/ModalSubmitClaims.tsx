import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { View, Text, Icon } from 'native-base';

import LightButton from '../components/LightButton';
import ModalStyle from '../styles/Modal';

interface ParentProps {
    screenProps: any;
    onClose: Function;
    onSubmit: Function;
}

export interface Props extends ParentProps {}

class ModalSubmitClaims extends React.Component<Props> {
    render() {
        return (
            <KeyboardAvoidingView behavior={'position'}>
					<View style={ModalStyle.modalOuterContainer}>
						<View style={ModalStyle.modalInnerContainerAuto}>
                            <View style={ModalStyle.flexRight}>
								<Icon onPress={() => this.props.onClose()} active name="close" style={ModalStyle.cancelIcon} />
							</View>
							<View style={ModalStyle.flexLeft}>
								<Text style={ModalStyle.headingText}>
									{this.props.screenProps.t('claims:submitAllClaims')}
								</Text>
							</View>
							<View style={ModalStyle.divider} />
                            <View style={[ModalStyle.flexLeft]}>
                                <Text style={ModalStyle.descriptionText}>{this.props.screenProps.t('claims:submitAllDiscription')}</Text>
                            </View>
							<LightButton
								onPress={() => this.props.onSubmit()}
								text={this.props.screenProps.t('claims:submit')}
							/>
                            <View style={[ModalStyle.flexCenter]}>
                                <Text style={ModalStyle.forgotPassword}>{this.props.screenProps.t('claims:whatIsThis')}</Text>
                            </View>
                        </View>
                    </View>
            </KeyboardAvoidingView>
        );
    }
}

export default ModalSubmitClaims;