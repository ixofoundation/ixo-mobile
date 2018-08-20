import React from 'react';
import { ImagePicker, Camera } from 'expo';
import { TouchableOpacity } from 'react-native';
import { FormStyles } from '../../models/form';
import { Textarea, Item, Form, Input, View, Label, Icon, Text } from 'native-base';
import changeCase from 'change-case';

import DynamicFormStyles from '../../styles/componentStyles/DynamicForm';
import ContainerStyles from '../../styles/Containers';
import { ThemeColors } from '../../styles/Colors';

const PhotoBox = () => (
	<TouchableOpacity onPress={() =>} style={DynamicFormStyles.photoBoxContainer}>
		<View style={[ContainerStyles.flexRow]}>
			<View style={[ContainerStyles.flexColumn]}>
				<Icon style={DynamicFormStyles.photoBoxCameraIcon} name="camera" />
			</View>
		</View>
	</TouchableOpacity>
);

const AddMoreBox = () => (
	<TouchableOpacity style={DynamicFormStyles.photoBoxContainer}>
		<View style={{ flex: 0.1 }} />
		<View style={[ContainerStyles.flexRow, { flex: 0.8 }]}>
			<Icon style={DynamicFormStyles.photoBoxCameraIcon} name="add" />
		</View>
		<View style={{ flex: 0.1 }} />
	</TouchableOpacity>
);

export interface ParentProps {
	formStyle: FormStyles;
	formSchema: any;
	presetValues?: any[];
}

export interface State {
	formData: any;
	submitStatus: string;
}

export interface Callbacks {
	handleSubmit: (formData: any) => void;
}

export interface Props extends ParentProps, Callbacks {}

export default class DynamicForm extends React.Component<Props, State> {
	state = {
		formData: {},
		submitStatus: ''
	};

	componentWillMount() {
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

	onFormValueChanged = (name: String) => {
		return (event: any) => {
			this.setFormState(name, event.target.value);
		};
	};

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
								<View style={{ marginTop: 20, paddingVertical: 10, borderTopColor: ThemeColors.grey, borderTopWidth: 1 }} key={i}>
									<Text>{changeCase.sentenceCase(field.name)}</Text>
									<Textarea key={i} rowSpan={5} bordered />
								</View>
							);
						case 'image' :
							return (
								<View style={{ marginTop: 20, paddingVertical: 10, borderTopColor: ThemeColors.grey, borderTopWidth: 1 }} key={i}>
									<Text>{changeCase.sentenceCase(field.name)}</Text>
									<PhotoBox />
								</View>
							)
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