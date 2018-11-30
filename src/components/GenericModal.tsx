import React from 'react';
import { TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { Content, View, Icon, Spinner, Text } from 'native-base';
import { ThemeColors } from '../styles/Colors';
import LightButton from './LightButton';

import ModalStyle from '../styles/Modal';
import InputField from './InputField';

interface InputFieldOptions {
	prefixImage?: JSX.Element;
	suffixImage?: JSX.Element;
	label: string;
	password?: boolean;
	onChangeText: Function;
	containerStyle?: ViewStyle;
	onSuffixImagePress?: Function;
	underlinePositionRatio?: number;
	error?: string;
}

interface ParentProps {
	heading?: string;
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
	headingTextStyle?: TextStyle;
}

interface State {}

export interface Props extends ParentProps {}

export default class CustomModal extends React.Component<Props, State> {
	renderHeadingImage() {
		if (this.props.headingImage) {
			return <View style={[ModalStyle.flexCenter]}>{this.props.headingImage}</View>;
		}
		return null;
	}

	renderHeadingText() {
		if (this.props.heading) {
			return (
				<View style={ModalStyle.flexLeft}>
					<Text style={[ModalStyle.headingText, this.props.headingTextStyle]}>{this.props.heading}</Text>
				</View>
			);
		}
		return null;
	}

	renderDivider() {
		if (this.props.heading) {
			return <View style={ModalStyle.divider} />;
		}
		return null;
	}

	renderParagraph() {
		return (
			<View style={ModalStyle.flexLeft}>
				<Text style={ModalStyle.descriptionText}>{this.props.paragraph}</Text>
			</View>
		);
	}

	renderSecondParagraph() {
		if (this.props.paragraphSecondary) {
			return (
				<View style={ModalStyle.flexLeft}>
					<Text style={ModalStyle.descriptionText}>{this.props.paragraphSecondary}</Text>
				</View>
			);
		}
		return null;
	}

	renderInputFields() {
		if (this.props.inputFieldOptions) {
			return (
				<InputField
					error={this.props.inputFieldOptions.error}
					onSuffixImagePress={this.props.inputFieldOptions.onSuffixImagePress}
					containerStyle={this.props.inputFieldOptions.containerStyle}
					prefixIcon={this.props.inputFieldOptions.prefixImage}
					password={this.props.inputFieldOptions.password}
					suffixIcon={this.props.inputFieldOptions.suffixImage}
					labelName={this.props.inputFieldOptions.label}
					onChangeText={(text: string) => this.props.inputFieldOptions.onChangeText(text)}
					underlinePositionRatio={this.props.inputFieldOptions.underlinePositionRatio}
				/>
			);
		}
		return null;
	}

	render() {
		return (
			<Content>
				<View style={ModalStyle.overlayContainer} />
				<View style={[ModalStyle.modalOuterContainer]}>
					<View style={ModalStyle.modalInnerContainer}>
						<View style={ModalStyle.modalWrapper}>
							<View style={ModalStyle.flexRight}>
								<Icon onPress={() => this.props.onClose()} active name="close" style={ModalStyle.closeIcon} />
							</View>
							{this.renderHeadingImage()}
							{this.renderHeadingText()}
							{this.renderDivider()}
							{this.renderParagraph()}
							{this.renderSecondParagraph()}
							{this.renderInputFields()}
							{this.props.loading ? (
								<Spinner color={ThemeColors.white} />
							) : (
								<LightButton propStyles={{ marginTop: 40 }} onPress={() => this.props.onPressButton()} text={this.props.buttonText} />
							)}
							<TouchableOpacity onPress={() => this.props.onPressInfo()}>
								<Text style={ModalStyle.infoText}>{this.props.infoText}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Content>
		);
	}
}
