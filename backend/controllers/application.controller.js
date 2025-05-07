import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id; //ye loggedin user ka id hai, isko isauthenticated se generate hua hai MW me
    const jobId = req.params.id; //we can also write const { id: jobId } = req.params;
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }
    //checking weather user has already applied for job or not
    const existingApplication = await Application.findOne({
      job: jobId, //Ye check karega ki application kis job ke liye hai.
      applicant: userId, //Ye check karega ki kis user ne apply kiya hai.
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    //check weather job exists or not!
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Job not found.",
        success: false,
      });
    }

    //create a new APPLICATION
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id); //here we pushing the application in applications(we have created this in jobmodel as array)
    await job.save(); //after pushing we save the job;
    return res.status(201).json({
      message: "Job applied Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//to find all the jobs i have applied
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id; //get the loggedin userid
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        //populate coz  sirf jobId nahi, balki poora job ka data chahiye,
        path: "job", //job model
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company", //nested populate:job model ke ander company hai uska bhi full info chahiye isliye aise use kiya.
          option: { sort: { createdAt: -1 } },
        },
      }); //go in Application model & find the appliedjobs in applicant by userid,,MongoDB se check ho raha hai ki user ne kaunse jobs pe apply kiya hai sort hame ascending order me display krega
    if (!application) {
      return res.status(404).json({
        message: "No Applications.",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    //now i will find the job in job model with thsi jobId and check the total number of applicants(kitne user apply kiye hai)
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//for update status weather to reject/accept the application
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    //find the application by applicantionId;
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }
    //update the status
    application.status = status.toLowerCase(); //status.toLowerCase():Ye tumhare status ko lowercase me convert kar raha hai. application.status:Fir ye updated status ko application object me save kar raha hai.
    await application.save();

    return res.status(200).json({
      message:"Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
