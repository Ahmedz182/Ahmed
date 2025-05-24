import React from "react";

const ProjectCard = ({
  img,
  title,
  tags,
  BuildIn = "N/A",
  desc = "N/A",
  preview,
}) => {
  const handlePreview = () => {
    window.open(preview, "_blank");
  };

  return (
    <div>
      <div
        onClick={handlePreview}
        className="relative group flex flex-col pb-5 cursor-pointer min-h-72 w-96 shadow-lg hover:bg-blue-500 hover:-translate-y-2 transition duration-200 ease-linear text-white rounded-lg">
        {/* Image Wrapper */}
        <div className="relative min-h-72 w-full">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-contain rounded-lg"
          />

          {/* Link Icon Overlay */}
          <span className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 ease-linear rounded-lg">
            <i className="ri-links-line text-5xl text-white "></i>
          </span>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-between items-start px-3 py-2 gap-y-1">
          <span className="text-lg font-medium line-clamp-1 group-hover:text-white text-black/80 tracking-wider">
            {title}
          </span>
          <span className="text-sm line-clamp-1 text-gray-500 group-hover:text-white tracking-wider">
            {desc}
          </span>
          <span className="text-sm font-medium text-gray-500 group-hover:text-white tracking-wider">
            Build In: <span className="text-black uppercase">{BuildIn}</span>
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-blue-500 group-hover:bg-white group-hover:text-black px-2 py-1 rounded text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
