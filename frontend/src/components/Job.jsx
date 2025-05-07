import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Bookmark } from "lucide-react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();
  // const jobId = "hfdkhafoii";

  //yaha pe days ago calculate krne ek function banare...
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime); //MongoDB time ko JS Date object me convert
    const currentTime = new Date(); //Abhi ka current time
    const timeDifference = currentTime - createdAt; //Dono time ka difference in milliseconds
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60)); // Milliseconds ko dinon me convert
  };

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) == 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          variant="outline"
          className="rounded-full border-gray-100"
          size="icon"
        >
          <Bookmark />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button>
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Position
        </Badge>
        <Badge className="text-[#f83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-5">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="border border-gray-200"
        >
          Details
        </Button>
        <Button className="bg-[#7209b7] text-white">Save For Later</Button>
      </div>
    </div>
  );
};

export default Job;
