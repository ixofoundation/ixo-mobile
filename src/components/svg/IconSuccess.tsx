import * as React from 'react';
import Svg, { G, Rect, Path } from 'react-native-svg';

interface PropTypes {
	width: number;
	height: number;
}

const IconSuccess = (props: PropTypes) => (
	<Svg width={props.width} height={props.height} viewBox="0 0 79 88">
		<G id="Claims" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<G id="Claims-04---Submitted-success">
				<Rect x="0" y="0" width="750" height="1334" />
				<G id="Group-4" fill="#FFFFFF">
					<G id="icon-success">
						<Path
							d="M41,79.4375 C19.8055625,79.4375 2.5625,62.1944375 2.5625,41 C2.5625,19.8055625 19.8055625,2.5625 41,2.5625 C62.1944375,2.5625 79.4375,19.8055625 79.4375,41 C79.4375,62.1944375 62.1944375,79.4375 41,79.4375 M41,0 C18.3923438,0 0,18.3923438 0,41 C0,63.6076563 18.3923438,82 41,82 C63.6076563,82 82,63.6076563 82,41 C82,18.3923438 63.6076563,0 41,0"
							id="Fill-2"
						/>
						<Path
							d="M34.5913491,55.0630122 L34.51463,54.9964227 L22.3071806,42.6172986 L25.967595,38.9392064 L34.5835472,47.5906225 L56.0311047,26.056091 L59.6915191,29.7315719 L34.5913491,55.0630122 Z M34.5835472,43.8981678 L25.967595,35.2467517 L18.6363636,42.6068532 L33.5913994,57.7709864 L34.5874482,58.6405673 L34.6524644,58.7045455 L63.3636364,29.7263492 L56.0311047,22.3636364 L34.5835472,43.8981678 Z"
							id="Fill-1"
						/>
					</G>
				</G>
			</G>
		</G>
	</Svg>
);

export default IconSuccess;
