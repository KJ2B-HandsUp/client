import {
  UserProfileWrapper,
  UserImage,
  UserNickname,
} from "../styled/user.styled";
import { UserType } from "../types/game.type";
import { memo } from "react";

interface UserProfileProps {
  user: UserType | null;
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <>
      {user == null ? null : (
        <UserProfileWrapper>
          <UserImage src={user.profile_image_url} alt={user.nickname} />
          <UserNickname>{user.nickname}</UserNickname>
        </UserProfileWrapper>
      )}
    </>
  );
}

export const MemoizedUserProfile = memo(UserProfile);
