import React from 'react';
import { ImagePicker, Permissions, ImageManipulator } from 'expo';
import { TouchableOpacity, Image, Dimensions, TouchableOpacityBase } from 'react-native';
import { FormStyles } from '../../models/form';
import { Textarea, Item, Form, Input, View, Label, Icon, Text } from 'native-base';
// @ts-ignore
import { connectActionSheet } from '@expo/react-native-action-sheet';
import changeCase from 'change-case';
import _ from 'underscore';

const { width } = Dimensions.get('window');

const placeholder = require('../../../assets/ixo-placeholder.jpg');

import DynamicFormStyles from '../../styles/componentStyles/DynamicForm';
import ContainerStyles from '../../styles/Containers';
import { ThemeColors } from '../../styles/Colors';
import DarkButton from '../DarkButton';


export interface IImage {
	fieldName: string; // used to keep track of which image list in schema e.g. (before or after images)
	imageElement: JSX.Element;
}

export interface ParentProps {
	formStyle: FormStyles;
	formSchema: any;
	presetValues?: any[];
	showActionSheetWithOptions?: any;
	screenProps: any;
}

export interface State {
	submitStatus: string;
	hasCameraPermission: boolean;
	imageList: IImage[];
}

export interface Callbacks {
	handleSubmit?: (formData: any) => void;
}

export interface Props extends ParentProps, Callbacks {}
@connectActionSheet
export default class DynamicForm extends React.Component<Props, State> {
	private formData: any = {};

	state = {
		submitStatus: '',
		hasCameraPermission: false,
		imageList: [],
	};

	async componentWillMount() {
		let hiddenCount = 0;
		this.props.formSchema.map((field: any) => {
			if (field.hidden) {
				this.setFormState(field.name, this.props.presetValues![hiddenCount]);
				hiddenCount++;
			} else {
				this.setFormState(field.name, '');
			}
		});
	}

	handleSubmit = () => {
		if (this.props.handleSubmit) {
			this.props.handleSubmit(this.formData);
		}
	};

	renderPreview(fieldName: string) {
		const imageObj: IImage | undefined = _.find(this.state.imageList, (imageList: IImage) => imageList.fieldName === fieldName);
		if (imageObj) {
			return (
				<View key={imageObj.fieldName}>
					{imageObj.imageElement}
				</View>
			);
		}
		return null;
	}

	renderImage(uri: string, index: number) {
		return (
			<View key={index} style={{ width: '100%', alignItems: 'center' }}>
				<Image resizeMode={'contain'} style={DynamicFormStyles.imageContainer} source={(uri === "") ? placeholder : { uri } } />
			</View>
		);
	}

	render() {
		return (
				<Form>
					{this.props.formSchema.map((field: any, i: any) => {
						switch (field.type) {
							case 'number':
							case 'text':
							case 'email':
								return (
									<Item key={i} floatingLabel >
										<Label>{changeCase.sentenceCase(field.name)}</Label>
										<Input disabled={true} value={field.value} />
									</Item>
								);
							case 'textarea' :
								return (
									<View style={DynamicFormStyles.textArea} key={i}>
										<Text>{changeCase.sentenceCase(field.name)}</Text>
										<Text>{field.value}</Text>
									</View>
								);
							case 'image' :
								return (this.renderImage(field.value, i));
							case 'select':
							case 'country':
							case 'template':
							case 'radio':
							default:
								return <Label key={i}>{field.label}</Label>;
						}
					})}
			</Form>
		);
	}
}