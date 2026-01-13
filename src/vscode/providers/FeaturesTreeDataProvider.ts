import * as vscode from 'vscode';
import { TestTreeItem } from '../TestTreeItem';
import { TreeItemType, TreeItemData } from '../types';

export class FeaturesTreeDataProvider implements vscode.TreeDataProvider<TestTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TestTreeItem | undefined | null | void> = new vscode.EventEmitter<TestTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TestTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TestTreeItem): Thenable<TestTreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getRootFeatures());
        } else {
            const featureId = element.data?.featureId;
            return Promise.resolve(this.getFeatureDetails(featureId));
        }
    }

    private getRootFeatures(): TestTreeItem[] {
        const features = [
            {
                id: 'dockerized',
                label: 'Dockerized Testing',
                description: 'Run tests in isolated containers',
                icon: new vscode.ThemeIcon('container')
            },
            {
                id: 'ai',
                label: 'AI-Powered',
                description: 'Leverage AI for test generation',
                icon: new vscode.ThemeIcon('sparkle')
            },
            {
                id: 'polyglot',
                label: 'Polyglot Support',
                description: 'Test across multiple languages',
                icon: new vscode.ThemeIcon('symbol-array')
            },
            {
                id: 'bdd',
                label: 'BDD Framework',
                description: 'Behavior-driven development',
                icon: new vscode.ThemeIcon('graph')
            },
            {
                id: 'realtime',
                label: 'Real-time Results',
                description: 'Instant feedback on test runs',
                icon: new vscode.ThemeIcon('watch')
            },
            {
                id: 'integration',
                label: 'VS Code Integration',
                description: 'Seamless editor experience',
                icon: new vscode.ThemeIcon('extensions')
            }
        ];
        
        return features.map(feature => 
            new TestTreeItem(
                feature.label,
                TreeItemType.File,
                vscode.TreeItemCollapsibleState.Collapsed,
                { 
                    featureId: feature.id,
                    description: feature.description 
                },
                undefined,
                feature.icon
            )
        );
    }

    private getFeatureDetails(featureId?: string): TestTreeItem[] {
        if (!featureId) {
            return [];
        }
        
        const details: Record<string, Array<{label: string, description: string}>> = {
            dockerized: [
                { label: 'Isolated Environments', description: 'Each test runs in its own Docker container' },
                { label: 'Consistent Dependencies', description: 'No more "works on my machine" issues' },
                { label: 'Easy Cleanup', description: 'Containers are automatically removed after tests' }
            ],
            ai: [
                { label: 'Test Generation', description: 'AI suggests test cases based on code' },
                { label: 'Bug Prediction', description: 'Identify potential issues before they occur' },
                { label: 'Smart Assertions', description: 'Automatically generate meaningful assertions' }
            ],
            polyglot: [
                { label: 'TypeScript/JavaScript', description: 'Full support for Node.js and web' },
                { label: 'Python', description: 'Compatible with pytest and unittest' },
                { label: 'Go', description: 'Native Go testing integration' },
                { label: 'More Languages', description: 'Java, Rust, Ruby coming soon' }
            ],
            bdd: [
                { label: 'Gherkin Syntax', description: 'Write tests in natural language' },
                { label: 'Step Definitions', description: 'Map business requirements to code' },
                { label: 'Living Documentation', description: 'Always up-to-date test documentation' }
            ],
            realtime: [
                { label: 'Live Updates', description: 'See test results as they happen' },
                { label: 'Interactive Debugging', description: 'Pause and inspect test execution' },
                { label: 'Performance Metrics', description: 'Track test execution time and resources' }
            ],
            integration: [
                { label: 'Sidebar Views', description: 'Dedicated panels for tests, files, and results' },
                { label: 'Terminal Integration', description: 'Run tests directly from VS Code terminals' },
                { label: 'Code Lens', description: 'Inline test actions in your source code' }
            ]
        };

        const featureDetails = details[featureId] || [];
        
        return featureDetails.map(detail =>
            new TestTreeItem(
                detail.label,
                TreeItemType.File,
                vscode.TreeItemCollapsibleState.None,
                { 
                    description: detail.description 
                },
                undefined,
                new vscode.ThemeIcon('circle-filled')
            )
        );
    }
}
