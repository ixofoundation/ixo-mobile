import React from 'react';
import { FormStyles } from '../../models/form';
import { View, Container, Content, Label } from 'native-base';

export interface ParentProps {
	formStyle: FormStyles;
	formSchema: any;
	presetValues?: any[];
	//submitText?: string;
	//projectDID?: string;
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

	/* handleRenderButtons = () => {

        return (
            <ButtonContainer>
                <div className="row">
                    <div className="col-md-6">
                        <ReturnButton onClick={() => history.back(-1)}>Back</ReturnButton>
                    </div>
                    <div className="col-md-6">
                        <SubmitButton onClick={this.handleSubmit}>
                            {this.props.submitText ? this.props.submitText : 'Submit Form'}
                            <i className="icon-approvetick" />
                        </SubmitButton>
                    </div>
                </div>
            </ButtonContainer>
        );
    }; */

	render() {
		return (
			<View>
				{this.props.formSchema.map((field: any, i: any) => {
					return <Label>{field.label}</Label>;
				})}
			</View>
		);
	}
}
