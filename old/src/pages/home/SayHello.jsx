import React from "react";
import SectionTitle from "../../components/SectionTitle";
import detail from "../../assets/json/details";

const SayHello = () => {
  return (
    <div>
      <SectionTitle title="Say Hello" />
      <div className="flex flex-row bg-primary px-52 py-10 sm:flex-col sm:px-3 sm:py-3">
        <iframe
          title="contact_img"
          src="https://lottie.host/embed/e1c8118e-3c4e-4e9f-866e-416d79288f18/kpi96x5ODe.json"></iframe>
        <div className=" text-tertiary bg-primary px-48 pt-10 pb-20 sm:px-3 sm:pb-6 sm:text-sm">
          {detail.map((person, index) => (
            <pre key={index}>{JSON.stringify(person, null, 2)}</pre>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SayHello;
