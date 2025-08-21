import React from "react";
import ProfileScreen from "../../../components/screens/ProfileScreen/ProfileScreen";
import { useSelector } from "react-redux";
import { selectUser } from "../../../selectors/selector";

const Profile = () => {
  const user=useSelector(selectUser)
  return (
    <div className=" flex h-[100lvh] justify-center items-center">
      <ProfileScreen user={user}/>
    </div>
  );
};

export default Profile;
