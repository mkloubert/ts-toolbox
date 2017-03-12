
import * as Toolbox from './';

let cron = Toolbox.startCron('*/5 * * * * *', () => {
    console.log(new Date());
});
