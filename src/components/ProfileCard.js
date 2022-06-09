import defaultProfileImage from "../assets/images/profile.jpg";

const ProfileCard = ({ user }) => {
  return (
    <div className="card text-center">
      <div className="card-header">
        <img
          src={defaultProfileImage}
          alt="profile"
          width="200"
          height="200"
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body">
        <h3>{user?.username}</h3>
      </div>
    </div>
  );
};

export default ProfileCard;
