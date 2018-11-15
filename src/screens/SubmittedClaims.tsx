// TODO styling needs to move to styling file

import { Container, Icon, Text, View } from 'native-base';
import * as React from 'react';
import { ImageBackground, StatusBar, Dimensions } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import CustomIcons from '../components/svg/CustomIcons';
import { ThemeColors } from '../styles/Colors';
import SubmittedClaimsStyles from '../styles/SubmittedClaims';

const background = require('../../assets/background_2.png');
const { height } = Dimensions.get('window');

interface ParentProps {
	navigation: any;
	screenProps: any;
}

export default class SubmittedClaims extends React.Component<ParentProps> {
	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Projects' })]
		});
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
			headerLeft: <Icon name="arrow-back" onPress={() => navigation.dispatch(resetAction)} style={{ paddingLeft: 10, color: ThemeColors.white }} />
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
			<View style={SubmittedClaimsStyles.wrapper}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 0.2 }}>
						<View style={[SubmittedClaimsStyles.iconWrapper, { backgroundColor: ThemeColors.success_green }]}>
							<CustomIcons style={{ color: ThemeColors.white }} name="success" size={height * 0.05} />
						</View>
					</View>
					<View style={SubmittedClaimsStyles.textWrapper}>
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
			<View style={SubmittedClaimsStyles.wrapper}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 0.2 }}>
						<View style={[SubmittedClaimsStyles.iconWrapper, { backgroundColor: ThemeColors.failed_red }]}>
							<CustomIcons style={{ color: ThemeColors.white }} name="rejected" size={height * 0.05} />
						</View>
					</View>
					<View style={SubmittedClaimsStyles.textWrapper}>
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
