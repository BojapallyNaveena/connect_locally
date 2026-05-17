import { Message, User, Job } from '../models/index.js';
import { Op } from 'sequelize';

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { SenderId: currentUserId, ReceiverId: userId },
          { SenderId: userId, ReceiverId: currentUserId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, jobId } = req.body;
    
    const newMessage = await Message.create({
      SenderId: req.user.id,
      ReceiverId: receiverId,
      message,
      JobId: jobId
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    // Find all messages where user is sender or receiver
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ SenderId: currentUserId }, { ReceiverId: currentUserId }]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'role', 'profileImage'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'role', 'profileImage'] },
        { model: Job, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const conversationUsers = new Map();
    messages.forEach(msg => {
      const otherUser = msg.SenderId === currentUserId ? msg.receiver : msg.sender;
      if (otherUser && !conversationUsers.has(otherUser.id)) {
        // Store user info along with the job context from the latest message
        conversationUsers.set(otherUser.id, {
          ...otherUser.toJSON(),
          lastJob: msg.Job ? msg.Job.title : null,
          lastJobId: msg.Job ? msg.Job.id : null
        });
      }
    });

    res.status(200).json(Array.from(conversationUsers.values()));
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
