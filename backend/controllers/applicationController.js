import { Application, Job, User } from '../models/index.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobId, experience, phoneNumber, aadharNumber } = req.body;
    
    // Check verification status
    const user = await User.findByPk(req.user.id);
    if (!user.isAadharVerified || !user.isPhoneVerified || !user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Verification required!', 
        details: {
          aadhar: user.isAadharVerified,
          phone: user.isPhoneVerified,
          email: user.isEmailVerified
        }
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      where: { UserId: req.user.id, JobId: jobId }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      UserId: req.user.id,
      JobId: jobId,
      experience,
      phoneNumber,
      aadharNumber,
      status: 'Pending'
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { UserId: req.user.id },
      include: [
        { model: Job, include: [{ model: User, as: 'postedBy', attributes: ['name'] }] }
      ]
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    const application = await Application.findByPk(applicationId, {
      include: [{ model: Job, as: 'Job' }]
    });

    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    // Check if the current user is the owner of the job
    if (application.Job.postedById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: `Application ${status} successfully`, application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitWork = async (req, res) => {
  try {
    const { applicationId, file } = req.body;
    const application = await Application.findByPk(applicationId);

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.UserId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    application.deliveryFile = file;
    await application.save();

    res.status(200).json({ message: 'Work submitted successfully', application });
  } catch (error) {
    console.error('Work submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
