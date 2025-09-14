"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTree = buildTree;
function buildTree(projects) {
    return projects.map(projectName => ({
        name: projectName,
        type: 'project',
        children: [{
                name: 'src',
                type: 'file',
                children: [{
                        name: 'components',
                        type: 'file',
                        children: [{
                                name: 'pure',
                                type: 'file',
                                children: [
                                    { name: 'AppFrame.test', type: 'file', path: 'src/components/pure/AppFrame.test' },
                                    { name: 'FeaturesReporterView.test', type: 'file', path: 'src/components/pure/FeaturesReporterView.test' },
                                    { name: 'ProjectPageView.test', type: 'file', path: 'src/components/pure/ProjectPageView.test' }
                                ]
                            }]
                    }, {
                        name: 'lib',
                        type: 'file',
                        children: [{
                                name: 'baseBuilder.test',
                                type: 'file',
                                path: 'src/lib/baseBuilder.test'
                            }]
                    }]
            }]
    }));
}
