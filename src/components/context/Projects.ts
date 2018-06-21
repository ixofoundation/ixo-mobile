import React from 'react';
import { IProject } from '../models/Project';
import { Ixo } from 'ixo-module';

export const Projects = React.createContext({
    projects: [],
    initIxo: () => {
        const ixo = new Ixo();
        ixo.project.listProjects().then((response: any) => {
        const { result = [] } = response;
        const projects: IProject[] = [];
        _.each(result, (item: IProject) => {
            projects.push(item);
        });
        this.setState({ projects });
        }).catch((result: Error) => {
        console.log(result);
        });
    }
});