import * as FS from 'fs';
import * as Toolbox from './';

interface Test {
    a: number;
    b: boolean;
    c: string;
}

Toolbox.startWorkflow((ctx) => {
    if (ctx) {

    }
}, (ctx) => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            if (ctx.state) {
                ctx.state = 5979;
            }
            else {
                ctx.state = 23979;
            }

            resolve(ctx.state);
        }, 5000);
    });
}, (ctx) => {
    ctx.result = 'TM';
}, (ctx) => {
    if (!ctx.value) {
        ctx.value = true;
        ctx.gotoFirst();
    }
}, (ctx) => {
    if (ctx) {
        
    }
}).then((result) => {
    if (result) {

    }
});
