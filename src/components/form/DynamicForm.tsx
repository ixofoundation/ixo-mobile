import * as React from 'react';
import moment from 'moment';
import { Image, TouchableOpacity, Alert } from 'react-native';
import { FormStyles } from '../../models/form';
import { Form, View, Label, Text, Icon } from 'native-base';
import InputField, { InputColorTypes } from '../../components/InputField';
import ImagePicker from 'react-native-image-picker';
import * as changeCase from 'change-case';
import * as _ from 'underscore';
import LightButton from '../../components/LightButton';

const placeholder = require('../../../assets/ixo-placeholder.jpg');

import DynamicFormStyles from '../../styles/componentStyles/DynamicForm';
import { ThemeColors } from '../../styles/Colors';

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
	editMode: boolean;
	claimDate: Date;
	handleRemove: Function;
}

export interface State {
	submitStatus: string;
	refresh: boolean;
	imageList: IImage[];
}

export interface Callbacks {
	handleSubmit?: (formData: any) => void;
	handleSave?: (formData: any) => void;
}

export interface Props extends ParentProps, Callbacks {}
export default class DynamicForm extends React.Component<Props, State> {
	private formData: any = {};

	state = {
		submitStatus: '',
		refresh: false,
		imageList: []
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

		if (this.props.editMode) {
			this.buildFormState();
		}
	}

	buildFormState = () => {
		const formData = {};
		this.props.formSchema.map((field: any, i: any) => {
			formData[field.name] = field.value;
		});
		this.formData = formData;
	};

	setFormState = (name: String, value: any) => {
		const fields = name.split('.');
		let formData: any = { ...this.formData };
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

	pickImage(fieldName: string) {
		try {
			ImagePicker.launchImageLibrary({ quality: 0.9, mediaType: 'photo' }, response => {
				const base64 = `data:image/jpeg;base64,${response.data}`;
				this.props.formSchema.find(x => x.name === fieldName).value = base64;
				this.setFormState(fieldName, base64);
				this.setState({ refresh: false });
			});
		} catch (error) {
			console.log(error);
		}
	}

	takePhoto(fieldName: string) {
		try {
			ImagePicker.launchCamera({ quality: 0.9, mediaType: 'photo' }, response => {
				const base64 = `data:image/jpeg;base64,${response.data}`;
				this.props.formSchema.find(x => x.name === fieldName).value = base64;
				this.setFormState(fieldName, base64);
				this.setState({ refresh: false });
			});
		} catch (error) {
			console.log(error);
		}
	}

	removePhoto(name: string) {
		const imageFound = this.props.formSchema.find(x => x.name === name);
		if (imageFound) {
			imageFound.value = '';
		}
		this.setFormState(name, '');
		this.setState({ refresh: false });
	}

	handleSave = () => {
		if (this.props.handleSave) {
			this.props.handleSave(this.formData);
		}
	}

	handleSubmit = () => {
		if (this.props.handleSubmit) {
			this.props.handleSubmit(this.formData);
		}
	}

	handleUploadMedia = () => {
		if (this.props.editMode) {
			Alert.alert('Upload Media', '', [
				{ text: 'Select from Camera Roll', onPress: () => this.pickImage(name) },
				{ text: 'Take photo', onPress: () => this.takePhoto(name) },
				{ text: 'Cancel', style: 'cancel' }
			])
		}
	}

	renderPreview(fieldName: string) {
		const imageObj: IImage | undefined = _.find(this.state.imageList, (imageList: IImage) => imageList.fieldName === fieldName);
		if (imageObj) {
			return <View key={imageObj.fieldName}>{imageObj.imageElement}</View>;
		}
		return null;
	}

	renderImage(uri: string, name: string, key: string) {
		if (uri === '') {
			return (
				<TouchableOpacity
					key={key}
					style={DynamicFormStyles.addImageContainer}
					onPress={() => this.handleUploadMedia()}
				>
					{(this.props.editMode) ? <Icon name={'add'} style={{ color: ThemeColors.blue_lightest, fontSize: 50 }} /> : null}
				</ TouchableOpacity>
			);
		}
		return (
			<View key={key}>
				{this.props.editMode && (
					<TouchableOpacity
						onPress={() =>
							Alert.alert('Remove Image?', '', [{ text: 'Remove', onPress: () => this.removePhoto(name) }, { text: 'Cancel', style: 'cancel' }], {
								cancelable: true
							})
						}
						style={DynamicFormStyles.removePhoto}
					>
						<Icon name={'close'} style={DynamicFormStyles.removePhotoIcon} />
					</TouchableOpacity>
				)}

				<Image resizeMode={'contain'} style={DynamicFormStyles.imageContainer} source={uri === '' ? placeholder : { uri }} />
			</View>
		);
	}

	render() {
		return (
			<Form>
				<Text style={{ color: ThemeColors.blue_lightest, fontSize: 12, paddingLeft: 3 }}>
					{this.props.screenProps.t('claims:claimCreated')} {moment(this.props.claimDate).format('YYYY-MM-DD')}
				</Text>
				<View
					style={{
						backgroundColor: ThemeColors.white,
						marginVertical: 5,
						shadowOffset: { width: 2, height: 2 },
						shadowColor: ThemeColors.grey,
						shadowOpacity: 3.0,
						borderRadius: 2
					}}
				>
					{this.props.formSchema.map((field: any, i: any) => {
						switch (field.type) {
							case 'number':
							case 'text':
							case 'email':
								return (
									<View key={i} style={{ borderBottomColor: ThemeColors.grey_light, borderBottomWidth: 1 }}>
										<InputField
											disable={!this.props.editMode}
											onChangeText={text => this.setFormState(field.name, text)}
											colorPalette={InputColorTypes.Light}
											value={field.value}
											labelName={changeCase.sentenceCase(field.name)}
										/>
									</View>
								);
							case 'textarea':
								return (
									<InputField
										key={i}
										disable={!this.props.editMode}
										onChangeText={text => this.setFormState(field.name, text)}
										colorPalette={InputColorTypes.Light}
										value={field.value}
										labelName={changeCase.sentenceCase(field.name)}
									/>
								);
							case 'image':
								return null;
							case 'select':
							case 'country':
							case 'template':
							case 'radio':
							default:
								return <Label key={i}>{field.label}</Label>;
						}
					})}
				</View>
				<View
					key={'images'}
					style={{
						flex: 1,
						marginVertical: 5,
						alignItems: 'flex-start',
						flexWrap: 'wrap',
						backgroundColor: ThemeColors.white,
						flexDirection: 'row',
						padding: 10,
						shadowOffset: { width: 2, height: 2 },
						shadowColor: ThemeColors.grey,
						shadowOpacity: 3.0,
						borderRadius: 2
					}}
				>
					{this.props.formSchema.map((field: any, i: any) => {
						if (field.type === 'image') {
							return this.renderImage(field.value, field.name, i);
						}
					})}
				</View>
				{this.props.editMode ? (
					<LightButton
						textStyles={{ color: ThemeColors.black }}
						propStyles={[DynamicFormStyles.deleteButton, { marginBottom: 90 }]}
						text={this.props.screenProps.t('claims:deleteClaim')}
						onPress={() =>
							Alert.alert(this.props.screenProps.t('claims:sureToDelete'), this.props.screenProps.t('claims:cantBeUndone'), [{ text: this.props.screenProps.t('claims:no') }, { text: this.props.screenProps.t('claims:yesDelete'), onPress: () => this.props.handleRemove() }], {
								cancelable: true
							})
						}
					/>
				) : null}
			</Form>
		);
	}
}
