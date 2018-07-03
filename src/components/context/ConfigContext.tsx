import React from 'react';
import { Toast } from 'native-base';
import { IProject, IClaim } from '../../models/project';
import { Ixo } from 'ixo-module';
import { GetSignature } from "../../utils/sovrin";
import _ from 'underscore';
import { AsyncStorage } from 'react-native';

const { Provider, Consumer } = React.createContext({});

export class ConfigProvider extends React.Component {
    
    state = {
        projects: null,
        claims: null,
        ixo: new Ixo(),
        getProjects: () => {
            this.state.ixo.project.listProjects()
            .then((response: any) => {
                const { result = [] } = response;
                const projects: IProject[] = [];
                _.each(result, (item: IProject) => {
                    projects.push(item);
                });
                Toast.show({
                    text: 'Synced',
                    buttonText: 'OK',
                    type: 'success'
                });
                this.setState({ projects });
            }).catch((result: Error) => {
                Toast.show({
                    text: 'Failed to load projects',
                    buttonText: 'OK',
                    type: 'danger'
                });
            });
        },
        getClaims: (projectDid: string, pdsURL: string) => {
            GetSignature(projectDid).then((signature) => {
                const ProjectDIDPayload: Object = { projectDid: projectDid };
                // console.log('project payload', ProjectDIDPayload);
                // console.log('signature::>>', signature);
                // console.log('pdsurl:', pdsURL);
                this.state.ixo.claim.listClaimsForProject(ProjectDIDPayload, signature, pdsURL).then((response: any) => {
                    console.log('RESPONSE', response);
                    if (response.error) {
                        Toast.show({
                            text: 'Failed to load claims',
                            buttonText: 'OK',
                            type: 'danger'
                        });
                    } else {
                        console.log('6. Final response', response.result);
                        console.log(response.result);
                        // this.setState({ claims: response.result });
                    }
                });
            }).catch((error) => {
                console.log('error catch', error);
                Toast.show({
                    text: 'Failed to authenticate',
                    buttonText: 'OK',
                    type: 'danger'
                });
            });
        },
    }

    render() {
        return (
            <Provider 
                value={{
                    projects: this.state.projects,
                    claims: this.state.claims,
                    getProjects: this.state.getProjects,
                    getClaims: this.state.getClaims
                }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export default Consumer;