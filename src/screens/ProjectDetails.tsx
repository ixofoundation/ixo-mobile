import { Button, Container, Content, Icon, Input, Item, Text, View } from 'native-base';
import * as React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import ProjectDetailStyles from '../styles/ProjectDetails';

const PhotoBox = () => (
	<TouchableOpacity style={ProjectDetailStyles.photoBoxContainer}>
		<View style={[ContainerStyles.flexRow, { justifyContent: 'flex-end', flex: 0.1 }]}>
			<Icon style={ProjectDetailStyles.photoBoxCloseIcon} name="close" />
		</View>
		<View style={[ContainerStyles.flexRow, { flex: 0.8 }]}>
			<Icon style={ProjectDetailStyles.photoBoxCameraIcon} name="camera" />
		</View>
		<View style={{ flex: 0.1 }} />
	</TouchableOpacity>
);

const AddMoreBox = () => (
	<TouchableOpacity style={ProjectDetailStyles.photoBoxContainer}>
		<View style={{ flex: 0.1 }} />
			<View style={[ContainerStyles.flexRow, { flex: 0.8 }]}>
				<Icon style={ProjectDetailStyles.photoBoxCameraIcon} name="add" />
			</View>
		<View style={{ flex: 0.1 }} />
	</TouchableOpacity>
);

interface ParentProps {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

class ProjectDetails extends React.Component<ParentProps> {
	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="close" onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />,
			title: 'sldkce2322kjsdlckd230092',
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
		};
	}

	render() {
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<Content
					contentContainerStyle={{
						backgroundColor: ThemeColors.white,
						padding: 20,
						flexDirection: 'column',
						justifyContent: 'space-between',
						flex: 1
					}}
				>
					<View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
						<Text style={[{ color: ThemeColors.black, fontSize: 19, fontWeight: '500' }]}>sldkce2322kjsdlckd230092</Text>
						<Text style={[{ color: ThemeColors.grey, fontSize: 15 }]}>Submitted on 04-09-18</Text>
					</View>

					<View>
						<Item>
							<Input placeholder="Michael Smith" />
							<Icon active name="create" style={{ color: ThemeColors.grey }} />
						</Item>
						<Item>
							<Input placeholder="250W Solar Panel" />
							<Icon active name="create" style={{ color: ThemeColors.grey }} />
						</Item>
						<Item>
							<Input placeholder="Panel installed successfully" />
							<Icon active name="create" style={{ color: ThemeColors.grey }} />
						</Item>
					</View>

					<View style={ContainerStyles.flexRow}>
						<PhotoBox />
						<PhotoBox />
						<AddMoreBox />
					</View>

					<View style={[ContainerStyles.flexColumn]}>
						<Button style={{ width: '100%', justifyContent: 'center' }} bordered dark>
							<Text>Save</Text>
						</Button>
						<Button style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark>
							<Text>Submit</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

export default ProjectDetails;
