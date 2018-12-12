import * as React from 'react';
import Swiper from 'react-native-swiper';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, KeyboardAvoidingView, Dimensions, Picker } from 'react-native';
import { FormStyles } from '../../models/form';
import { ThemeColors, CardContainerBox } from '../../styles/Colors';
import { View, Text, Icon, Content } from 'native-base';
import LightButton from '../../components/LightButton';
import changeCase from 'change-case';
import _ from 'underscore';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { dynamicSetFormCardIndex } from '../../redux/dynamics/dynamics_action_creators';
import { showToast, toastType } from '../../utils/toasts';

import InputFieldArea from '../../components/InputFieldArea';
import InputField from '../../components/InputField';

import DynamicFormStyles from '../../styles/componentStyles/DynamicSwiperForm';
import ContainerStyles from '../../styles/Containers';
import { IProject } from '../../models/project';
import KeyboardUtil from '../../utils/keyboard';

const { height } = Dimensions.get('window');

interface IImage {
	fieldName: string;
	uri: string;
	filename: string;
}

interface ICardDetails {
	totalQuestions: number;
	questionNumber: number;
	topic: string;
}

interface ParentProps {
	formStyle: FormStyles;
	formSchema: any;
	presetValues?: any[];
	showActionSheetWithOptions?: any;
	screenProps: any;
	navigation: any;
	handleUserFilledClaim: Function;
}

interface StateProps {
	dynamicFormIndex: number;
	selectedProject: IProject;
}

interface State {
	submitStatus: string;
	hasCameraPermission: boolean;
	imageList: IImage[] | any[];
	keyboardVisible: boolean;
	dropDownValues: number[];
}

interface DispatchProps {
	onSetFormCardIndex: (index: number) => void;
}

declare var formSwiperRef: any;

export interface Props extends ParentProps, StateProps, DispatchProps {}
class DynamicSwiperForm extends React.Component<Props, State> {
	private formData: any = {};
	private keyboardUtil: KeyboardUtil;

	state = {
		submitStatus: '',
		hasCameraPermission: false,
		imageList: [],
		keyboardVisible: false,
		dropDownValues: []
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

	componentDidUpdate() {
		if (this.props.dynamicFormIndex - formSwiperRef.state.index !== 0) {
			formSwiperRef.scrollBy(this.props.dynamicFormIndex - formSwiperRef.state.index);
		}
	}

	componentDidMount() {
		this.keyboardUtil = new KeyboardUtil(
			() => {
				this.setState({ keyboardVisible: true });
			},
			() => {
				this.setState({ keyboardVisible: false });
			}
		);
	}

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
		this.props.handleUserFilledClaim(formData);
	};

	setFormStateSelect = (name: String, optionLabel: string, value: any) => {
		const fields = name.split('.');
		let formData: any = { ...this.formData };
		fields.forEach((field, index) => {
			if (index === fields.length - 1) {
				formData[field][optionLabel] = value;
			} else {
				if (!formData[field]) {
					formData[field] = {};
				}
				formData = formData[field];
			}
		});
		this.formData = formData;
	};

	onIndexChanged = (index: number) => {
		if (index !== this.props.dynamicFormIndex) {
			this.props.onSetFormCardIndex(index);
		}
	};

	updateImageList = (fieldName: string, uri: string) => {
		const imageListArray: IImage[] = this.state.imageList;
		imageListArray.push({ fieldName, filename: uri.replace(/^.*[\\\/]/, ''), uri });
		this.setState({ imageList: imageListArray });
	};

	removeImageList = (fieldName: string) => {
		const imageListArray: IImage[] = this.state.imageList;
		const index: number | undefined = _.findIndex(imageListArray, imageList => imageList.fieldName === fieldName);
		imageListArray.splice(index, 1);
		this.setState({ imageList: imageListArray });
	};

	getPermissionForImage(fieldName: string) {
		Permissions.check('photo').then(response => {
			if (response === 'denied') {
				showToast('Permissions denied', toastType.WARNING);
				return;
			}
			if (response === 'undetermined') {
				this.pickImage(fieldName);
			}
			this.pickImage(fieldName);
		});
	}

	getPermissionForCamera(fieldName: string) {
		Permissions.check('camera').then(response => {
			if (response === 'denied') {
				showToast('Permissions denied', toastType.WARNING);
				return;
			}
			if (response === 'undetermined') {
				this.takePhoto(fieldName);
			}
			this.takePhoto(fieldName);
		});
	}

	pickImage(fieldName: string) {
		ImagePicker.launchImageLibrary({ quality: 0.9, mediaType: 'photo' }, response => {
			if (!response.didCancel! && response.uri !== undefined) {
				const base64 = `data:image/jpeg;base64,${response.data}`;
				this.setFormState(fieldName, base64);
				this.updateImageList(fieldName, response.uri);
			}
		});
	}

	takePhoto(fieldName: string) {
		ImagePicker.launchCamera({ quality: 0.9, mediaType: 'photo' }, response => {
			if (!response.didCancel! && response.uri !== undefined) {
				const base64 = `data:image/jpeg;base64,${response.data}`;
				this.setFormState(fieldName, base64);
				this.updateImageList(fieldName, response.uri);
			}
		});
	}

