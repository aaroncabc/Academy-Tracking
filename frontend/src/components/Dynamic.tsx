import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SchoolCard = dynamic(() => import("./ui/School"), { ssr: false });

interface School {
  id: number;
  name: string;
}

const SchoolList: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);

  // Fetch schools from your API or static data
  useEffect(() => {
    fetch("http://localhost:5000/api/schools")
      .then((response) => response.json())
      .then((data) => setSchools(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      {schools.map((school) => (
        <SchoolCard key={school.id} schools={[school]} />
      ))}
    </div>
  );
};

export default SchoolList;
