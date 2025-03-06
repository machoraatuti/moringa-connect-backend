// controllers/jobController.js
const Job = require('../models/Job');

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name email profilePicture')
      .sort('-createdAt');
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email profilePicture');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary, contactEmail, applicationDeadline } = req.body;
    
    // Basic validation
    if (!title || !company || !location || !description || !requirements || !contactEmail) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      contactEmail,
      applicationDeadline,
      postedBy: req.user.id
    });
    
    const savedJob = await newJob.save();
    await savedJob.populate('postedBy', 'name email profilePicture');
    
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job posting', error: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary, contactEmail, applicationDeadline, isActive } = req.body;
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is the one who posted the job
    if (job.postedBy.toString() !== req.user.id && !req.user.admin) {
      return res.status(403).json({ message: 'Not authorized to update this job posting' });
    }
    
    // Update fields if provided
    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (salary !== undefined) job.salary = salary;
    if (contactEmail) job.contactEmail = contactEmail;
    if (applicationDeadline) job.applicationDeadline = applicationDeadline;
    if (isActive !== undefined) job.isActive = isActive;
    
    const updatedJob = await job.save();
    await updatedJob.populate('postedBy', 'name email profilePicture');
    
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job posting', error: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is the one who posted the job
    if (job.postedBy.toString() !== req.user.id && !req.user.admin) {
      return res.status(403).json({ message: 'Not authorized to delete this job posting' });
    }
    
    await job.deleteOne();
    
    res.status(200).json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job posting', error: error.message });
  }
};