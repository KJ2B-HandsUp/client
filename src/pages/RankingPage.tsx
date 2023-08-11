import {
  RankingPageWrapper,
  Card,
  CustomTable,
  TableData,
  SubCard,
  Rank,
} from "../styled/ranking.styled";
import { useEffect } from "react";
import HomeButton from "../components/HomeButton";
import { UserType } from "../types/game.type";
import { AiOutlineCrown } from "react-icons/ai";

const cardColors = ["#f43f5e", "#3b82f6", "#22c55e"];
const crownColors = ["yellow", "silver", "black"];

let userList: UserType[] = [
  {
    userId: 1,
    nickname: "김용현",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 2,
    nickname: "장혁",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 3,
    nickname: "최광민",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 4,
    nickname: "김정인",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 5,
    nickname: "최도의",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 6,
    nickname: "박희경",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 7,
    nickname: "이성헌",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 8,
    nickname: "홍윤표",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 9,
    nickname: "박윤찬",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 10,
    nickname: "김동윤",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 11,
    nickname: "이동근",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 12,
    nickname: "박유빈",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 13,
    nickname: "최원",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 14,
    nickname: "김대인",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 15,
    nickname: "황현성",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 16,
    nickname: "유대겸",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 17,
    nickname: "왕준수",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 18,
    nickname: "이지현",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 19,
    nickname: "김민석",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 20,
    nickname: "강인호",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
];

userList.sort((a, b) => b.highscore! - a.highscore!);

export default function RankingPage() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_LOGINSERVER_IP}/scan`)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <RankingPageWrapper>
        <HomeButton />
        <Rank>Rank</Rank>
        <Card>
          <SubCard>
            <CustomTable>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Nickname</th>
                  <th>Highscore</th>
                </tr>
              </thead>
              <tbody>
                {userList.slice(0, 10).map((user, index) => (
                  <tr key={index}>
                    <TableData>
                      {index < 3 && (
                        <AiOutlineCrown style={{ color: crownColors[index] }} />
                      )}
                      {index + 1}위
                    </TableData>
                    <TableData>{user.nickname}</TableData>
                    <TableData>{user.highscore}</TableData>
                  </tr>
                ))}
              </tbody>
            </CustomTable>
          </SubCard>
        </Card>
      </RankingPageWrapper>
    </>
  );
}
{
  /* <table style={{ borderCollapse: "separate", borderSpacing: "10px" }}> 
          <thead>
            <tr>
              <th>Rank</th>
              <th>Nickname</th>
              <th>Highscore</th>
            </tr>
          </thead>
          <tbody>
            {userList.slice(0, 10).map((user, index) => (
              <tr key={index}>
                <td>
                  {index < 3 && (
                    <AiOutlineCrown style={{ color: crownColors[index] }} />
                  )}{" "}
                  {index + 1}위
                </td>
                <td>{user.nickname}</td>
                <td>{user.highscore}</td>
              </tr>
            ))}
            
          </tbody>
        </table> */
}
