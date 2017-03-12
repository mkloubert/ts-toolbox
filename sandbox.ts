
import * as Toolbox from './';

interface Test {
    a: number;
    b: boolean;
    c: string;
}

let j = Toolbox.fromJSON<Test>(`{
    "a": 5979,
    "b": true,
    "c": "TM"
}`);
if (j) {

}
