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
	editable: boolean;
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

	setFormState = (name: String, value: any) => {
		const fields = name.split('.');
		let formData: any = this.formData;
		fields.forEach((field, index) => {
			if (index === fields.length - 1) {
				formData[field] = value;
			} else {
				if (!formData[field]) {
					formData[field] = {};
				}
				formData = formData[field];
			}
		});
		this.formData = formData;
	};

	updateImageList = (fieldName: string, uri: string) => {
		const imageComponent = <Image resizeMode={'contain'} style={DynamicFormStyles.imageContainer} source={{ uri }} />
		const imageListArray: IImage[] = this.state.imageList;
		const imageListFoundItem: IImage | undefined = _.find(imageListArray, (imageList) => imageList.fieldName === fieldName);
		if (imageListFoundItem) { // update existing image element list
			imageListFoundItem.imageElement = imageComponent;
		} else { // create a new entry
			imageListArray.push({ fieldName, imageElement: imageComponent });
		}
		this.setState({ imageList: imageListArray });
	};

	async compressImage(uri: string) {
		const compressedImage = await ImageManipulator.manipulate(uri, {}, { compress: 0.9, format: 'jpeg', base64: true })
		const base64 = `data:image/jpeg;base64,${compressedImage.base64}`;
		return base64;
	}

	async pickImage(fieldName: string) {
		try {
			const { status: camera_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (camera_roll === 'granted') {
				let result = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: true,
					aspect: [4, 3],
				});
				if (!result.cancelled) {
					this.updateImageList(fieldName, result.uri);
					const base64 = await this.compressImage(result.uri);
					this.setFormState(fieldName, base64);
				}
			}
		} catch(error) {
			console.log(error);
		}
	};

	async takePhoto(fieldName: string) {
		try {
			const { status: camera } = await Permissions.askAsync(Permissions.CAMERA);
			if (camera === 'granted') {
				let result = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [4, 3],
				});
				if (!result.cancelled) {
					this.updateImageList(fieldName, result.uri);
					const base64 = await this.compressImage(result.uri);
					this.setFormState(fieldName, base64);
				}
			}
		} catch(error) {
			console.log(error);
		}
	}

	onOpenActionSheet = (fieldName: string) => {
		// Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
		let options = ['Select from Camera Roll', 'Take photo', 'Cancel'];
		let destructiveButtonIndex = 2;
		let cancelButtonIndex = 2;
		
		this.props.showActionSheetWithOptions({
		  options,
		  cancelButtonIndex,
		  destructiveButtonIndex,
		},
		(buttonIndex: number) => {
			if (buttonIndex === 0) { // camera roll
				this.pickImage(fieldName);
			}
			else if (buttonIndex === 1) {
				this.takePhoto(fieldName);
			}
		  // Do something here depending on the button index selected
		});
	  }

	onFormValueChanged = (name: String, text: string) => {
		this.setFormState(name, text);
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
			<View key={index}>
				<Image resizeMode={'contain'} style={DynamicFormStyles.imageContainer} source={(uri === "") ? placeholder : { uri } } />
			</View>
		);
	}

	renderEditImageField(field: any, index: number) {
		if (_.isEmpty(this.state.imageList)) {
			return (
				<View style={DynamicFormStyles.imageType} key={index}>
					<Text>{changeCase.sentenceCase(field.name)}</Text>
					<TouchableOpacity onPress={() => this.onOpenActionSheet(field.name)} style={DynamicFormStyles.photoBoxContainer}>
						<View style={[ContainerStyles.flexRow]}>
							<View style={[ContainerStyles.flexColumn]}>
								<Icon style={DynamicFormStyles.photoBoxCameraIcon} name="camera" />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		} else {
			return (
				<View style={DynamicFormStyles.imageType} key={index}>
					<Text>{changeCase.sentenceCase(field.name)}</Text>
					{this.renderPreview(field.name)}
					<TouchableOpacity onPress={() => this.onOpenActionSheet(field.name)} style={{ width: width * 0.2, height: width * 0.2 }}>
						<View style={{ flex: 0.1 }} />
						<View style={[ContainerStyles.flexRow, { flex: 0.8 }]}>
							<Icon style={DynamicFormStyles.photoBoxCameraIcon} name="add" />
						</View>
						<View style={{ flex: 0.1 }} />
					</TouchableOpacity>
				</View>
			)
		}
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
										<Input value={field.value} onChangeText={(text) => this.onFormValueChanged(field.name, text)} />
									</Item>
								);
							case 'textarea' :
								return (
									<View style={DynamicFormStyles.textArea} key={i}>
										<Text>{changeCase.sentenceCase(field.name)}</Text>
										<Textarea value={field.value} onChangeText={(text) => this.onFormValueChanged(field.name, text)} key={i} rowSpan={5} bordered />
									</View>
								);
							case 'image' :
								if (this.props.editable) {
									return (this.renderEditImageField(field, i));
								} else {
									return (this.renderImage(field.value, i));
								}
							case 'select':
							case 'country':
							case 'template':
							case 'radio':
							default:
								return <Label key={i}>{field.label}</Label>;
						}
					})}
					{(this.props.editable) && 
						<DarkButton
							onPress={() => this.handleSubmit()}
							text={this.props.screenProps.t('claims:submitButton')}
						/>
					}
			</Form>
		);
	}
}