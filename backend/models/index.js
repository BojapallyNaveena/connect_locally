import User from './User.js';
import Job from './Job.js';
import Application from './Application.js';
import Message from './Message.js';
import Review from './Review.js';
import Payment from './Payment.js';

// User -> Job (Employer posting jobs)
User.hasMany(Job, { foreignKey: 'postedById', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'postedById', as: 'postedBy' });

// User -> Application
User.hasMany(Application, { foreignKey: 'UserId' });
Application.belongsTo(User, { foreignKey: 'UserId' });

// Job -> Application
Job.hasMany(Application, { foreignKey: 'JobId' });
Application.belongsTo(Job, { foreignKey: 'JobId' });

// User -> Message (Sender and Receiver)
User.hasMany(Message, { foreignKey: 'SenderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'SenderId', as: 'sender' });

User.hasMany(Message, { foreignKey: 'ReceiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'ReceiverId', as: 'receiver' });

// Job -> Message
Job.hasMany(Message, { foreignKey: 'JobId' });
Message.belongsTo(Job, { foreignKey: 'JobId' });

// User -> Review
User.hasMany(Review, { foreignKey: 'ReviewerId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'ReviewerId', as: 'reviewer' });

User.hasMany(Review, { foreignKey: 'TargetUserId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'TargetUserId', as: 'targetUser' });

// Job -> Review
Job.hasMany(Review, { foreignKey: 'JobId' });
Review.belongsTo(Job, { foreignKey: 'JobId' });

// User -> Payment
User.hasMany(Payment, { foreignKey: 'PayerId', as: 'madePayments' });
Payment.belongsTo(User, { foreignKey: 'PayerId', as: 'payer' });

User.hasMany(Payment, { foreignKey: 'ReceiverId', as: 'receivedPayments' });
Payment.belongsTo(User, { foreignKey: 'ReceiverId', as: 'receiver' });

// Job -> Payment
Job.hasMany(Payment, { foreignKey: 'JobId' });
Payment.belongsTo(Job, { foreignKey: 'JobId' });

export { User, Job, Application, Message, Review, Payment };
