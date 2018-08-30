// TODO styling needs to move to styling file

import { Container, Icon, Text, View } from 'native-base';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import IconReject from '../../assets/svg/IconReject';
import IconSuccess from '../../assets/svg/IconSuccess';
import { ThemeColors } from '../styles/Colors';
import SubmittedClaimsStyles from '../styles/SubmittedClaims';

const background = require('../../assets/backgrounds/background_2.png');

interface ParentProps {
	navigation: any;
	screenProps: any;
}

export default class SubmittedClaims extends React.Component<ParentProps> {
	static navigationOptions = ({ navigation }: { navigation: any }) => {
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerLeft: <Icon name="arrow-back" onPress={() => navigation.pop()} style={{ paddingLeft: 10, color: ThemeColors.white }} />
		};
	};

	state = {
		claimSubmitted: true
	};

	componentDidMount() {
		const {
			params: { claimSubmitted }
		} = this.props.navigation.state;
		this.setState({ claimSubmitted });
	}

	renderSuccess() {
		return (
			<View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 0.2 }}>
						<View style={[SubmittedClaimsStyles.colorBox, { backgroundColor: '#3F7E44' }]}>
							<View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
								<IconSuccess width={50} height={50} />
							</View>
						</View>
					</View>
					<View style={{ flex: 0.8, paddingLeft: 10 }}>
						<View style={[SubmittedClaimsStyles.flexLeft]}>
							<Text style={[SubmittedClaimsStyles.header, { color: ThemeColors.white }]}>{this.props.screenProps.t('submittedClaims:successMessage')}</Text>
						</View>
						<View style={{ width: '100%' }}>
							<View style={SubmittedClaimsStyles.divider} />
						</View>
						<View style={SubmittedClaimsStyles.flexLeft}>
							<Text style={SubmittedClaimsStyles.infoBox}>{this.props.screenProps.t('submittedClaims:successDetailedMessage')}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}

	renderReject() {
		return (
			<View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 0.2 }}>
						<View style={[SubmittedClaimsStyles.colorBox, { backgroundColor: '#A11C43' }]}>
							<View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
								<IconReject width={50} height={50} />
							</View>
						</View>
					</View>
					<View style={{ flex: 0.8, paddingLeft: 10 }}>
						<View style={[SubmittedClaimsStyles.flexLeft]}>
							<Text style={[SubmittedClaimsStyles.header, { color: ThemeColors.white }]}>{this.props.screenProps.t('submittedClaims:rejectMessage')}</Text>
						</View>
						<View style={{ width: '100%' }}>
							<View style={SubmittedClaimsStyles.divider} />
						</View>
						<View style={SubmittedClaimsStyles.flexLeft}>
							<Text style={SubmittedClaimsStyles.infoBox}>{this.props.screenProps.t('submittedClaims:rejectDetailedMessage')}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}

	render() {
		return (
			<ImageBackground source={background} style={SubmittedClaimsStyles.backgroundImage}>
				<Container>
					<StatusBar barStyle="light-content" />
					{this.state.claimSubmitted ? this.renderSuccess() : this.renderReject()}
				</Container>
			</ImageBackground>
		);
	}
}
