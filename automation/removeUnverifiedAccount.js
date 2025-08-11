import cron from 'node-cron';
import { User } from '../models/user.models.js';

export const remeveUnverifiedAccount =  () => {
    cron.schedule(' */30 * * * *', async() => {
        const thirtyMinutsOld = new Date(Date.now() - 30 * 60 * 1000);
        await User.deleteMany({createdAt: {$lt:thirtyMinutsOld}, accountverified:false})
    })
}