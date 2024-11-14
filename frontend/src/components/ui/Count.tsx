"use client"
import React from "react";
import { GraduationCap } from "lucide-react";

interface StudentCountCardProps {
  count: number;
  texto: string;

}

const StudentCountCard: React.FC<StudentCountCardProps> = ({ count,texto }) => {
  return (
    <div className="flex items-center aspect-video p-4 rounded-xl shadow-md w-full bg-muted/50">
      <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
        <GraduationCap className="text-blue-600" size={50} /> {/* Icono de usuario */}
      </div>
      <div className="ml-4" >
        <p className="font-mono text-gray-600 text-3xl font-bold">{texto}</p>
        <p className="text-5xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
};
<div className="aspect-video rounded-xl bg-muted/50"></div>
export default StudentCountCard;
