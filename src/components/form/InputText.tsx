import * as React from 'react';
import { FormStyles } from '../../models/form';

export interface ParentProps {
	type: string;
	id?: string;
	formStyle: FormStyles;
	text?: string;
	value?: string;
	validation?: string;
}
export interface Callbacks {
	onChange?: (event: any) => void;
}

export interface Props extends ParentProps, Callbacks {}

const InputText: React.SFC<Props> = props => {
	if (props.formStyle === FormStyles.disabled) {
		return (
			<div className={`${props.formStyle.toLowerCase()}-input`}>
				<input
					className="form-control"
					id={props.id}
					type={props.type}
					placeholder={props.value}
					value={props.text}
					name={props.id}
					disabled={true}
				/>
				<p>{props.value}</p>
			</div>
		);
	} else {
		return (
			<div className={`${props.formStyle.toLowerCase()}-input`}>
				<input className="form-control" id={props.id} type={props.type} placeholder={props.text} onChange={props.onChange} name={props.id} />
				<p>{props.text}</p>
			</div>
		);
	}
};

export default InputText;
