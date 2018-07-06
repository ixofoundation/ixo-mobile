import React from 'react';
import { Toast } from 'native-base';
import { IProject, IClaim } from '../../models/project';
import { Ixo } from 'ixo-module';
import { env } from '../../../config';
import { GetSignature, verifyDocumentSignature } from "../../utils/sovrin";
import _ from 'underscore';


const { Provider, Consumer } = React.createContext({});

export class ConfigProvider extends React.Component {
    
    state = {
        projects: null,
        claims: null,
        ixo: new Ixo(env.REACT_APP_BLOCKCHAIN_IP, env.REACT_APP_BLOCK_SYNC_URL),
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
            const ProjectDIDPayload: Object = { projectDid: projectDid };
            GetSignature(ProjectDIDPayload).then((signature) => {
                this.state.ixo.claim.listClaimsForProject(ProjectDIDPayload, signature, pdsURL).then((response: any) => {
                    if (response.error) {
                        Toast.show({
                            text: 'Failed to load claims',
                            buttonText: 'OK',
                            type: 'danger'
                        });
                    } else {
                        this.setState({ claims: response.result });
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