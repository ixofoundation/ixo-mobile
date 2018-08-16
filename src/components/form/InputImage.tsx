import * as React from 'react';

export interface ParentProps {
	id: string;
	imageWidth: number;
	text?: string;
	aspect?: number;
}
export interface Callbacks {
	onChange?: (event: any) => void;
}

export interface Props extends ParentProps, Callbacks {}

export interface State {
	croppedImage: string;
}

export default class InputImage extends React.Component<Props, State> {
	render() {
		return <div>Image</div>
	}
}
