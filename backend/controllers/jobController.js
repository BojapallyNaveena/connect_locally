import { Job, User, Application } from '../models/index.js';
import sequelize from '../config/db.js';
import { generateEmbedding, jobToEmbedText } from '../rag/embeddings.js';
import { addItem } from '../rag/vectorStore.js';

// Post a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, category, payment, urgency, location, address } = req.body;

    const newJob = await Job.create({
      title,
      description,
      category,
      paymentAmount: payment?.amount || 0,
      paymentMode: payment?.mode || 'Cash',
      urgency: urgency || 'Medium',
      lat: location?.coordinates?.[1] || 17.3850,
      lng: location?.coordinates?.[0] || 78.4867,
      address: address || 'Location not specified',
      postedById: req.user.id,
      status: 'Open'
    });

    // Auto-index the new job for RAG
    try {
      const jobWithUser = await Job.findByPk(newJob.id, {
        include: [{ model: User, as: 'postedBy', attributes: ['name', 'rating'] }]
      });
      const text = jobToEmbedText(jobWithUser.toJSON());
      const embedding = await generateEmbedding(text);
      addItem({
        id: newJob.id,
        type: 'job',
        title: newJob.title,
        category: newJob.category,
        address: newJob.address,
        paymentAmount: newJob.paymentAmount,
        paymentMode: newJob.paymentMode,
        urgency: newJob.urgency,
        status: newJob.status,
        postedBy: jobWithUser.postedBy?.name || 'Unknown',
        rating: jobWithUser.postedBy?.rating || 0,
        description: newJob.description?.slice(0, 200),
        lat: newJob.lat,
        lng: newJob.lng,
        indexedAt: new Date().toISOString()
      }, embedding);
      console.log(`[RAG] Auto-indexed new job: ${newJob.title}`);
    } catch (indexError) {
      console.error('[RAG] Failed to auto-index job:', indexError.message);
      // Don't fail the job creation if indexing fails
    }

    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get nearby jobs (within 15-20km radius)
export const getNearbyJobs = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 20000 } = req.query; // maxDistance in meters (20km)

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const filters = { status: 'Open' };
    if (req.query.category) filters.category = req.query.category;

    const jobs = await Job.findAll({
      where: [
        filters,
        sequelize.where(
          sequelize.literal(`(6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat))))`),
          '<=',
          parseInt(maxDistance) / 1000
        )
      ],
      include: [
        {
          model: User,
          as: 'postedBy',
          attributes: ['id', 'name', 'rating', 'profileImage']
        }
      ]
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Fetch nearby jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all jobs (with optional filters)
export const getJobs = async (req, res) => {
  try {
    const filters = {};
    // If status is provided, use it. Otherwise, default to 'Open' for the general list.
    if (req.query.status && req.query.status !== 'all') {
      filters.status = req.query.status;
    } else if (!req.query.status) {
      filters.status = 'Open';
    }
    
    if (req.query.category && req.query.category !== 'All') {
      filters.category = req.query.category;
    }
    if (req.query.postedBy) {
      filters.postedById = req.query.postedBy;
    }

    const jobs = await Job.findAll({
      where: filters,
      include: [
        {
          model: User,
          as: 'postedBy',
          attributes: ['id', 'name', 'rating']
        },
        {
          model: Application,
          required: false,
          include: [{ 
            model: User, 
            attributes: ['id', 'name', 'profileImage'],
            required: false 
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Fetch Jobs Error:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};
