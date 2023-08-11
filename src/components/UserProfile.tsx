import {
  UserProfileWrapper,
  UserImage,
  UserNickname,
} from "../styled/user.styled";
import { UserType } from "../types/game.type";
import { memo } from "react";

interface UserProfileProps {
  user: UserType | null;
  style: React.CSSProperties;
}

function UserProfile({ user, style }: UserProfileProps) {
  return (
    <>
      {user == null ? null : (
        <UserProfileWrapper style={style}>
          <UserImage src={user.profile_image_url} alt={user.nickname} />
          <UserNickname>{user.nickname}</UserNickname>
        </UserProfileWrapper>
      )}
    </>
  );
}

export const MemoizedUserProfile = memo(UserProfile);
