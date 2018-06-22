import React from 'react';
import { IProject } from '../models/Project';
import { Ixo } from 'ixo-module';
import _ from 'underscore';

const { Provider, Consumer } = React.createContext({});

export class ConfigProvider extends React.Component {
    
    state = {
        ixo: new Ixo(),
        projects: [],
        getProjects: (ixo: any) => {
            ixo.project.listProjects().then((response: any) => {
            const { result = [] } = response;
            const projects: IProject[] = [];
            _.each(result, (item: IProject) => {
            projects.push(item);
            });
            this.setState({ projects });
            //return projects;
            }).catch((result: Error) => {
            console.log(result);
            });
        }
    }

    componentDidMount() {
        const ixo = new Ixo();
        ixo.project.listProjects().then((response: any) => {
        const { result = [] } = response;
        const projects: IProject[] = [];
        _.each(result, (item: IProject) => {
            projects.push(item);
        });
        this.setState({ projects });
        //return projects;
        }).catch((result: Error) => {
            console.log(result);
        });
    }

    render() {
        return (
            <Provider 
                value={{
                    ixo: this.state.ixo,
                    projects: this.state.projects,
                    getProjects: this.state.getProjects
                }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export default Consumer;