	onFormValueChanged = (name: String, text: string) => {
		this.setFormState(name, text);
	};

	renderEditImageField(field: any, index: number) {
		const imageItem: IImage | undefined = _.find(this.state.imageList, (imageItem: IImage) => imageItem.fieldName === field.name);
		if (_.isEmpty(this.state.imageList) || imageItem === undefined) {
			return (
				<View key={index}>
					<LightButton
						propStyles={{ marginBottom: 10, alignItems: 'flex-start', width: '100%' }}
						text={'CHOOSE PHOTO'}
						onPress={() => this.getPermissionForImage(field.name)}
					/>
					<LightButton propStyles={{ alignItems: 'flex-start', width: '100%' }} text={'TAKE PHOTO'} onPress={() => this.getPermissionForCamera(field.name)} />
				</View>
			);
		}

		return (
			<View
				key={index}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
					backgroundColor: '#016C89',
					paddingHorizontal: '3%',
					justifyContent: 'space-between'
				}}
			>
				<Text style={{ color: ThemeColors.blue_lightest, fontSize: 15 }}>{imageItem.filename}</Text>
				<TouchableOpacity style={{ borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}>
					<Icon onPress={() => this.removeImageList(field.name)} style={{ color: ThemeColors.white }} name="close" />
				</TouchableOpacity>
			</View>
		);
	}

	renderMultipleSelect(field: any, index: number) {
		return (
			<View key={index} style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Picker
					selectedValue={this.state.dropDownValues[index]}
					onValueChange={itemValue => {
						const temp = [...this.state.dropDownValues];
						temp[index] = itemValue;
						this.setState({ dropDownValues: temp });
						this.setFormState(field.name, itemValue);
					}}
					style={{ height: 50, width: '100%' }}
					itemStyle={{ color: ThemeColors.white }}
				>
					{field.options.map((option, i) => {
						return <Picker.Item color={ThemeColors.blue_dark} key={i} label={option.label} value={option.label} />;
					})}
				</Picker>
			</View>
		);
	}

	renderCards() {
		return (
			<Swiper
				ref={swiper => (formSwiperRef = swiper)}
				scrollEnabled={true}
				loop={false}
				activeDotColor={ThemeColors.blue_white}
				dotColor={ThemeColors.blue_light}
				showsButtons={false}
				showsPagination={!this.state.keyboardVisible}
				paginationStyle={{ paddingBottom: height * 0.1 }}
				onIndexChanged={(index: number) => this.onIndexChanged(index)}
			>
				{this.props.formSchema.map((field: any, i: any) => {
					const cardDetails = {
						totalQuestions: this.props.formSchema.length,
						questionNumber: i + 1,
						topic: changeCase.sentenceCase(field.label)
					};
					switch (field.type) {
						case 'number':
						case 'text':
						case 'email':
							return this.renderCard(<InputField onChangeText={(text: string) => this.onFormValueChanged(field.name, text)} />, cardDetails, i);
						case 'textarea':
							return this.renderCard(<InputFieldArea onChangeText={(text: string) => this.onFormValueChanged(field.name, text)} />, cardDetails, i);
						case 'image':
							return this.renderCard(this.renderEditImageField(field, i), cardDetails, i);
						case 'select':
							return this.renderCard(this.renderMultipleSelect(field, i), cardDetails, i);
						case 'country':
						case 'template':
						case 'radio':
						default:
							const temp = (
								<View>
									<Text>{field.label}</Text>
								</View>
							);
							return this.renderCard(temp, cardDetails, i);
					}
				})}
			</Swiper>
		);
	}

	renderCard(input: JSX.Element, cardDetails: ICardDetails, index: number) {
		return (
			<Content key={index}>
				<KeyboardAvoidingView behavior="position" enabled={true}>
					<LinearGradient colors={[CardContainerBox.colorPrimary, CardContainerBox.colorSecondary]} style={[DynamicFormStyles.outerCardContainerActive]}>
						<View style={[ContainerStyles.flexColumn, DynamicFormStyles.innerCardContainer]}>
							<Content style={{ width: '100%' }}>
								<View>
									<Text style={[DynamicFormStyles.questionHeader]}>
										{this.props.screenProps.t('claims:questions')} {cardDetails.questionNumber}/{cardDetails.totalQuestions}
									</Text>
								</View>
								<View>
									<Text style={DynamicFormStyles.header}>{cardDetails.topic}</Text>
								</View>
								<View style={{ width: '100%' }}>{input}</View>
							</Content>
						</View>
					</LinearGradient>
				</KeyboardAvoidingView>
			</Content>
		);
	}

	render() {
		return this.renderCards();
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		dynamicFormIndex: state.dynamicsStore.dynamicFormIndex,
		selectedProject: state.projectsStore.selectedProject
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onSetFormCardIndex: (formCardIndex: number) => {
			dispatch(dynamicSetFormCardIndex(formCardIndex));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DynamicSwiperForm);
