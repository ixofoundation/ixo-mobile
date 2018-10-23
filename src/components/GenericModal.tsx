import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Content, View, Icon, Spinner, Text } from 'native-base';
import { ThemeColors } from '../styles/Colors';
import LightButton from './LightButton';

import ModalStyle from '../styles/Modal';
import IconServiceProviders from '../components/svg/iconServiceProviders';
import { InputField } from './InputField';

const { height, width } = Dimensions.get('window');

interface InputFieldOptions {
	prefixImage?: JSX.Element;
	suffixImage?: JSX.Element;
	label: string;
	password?: boolean;
	onChangeText: Function;
}

interface ParentProps {
	heading: string;
	paragraph: string;
	onClose?: Function;
	inputFieldOptions?: InputFieldOptions;
	loading: boolean;
	onPressButton?: Function;
	buttonText: string;
	headingImage?: JSX.Element;
	onPressInfo?: Function;
	infoText?: string;
	paragraphSecondary?: string;
}

interface State {}

export interface Props extends ParentProps {}

export default class CustomModal extends React.Component<Props, State> {
	renderDescriptionText() {
		return (
			<View style={ModalStyle.flexLeft}>
				<Text style={ModalStyle.descriptionText}>{this.props.paragraph}</Text>
			</View>
		);
	}

	renderInputFields() {
		if (this.props.inputFieldOptions) {
			return (
				<View style={ModalStyle.inputFieldBox}>
					{this.props.inputFieldOptions.prefixImage}
					<InputField
						password={this.props.inputFieldOptions.password}
						icon={this.props.inputFieldOptions.suffixImage}
						labelName={this.props.inputFieldOptions.label}
						onChangeText={(text: string) => this.props.inputFieldOptions.onChangeText(text)}
					/>
				</View>
			);
		}
		return null;
	}

	renderHeadingImage() {
		if (this.props.headingImage) {
			return (
				<View style={[ModalStyle.flexCenter]}>
					{this.props.headingImage}
				</View>
			);
		}
		return null;
	}

	renderSecondParagraph() {
		if (this.props.paragraphSecondary) {
			return (
				<Text style={ModalStyle.projectNameInModal}>{this.props.paragraphSecondary}</Text>
			);
		}
		return null;
	}

	render() {
		return (
			<Content>
				<View style={ModalStyle.modalOuterContainer}>
					<View style={ModalStyle.modalInnerContainer}>
						<View style={ModalStyle.flexRight}>
							<Icon onPress={() => this.props.onClose()} active name="close" style={ModalStyle.closeIcon} />
						</View>
						{this.renderHeadingImage()}
						<View style={ModalStyle.flexLeft}>
							<Text style={ModalStyle.headingText}>{this.props.heading}</Text>
						</View>
						<View style={ModalStyle.divider} />
						{this.renderDescriptionText()}
						{this.renderSecondParagraph()}
						{this.renderInputFields()}
						{this.props.loading ? (
							<Spinner color={ThemeColors.white} />
						) : (
							<LightButton onPress={() => this.props.onPressButton()} text={this.props.buttonText} />
						)}
						<TouchableOpacity onPress={() => this.props.onPressInfo()}>
							<Text style={ModalStyle.infoText}>
								{this.props.infoText}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Content>
		);
	}
}
