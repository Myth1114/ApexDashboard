import { useContext } from "react";
import { StudentContext } from "./StudentContext";

export const useStudents = () => {
  return useContext(StudentContext);
};
