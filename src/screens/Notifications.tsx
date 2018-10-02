import * as React from 'react';
import { StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Icon, Content, Text, Switch, Picker, View } from 'native-base';
import { ThemeColors } from '../styles/Colors';
import ContainersStyles from '../styles/Containers';

const { width } = Dimensions.get('window');

const Toggle = ({ name, value }: { name: string; value: boolean }) => (
	<TouchableOpacity style={[ContainersStyles.flexRow, { justifyContent: 'space-between' }]}>
		<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 19, fontWeight: '500', paddingHorizontal: 5, paddingVertical: 10 }}>{name}</Text>
		<Switch value={value} />
	</TouchableOpacity>
);

const PickerLink = () => (
	<View style={[ContainersStyles.flexRow, { justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: ThemeColors.grey }]}>
		<Picker
			mode="dropdown"
			placeholder="Once a week"
			placeholderStyle={{ color: ThemeColors.grey, fontSize: 19, fontWeight: '500' }}
			note={false}
			style={{ width: width * 0.6 }}
		>
			<Picker.Item label="Value 1" value="key0" />
			<Picker.Item label="Value 2" value="key1" />
			<Picker.Item label="Value 3" value="key2" />
			<Picker.Item label="Value 4" value="key3" />
			<Picker.Item label="Value 5" value="key4" />
		</Picker>
		<Icon name="ios-arrow-down-outline" />
	</View>
);

interface ParentProps {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

class Notifications extends React.Component<ParentProps> {
	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="arrow-back" onPress={() => props.navigation.pop()} style={{ paddingLeft: 10, color: ThemeColors.grey }} />,
			title: 'Notifications',
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
			<Container style={{ backgroundColor: ThemeColors.white }}>
				<StatusBar barStyle="dark-content" />
				<Content contentContainerStyle={{ backgroundColor: ThemeColors.white, padding: 20 }}>
					<Toggle name={'Email notifications'} value={true} />
					<Toggle name={'Sync reminder alerts'} value={true} />
					<PickerLink />
					<Toggle name={'Claim approval alerts'} value={true} />
				</Content>
			</Container>
		);
	}
}

export default Notifications;
