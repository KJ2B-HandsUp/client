import { RankingPageWrapper } from "../styled/ranking.styled";
import { useEffect } from "react";
import HomeButton from "../components/HomeButton";
import { UserType } from "../types/game.type";
import { AiOutlineCrown } from "react-icons/ai";

const cardColors = ["#f43f5e", "#3b82f6", "#22c55e"];
const crownColors = ["yellow", "silver", "brown"];

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
    nickname: "이영수",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 13,
    nickname: "박성현",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 14,
    nickname: "최지영",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 15,
    nickname: "강민호",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 16,
    nickname: "김은희",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 17,
    nickname: "이유진",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 18,
    nickname: "박재영",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 19,
    nickname: "최현민",
    highscore: Math.floor(Math.random() * 20) + 1,
  },
  {
    userId: 20,
    nickname: "강지은",
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
        <h2 style={{ marginTop: "50px" }}>This is Ranking Page.</h2>
        <table style={{ borderCollapse: "separate", borderSpacing: "10px" }}>
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
        </table>
      </RankingPageWrapper>
    </>
  );
}
