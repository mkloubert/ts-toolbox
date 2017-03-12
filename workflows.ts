// The MIT License (MIT)
// 
// ts-toolbox (https://github.com/mkloubert/ts-toolbox)
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER


/**
 * A workflow action.
 * 
 * @param {WorkflowActionContext} ctx The current execution context.
 * 
 * @return {WorkflowActionResult} The result.
 */
export type WorkflowAction = (ctx: WorkflowActionContext) => WorkflowActionResult;

/**
 * An execution context of a workflow action.
 */
export interface WorkflowActionContext {
    /**
     * Gets the number of all workflow actions.
     */
    readonly count: number;
    /**
     * Gets the current number of executed actions.
     */
    readonly executions: number;
    /**
     * Skips all upcoming actions.
     * 
     * @chainable
     */
    readonly finish: () => WorkflowAction;
    /**
     * Sets the pointer for the next action.
     * 
     * @param {number} newIndex The zero based index of the next action.
     * 
     * @chainable
     */
    readonly goto: (newIndex: number) => WorkflowAction;
    /**
     * Sets the pointer to the first action.
     * 
     * @chainable
     */
    readonly gotoFirst: () => WorkflowAction;
    /**
     * Sets the pointer to the last action.
     * 
     * @chainable
     */
    readonly gotoLast: () => WorkflowAction;
    /**
     * Gets the current zero based index.
     */
    readonly index: number;
    /**
     * Gets if the current action is NOT the first AND NOT the last one.
     */
    readonly isBetween: boolean;
    /**
     * Gets if the current action is the FIRST one.
     */
    readonly isFirst: boolean;
    /**
     * Gets if the current action is the LAST one.
     */
    readonly isLast: boolean;
    /**
     * Gets or sets the value for the next execution.
     */
    nextValue?: any;
    /**
     * Gets the index of the previous workflow.
     */
    readonly previousIndex?: number;
    /**
     * Gets the value from the previous execution.
     */
    readonly previousValue: any;
    /**
     * Gets or sets the result of the whole workflow.
     */
    result?: any;
    /**
     * Gets or sets a value for the whole execution chain.
     */
    value?: any;
    /**
     * Gets or sets the state of the underlying workflow.
     */
    workflowState: any;
}

/**
 * The result of a workflow action.
 */
export type WorkflowActionResult = Promise<any> | void;

/**
 * A workflow.
 */
export class Workflow {
    /**
     * Stores the actions of the Workflow.
     */
    protected _actions: WorkflowAction[] = [];
    
    /**
     * Alias for 'then'.
     */
    public next(action?: WorkflowAction): Workflow {
        return this.then
                   .apply(this, arguments);
    }

    /**
     * Resets the workflow.
     * 
     * @param {any} [newStateValue] The new state value.
     * 
     * @chainable
     */
    public reset(newStateValue?: any): Workflow {
        this._actions = [];

        this.resetState();

        return this;
    }

    /**
     * Resets the state value.
     * 
     * @chainable
     */
    public resetState(): Workflow {
        return this.setState(undefined);
    }

    /**
     * Sets the state value.
     * 
     * @param {any} newValue The new value.
     * 
     * @chainable
     */
    public setState(newValue: any): Workflow {
        this.state = newValue;

        return this;
    }
    
    /**
     * Starts the workflow.
     * 
     * @param {any} [initialValue] The initial value for the execution.
     * 
     * @returns {Promise<any>} The promise with the result of the workflow.
     */
    public start(initialValue?: any): Promise<any> {
        let me = this;

        return new Promise<any>((resolve, reject) => {
            try {
                let allActions = me._actions.map(x => x);

                let nextAction: () => void;

                let executions = -1;
                let index = -1;
                let prevIndx: number;
                let prevVal: any;
                let result: any;
                let value = initialValue;

                nextAction = () => {
                    try {
                        ++index;
                        if (index >= allActions.length) {
                            resolve(result);
                            return;
                        }

                        let action = allActions[index];

                        let ctx: WorkflowActionContext = {
                            count: allActions.length,
                            executions: ++executions,
                            finish: function() {
                                index = allActions.length - 1;
                                return this;
                            },
                            goto: function(newIndex) {
                                --newIndex;
                                if (newIndex < 0 || newIndex >= allActions.length) {
                                    throw new Error('Index out of range!');
                                }

                                index = newIndex;
                                return this;
                            },
                            gotoFirst: function() {
                                index = -1;
                                return this;
                            },
                            gotoLast: function() {
                                index = allActions.length - 1 - 1;
                                return this;
                            },
                            index: index,
                            isBetween: index > 0 && (index < (allActions.length - 1)),
                            isFirst: 0 === index,
                            isLast: (allActions.length - 1) === index,
                            previousIndex: prevIndx,
                            previousValue: prevVal,
                            result: result,
                            value: value,
                            workflowState: undefined,
                        };

                        // ctx.workflowState
                        Object.defineProperty(ctx, 'workflowState', {
                            get: function() {
                                return me.state;
                            },
                            set: function(newValue) {
                                me.state = newValue;
                            }
                        });

                        let actionCompleted = function(err: any, nextValue?: any) {
                            if (arguments.length > 1) {
                                prevVal = nextValue;
                            }
                            else {
                                prevVal = ctx.nextValue;
                            }

                            prevIndx = ctx.index;
                            result = ctx.result;
                            value = ctx.value;
                            
                            if (err) {
                                reject(err);
                            }
                            else {
                                nextAction();
                            }
                        };

                        if (action) {
                            let result = action(ctx);
                            if (result) {
                                // promise => "async" execution

                                result.then(function(nextValue?) {
                                    if (arguments.length > 0) {
                                        actionCompleted(null, nextValue);
                                    }
                                    else {
                                        actionCompleted(null);
                                    }
                                }, (err) => {
                                    actionCompleted(err);  // error
                                });
                            }
                            else {
                                actionCompleted(null);  // no result
                            }
                        }
                        else {
                            actionCompleted(null);  // no action
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                };

                nextAction();  // start with first action
                               // (if available)
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * The state of that workflow.
     */
    public state: any;

    /**
     * Adds a new action.
     * 
     * @param {WorkflowAction} [action] The action to add.
     * 
     * @chainable
     */
    public then(action?: WorkflowAction): Workflow {
        this._actions.push(action);

        return this;
    }
}
