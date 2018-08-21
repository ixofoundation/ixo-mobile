import React from 'react';
import { ImagePicker, Permissions } from 'expo';
import { TouchableOpacity, Image, Dimensions, TouchableOpacityBase } from 'react-native';
import { FormStyles } from '../../models/form';
import { Textarea, Item, Form, Input, View, Label, Icon, Text } from 'native-base';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import changeCase from 'change-case';
import _ from 'underscore';

const { width } = Dimensions.get('window');

import DynamicFormStyles from '../../styles/componentStyles/DynamicForm';
import ContainerStyles from '../../styles/Containers';
import { ThemeColors } from '../../styles/Colors';

// const AddMoreBox = () => (
// 	<TouchableOpacity style={DynamicFormStyles.photoBoxContainer}>
// 		<View style={{ flex: 0.1 }} />
// 		<View style={[ContainerStyles.flexRow, { flex: 0.8 }]}>
// 			<Icon style={DynamicFormStyles.photoBoxCameraIcon} name="add" />
// 		</View>
// 		<View style={{ flex: 0.1 }} />
// 	</TouchableOpacity>
// );
export interface IImageList {
	index: number; // used to keep track of which image list in schema e.g. (before or after images)
	ImageElements: JSX.Element[];
}

export interface ParentProps {
	formStyle: FormStyles;
	formSchema: any;
	presetValues?: any[];
	showActionSheetWithOptions?: any;
}

export interface State {
	formData: any;
	submitStatus: string;
	hasCameraPermission: boolean;
	imageLists: IImageList[];
}

export interface Callbacks {
	handleSubmit: (formData: any) => void;
}

export interface Props extends ParentProps, Callbacks {}
@connectActionSheet
export default class DynamicForm extends React.Component<Props, State> {
	state = {
		formData: {},
		submitStatus: '',
		hasCameraPermission: false,
		imageLists: [],
	};

	async componentWillMount() {
		let hiddenCount = 0;
		console.log('Dynamic From: ' + this.props.formSchema);
		this.props.formSchema.map((field: any) => {
			console.log('Field: ' + field.label);
			if (field.hidden) {
				this.setFormState(field.name, this.props.presetValues![hiddenCount]);
				hiddenCount++;
			} else {
				this.setFormState(field.name, '');
			}
		});
	}

	handleSubmit = () => {
		this.props.handleSubmit(this.state.formData);
	};

	setFormState = (name: String, value: any) => {
		const fields = name.split('.');
		let formData: any = this.state.formData;
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
		this.setState({ formData: formData });
	};

	updateImageLists = (imageListIndex: number, uri: string) => {
		const imageComponent = <Image resizeMode={'contain'} style={DynamicFormStyles.imageContainer} source={{ uri }} />
		const imageListArray: IImageList[] = this.state.imageLists;
		const imageListFoundItem: IImageList | undefined = _.find(imageListArray, (imageList) => imageList.index === imageListIndex);
		if (imageListFoundItem) { // update existing image element list
			imageListFoundItem.ImageElements.push(imageComponent);
		} else { // create a new entry
			imageListArray.push({ index: imageListIndex, ImageElements: [imageComponent]})
		}
		this.setState({ imageLists: imageListArray });
	};

	async pickImage(imageListIndex: number) {
		try {
			const { status: camera_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (camera_roll === 'granted') {
				let result = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: true,
					aspect: [4, 3],
				});
				if (!result.cancelled) {
					this.updateImageLists(imageListIndex, result.uri);
				}
			}
		} catch(error) {
			console.log(error);
		}
	};

	async takePhoto(imageListIndex: number) {
		try {
			const { status: camera } = await Permissions.askAsync(Permissions.CAMERA);
			if (camera === 'granted') {
				let result = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [4, 3],
				});
				if (!result.cancelled) {
					this.updateImageLists(imageListIndex, result.uri);
				}
			}
		} catch(error) {
			console.log(error);
		}
	}

	onOpenActionSheet = (imageListIndex: number) => {
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
				this.pickImage(imageListIndex);
			}
			else if (buttonIndex === 1) {
				this.takePhoto(imageListIndex);
			}
		  // Do something here depending on the button index selected
		});
	  }

	onFormValueChanged = (name: String) => {
		return (event: any) => {
			this.setFormState(name, event.target.value);
		};
	};

	renderImageArray(imageListIndex: number) {
		const imageObj: IImageList | undefined = _.find(this.state.imageLists, (imageList: IImageList) => imageList.index === imageListIndex);
		return (
			<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
				{
					(imageObj) &&
						_.each(imageObj.ImageElements, (element: JSX.Element, index: number) => {
							return (
								<View key={index}>
									{element}
								</View>
							);
						})
				}
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
										<Input />
									</Item>
								);
							case 'textarea' :
								return (
									<View style={DynamicFormStyles.textArea} key={i}>
										<Text>{changeCase.sentenceCase(field.name)}</Text>
										<Textarea key={i} rowSpan={5} bordered />
									</View>
								);
							case 'image' :
								if (_.isEmpty(this.state.imageLists)) {
									return (
										<View style={DynamicFormStyles.imageType} key={i}>
											<Text>{changeCase.sentenceCase(field.name)}</Text>
											<TouchableOpacity onPress={() => this.onOpenActionSheet(i)} style={DynamicFormStyles.photoBoxContainer}>
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
										<View style={DynamicFormStyles.imageType} key={i}>
											<Text>{changeCase.sentenceCase(field.name)}</Text>
											{this.renderImageArray(i)}
											<TouchableOpacity onPress={() => this.onOpenActionSheet(i)} style={{ width: width * 0.2, height: width * 0.2 }}>
												<View style={{ flex: 0.1 }} />
												<View style={[ContainerStyles.flexRow, { flex: 0.8 }]}>
													<Icon style={DynamicFormStyles.photoBoxCameraIcon} name="add" />
												</View>
												<View style={{ flex: 0.1 }} />
											</TouchableOpacity>
										</View>
									)
								}
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