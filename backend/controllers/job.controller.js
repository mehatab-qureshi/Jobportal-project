import { Job } from "../models/job.model.js";

//admin ke liye job post krne
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id; //user ki id leke aye isauthtenticated se so tht pata chale konsa user job ko post kr rha hai

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    )
      return res.status(400).json({
        message: "Something is Missing",
        success: false,
      });
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","), //reqrmnts ara h vo toh string hoga isliye split kiye
      salary: Number(salary), //salary jo ari hai maybe vo stirng me ho skti isliye num me convert krre
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId, //kon is job ko post krr rha hai
    });
    return res.status(200).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//student k liye...
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""; //ye URL me diya gya search word lera, keyword warna empty string le lega
    const query = {
      $or: [      //$or → Matlab title ya description dono me se kisi ek me match ho raha hai toh bhi chalega
        { title: { $regex: keyword, $options: "i" } },  //$regex: keyword → Matlab title ya description me keyword ka match ho raha hai ya nahi, ye check karega.
        { description: { $regex: keyword, $options: "i" } },  //$options: "i" → Case-insensitive search karega (matlab Developer aur developer dono match honge).
      ],
    };

    //HERE we are using POPULATE Method so that we can fetch the full info of company & created_by
    const jobs = await Job.find(query).populate({   //VVIMP  //Yaha query ka use ho raha hai,Matlab search filter apply ho raha hai title ya description pe.
      path:"company"  //.populate("company") ka matlab hai MongoDB se company ka pura data fetch karna.If we dont use this then bydefault it will fetch only ID  
    }).sort({createdAt:-1}); //.sort({ createdAt: -1 }) ka matlab newest jobs pehle show honge.
//Step 1: Jobs ko filter karega (keyword search)
//Step 2: Company details fetch karega (populate)
//Step 3: Naye jobs pehle aayenge (sort)

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
    //Step 4: Response me bhej dega!
  } catch (error) {
    console.log(error);
  }
};

//student k liye...
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path:"applications"
    });
    if (!jobId) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
        job,
        success:true
    })
  } catch (error) {
    console.log(error);
  }
};

//admin kitne jobs create kra h abi tk...iske liye hai ye
export const getAdminJobs = async (req,res) => {
    try {
       const adminId = req.id;
       const jobs = await Job.find({created_by:adminId}).populate({
        path:'company',
        createdAt:1
       });
       if(!jobs){
        return res.status(404).json({
            message:"Jobs not found.",
            success:false
        })
       } 
       return res.status(200).json({
        jobs,
        success:true
       })
    } catch (error) {
        console.log(error)
    }
}