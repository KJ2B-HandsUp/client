import styled from "styled-components";

export const RoomListPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormWrapper = styled.form`
  display: block;
  margin: 50px;
  gap: 20px;
`;

//룸 생성할 떄 form 디자인 수정(0809)
export const Input = styled.input`
  max-width: 250px;
  padding: 10px;
  font-size: 17px;
  color: black;
  border-top-left-radius: .5em;
  border-bottom-left-radius: .5em;
  border: 2px solid #fff;
  margin-right: -10px;
`;

export const CreateButton = styled.button`
  border: none;
  background-color: #1363DF;
  text-decoration: none;
  padding: 13px;
  font-size: 17px;
  color: #fff;
  border-top-right-radius: .5em;
  border-bottom-right-radius: .5em;
  cursor: pointer;
`;